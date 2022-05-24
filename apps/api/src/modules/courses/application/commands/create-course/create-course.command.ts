import { CommandHandler, ICommandHandler, ICommand } from '@nestjs/cqrs';
import * as TE from 'fp-ts/lib/TaskEither';
import * as E from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/function';

import { CourseRepository } from '../../../adapter/ports/course.repository';
import { executeTask } from '../../../../../shared/utils/execute-task';
import { CreateCourseDto } from './create-course.dto';
import { CreateCourseMapper } from './create-course.mapper';
import { CourseSourceRepository } from '../../../adapter/ports/course-source.repository';
import { Course } from '../../../domain/entities/course';
import { CourseSource } from '../../../domain/entities/course-source';
import { FindCourseSourceDto } from '../../queries/find-course-source/find-course-source.dto';
import { CourseInvalidError } from '../../../domain/errors/course-invalid.error';
import { RequestInvalidError } from '../../../../../shared/domain/errors/request-invalid.error';
import { CourseConflictError } from '../../../domain/errors/course-conflict.error';

export class CreateCourseCommand implements ICommand {
  constructor(public readonly createCourseDto: CreateCourseDto) {}
}

/**
 * Command handler for create course
 * TODO
 * - [ ] logging
 */
@CommandHandler(CreateCourseCommand)
export class CreateCourseHandler
  implements ICommandHandler<CreateCourseCommand>
{
  constructor(
    private readonly courseRepository: CourseRepository,
    private readonly courseSourceRepository: CourseSourceRepository
  ) {}

  async execute(command: CreateCourseCommand): Promise<void> {
    /**
     * These are the business functions!!
     * NOTE: repository errors/exceptions are handled in the repository itself
     * therefore we let them pass on through to be caught by Nest and returned as
     * the relevant exception
     */
    const findSource = (dto: FindCourseSourceDto) =>
      TE.tryCatch<Error, CourseSource>(
        async () => await executeTask(this.courseSourceRepository.findOne(dto)),
        (error: Error) => error as Error
      );

    const saveCourse = (course: Course) =>
      TE.tryCatch<Error, void>(
        async () => await executeTask(this.courseRepository.save(course)),
        (error: Error) => error as Error
      );

    const findCourseFromCourse = (course: Course) =>
      TE.tryCatch<Error, Course>(
        async () =>
          await executeTask(
            this.courseRepository.findOne(
              CreateCourseMapper.fromCourseToFindCourseDto(course)
            )
          ),
        (error: Error) => error as Error
      );

    /**
     * Then we set up the smaller steps, to support business time
     *
     * TODO
     * - [ ] check source already has a courseId associated with it
     * - [ ] check if we already have that externalId in our DB
     */
    const { createCourseDto } = command;

    const task = pipe(
      createCourseDto,
      this.parseDto,
      TE.fromEither,
      TE.chain((dto) => findSource(dto)),
      TE.chain((courseSource) =>
        pipe(courseSource, this.parseSource, TE.fromEither)
      ),
      TE.chain((course) =>
        pipe(
          course,
          findCourseFromCourse,
          TE.chain((courseFound) => {
            // this works, but doesn't feel right
            // need to read the FP book
            throw new CourseConflictError(courseFound.name);
            // this feels more right, but doesn't work
            // return TE.left(new CourseConflictError(courseFound.name));
          }),
          TE.alt(() => TE.right(course))
        )
      ),
      TE.chain((course) => saveCourse(course))
    );

    return executeTask(task);
  }

  private parseDto(
    dto: CreateCourseDto
  ): E.Either<RequestInvalidError, FindCourseSourceDto> {
    return E.tryCatch<RequestInvalidError, FindCourseSourceDto>(
      () => {
        return pipe(dto, CreateCourseMapper.toFindCourseSourceDto);
      },
      (error: Error) => new RequestInvalidError(error.toString())
    );
  }

  private parseSource(
    source: CourseSource
  ): E.Either<CourseInvalidError, Course> {
    return E.tryCatch<CourseInvalidError, Course>(
      () => {
        return pipe(source, CreateCourseMapper.fromSourceToCourse);
      },
      (error: Error) => new CourseInvalidError(error.toString())
    );
  }

  /**
   * We've broadened the scope of Left to Error
   * As other issues may occur during the repo.findOne
   *
   * NOTE: the TE.fold looks like it is in reversed order
   * This is on purpose, if we are successful in our find
   * we need to return an error
   */
  private checkForDuplicatedSource(
    course: Course
  ): TE.TaskEither<Error, Course> {
    return TE.tryCatch<Error, Course>(
      async () => {
        const task = pipe(
          course,
          CreateCourseMapper.fromCourseToFindCourseDto,
          this.courseRepository.findOne,
          TE.fold(
            () => TE.right(course),
            () => TE.left(new CourseConflictError())
          )
        );
        return executeTask(task);
      },
      (error: Error) => error as Error
    );
  }
}
