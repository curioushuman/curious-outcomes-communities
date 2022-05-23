import { CommandHandler, ICommandHandler, ICommand } from '@nestjs/cqrs';
import { BadRequestException } from '@nestjs/common';
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
import { RequestInvalidError } from 'apps/api/src/shared/domain/errors/request-invalid.error';

export class CreateCourseCommand implements ICommand {
  constructor(public readonly createCourseDto: CreateCourseDto) {}
}

/**
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
     * NOTE: we return whatever error they return
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
        pipe(this.parseSource(courseSource), TE.fromEither)
      ),
      TE.chain((course) => saveCourse(course))
    );

    return executeTask(task);
  }

  private parseDto(
    dto: CreateCourseDto
  ): E.Either<BadRequestException, FindCourseSourceDto> {
    return E.tryCatch<BadRequestException, FindCourseSourceDto>(
      () => {
        return pipe(dto, CreateCourseMapper.toFindCourseSourceDto);
      },
      (error: Error) => new RequestInvalidError(error.toString())
    );
  }

  private parseSource(
    source: CourseSource
  ): E.Either<BadRequestException, Course> {
    return E.tryCatch<BadRequestException, Course>(
      () => {
        return pipe(source, CreateCourseMapper.fromSourceToCourse);
      },
      (error: Error) => new CourseInvalidError(error.toString())
    );
  }
}
