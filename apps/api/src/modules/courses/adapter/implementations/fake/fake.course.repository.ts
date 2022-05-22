import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { TaskEither, tryCatch } from 'fp-ts/lib/TaskEither';

import { Course } from '../../../domain/entities/course';
import { CourseRepository } from '../../ports/course.repository';
import { CourseBuilder } from '../../../test/stubs/course.stub';

@Injectable()
export class FakeCourseRepository implements CourseRepository {
  private courses: Course[] = [];

  constructor() {
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
