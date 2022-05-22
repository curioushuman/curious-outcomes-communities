import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TaskEither, tryCatch } from 'fp-ts/lib/TaskEither';

import { Course } from '../../../domain/entities/course';
import { CourseRepository } from '../../ports/course.repository';
import { MongoDbCourse, MongoDbCourseModel } from './schema/course.schema';

@Injectable()
export class MongoDbCourseRepository implements CourseRepository {
  constructor(
    @InjectModel(MongoDbCourse.name)
    private mongoDbCourseModel: MongoDbCourseModel
  ) {}

  save = (course: Course): TaskEither<Error, void> => {
    return tryCatch(
      async () => {
        const entity = new this.mongoDbCourseModel(course);
        await entity.save();
        return;
      },
      (reason: unknown) => new InternalServerErrorException(reason)
    );
  };
}
