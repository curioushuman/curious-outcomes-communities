import { TaskEither } from 'fp-ts/lib/TaskEither';

import { CourseSource } from '../../domain/entities/course-source';
import { FindCourseSourceDto } from '../../application/queries/find-course-source/find-course-source.dto';
import { Repository } from '../../../../shared/adapter/repository';

export abstract class CourseSourceRepository extends Repository {
  abstract findOne(dto: FindCourseSourceDto): TaskEither<Error, CourseSource>;
}
