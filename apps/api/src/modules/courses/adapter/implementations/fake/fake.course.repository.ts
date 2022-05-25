import { Injectable, NotFoundException } from '@nestjs/common';
import * as TE from 'fp-ts/lib/TaskEither';
import * as O from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/function';

import { Course } from '../../../domain/entities/course';
import { CourseRepository } from '../../ports/course.repository';
import { CourseBuilder } from '../../../test/stubs/course.stub';
import { FindCourseDto } from '../../../application/queries/find-course/find-course.dto';
import { ErrorFactory } from '../../../../../shared/domain/errors/error-factory';

@Injectable()
export class FakeCourseRepository implements CourseRepository {
  private courses: Course[] = [];

  constructor(private readonly errorFactory: ErrorFactory) {
    this.courses.push(CourseBuilder().build());
    this.courses.push(CourseBuilder().withFunkyChars().build());
  }

  public findOne(dto: FindCourseDto): TE.TaskEither<Error, Course> {
    const { externalId } = dto;
    return TE.tryCatch(
      async () => {
        const course = this.courses.find((cs) => cs.externalId === externalId);
        return pipe(
          course,
          O.fromNullable,
          O.fold(
            () => {
              // this mimics an API or DB call throwing an error
              throw new NotFoundException(
                `Course with externalId ${externalId} not found`
              );
            },
            (course) => course
          )
        );
      },
      // (error: Error) => error as Error
      (error: Error) => this.errorFactory.newError(error)
    );
  }

  public save(course: Course): TE.TaskEither<Error, void> {
    return TE.tryCatch(
      async () => {
        this.courses.push(course);
      },
      // (error: Error) => error as Error
      (error: Error) => this.errorFactory.newError(error)
    );
  }

  all = (): TE.TaskEither<Error, Course[]> => {
    return TE.right(this.courses);
  };
}
