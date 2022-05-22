import { TaskEither } from 'fp-ts/lib/TaskEither';

import { Course } from '../../domain/entities/course';

export abstract class CourseRepository {
  // abstract findOne(slug: string): TaskEither<Error, Course>;
  abstract save(course: Course): TaskEither<Error, void>;
}
