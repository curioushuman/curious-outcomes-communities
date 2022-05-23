import { TaskEither } from 'fp-ts/lib/TaskEither';

import { Repository } from '../../../../shared/adapter/repository';
import { Course } from '../../domain/entities/course';

export abstract class CourseRepository extends Repository {
  // abstract findOne(slug: string): TaskEither<Error, Course>;
  abstract save(course: Course): TaskEither<Error, void>;
}
