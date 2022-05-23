import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { TaskEither, tryCatch } from 'fp-ts/lib/TaskEither';

import { Course } from '../../../domain/entities/course';
import { CourseRepository } from '../../ports/course.repository';
import { CourseBuilder } from '../../../test/stubs/course.stub';
import { FakeRepositoryErrorFactory } from '../../../../../shared/adapter/fake-repository.error-factory';
import { ErrorFactory } from '../../../../../shared/domain/errors/error-factory';

@Injectable()
export class FakeCourseRepository implements CourseRepository {
  private courses: Course[] = [];
  public errorFactory: ErrorFactory;

  constructor() {
    this.errorFactory = new FakeRepositoryErrorFactory();
    this.courses.push(CourseBuilder().build());
    this.courses.push(CourseBuilder().withFunkyChars().build());
  }

  // public findOne(slug: string): TaskEither<Error, Course> {
  //   return tryCatch(
  //     async () => {
  //       return this.courses.find((courses) => courses.slug === slug);
  //     },
  //     (reason: unknown) => new InternalServerErrorException(reason)
  //   );
  // }

  public save(course: Course): TaskEither<Error, void> {
    return tryCatch(
      async () => {
        this.courses.push(course);
      },
      (reason: unknown) => new InternalServerErrorException(reason)
    );
  }

  all = (): TaskEither<Error, Course[]> => {
    return tryCatch(
      async () => {
        return this.courses;
      },
      (reason: unknown) => new InternalServerErrorException(reason)
    );
  };
}
