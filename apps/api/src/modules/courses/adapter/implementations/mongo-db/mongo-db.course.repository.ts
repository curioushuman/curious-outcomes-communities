import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as TE from 'fp-ts/lib/TaskEither';
import * as O from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/function';

import { Course } from '../../../domain/entities/course';
import { CourseRepository } from '../../ports/course.repository';
import { FindCourseDto } from '../../../application/queries/find-course/find-course.dto';
import { RequestInvalidError } from '../../../../../shared/domain/errors/request-invalid.error';
import { MongoDbCourseMapper } from './mongo-db.course.mapper';
import { MongoDbCourse, MongoDbCourseModel } from './schema/course.schema';
import { ExternalId } from '../../../domain/value-objects/external-id';
import { NotYetImplementedError } from '../../../../../shared/domain/errors/not-yet-implemented.error';
import { RepositoryItemNotFoundError } from '../../../../../shared/domain/errors/repository/item-not-found.error';

@Injectable()
export class MongoDbCourseRepository implements CourseRepository {
  constructor(
    @InjectModel(MongoDbCourse.name)
    private mongoDbCourseModel: MongoDbCourseModel
  ) {}

  findOne = (dto: FindCourseDto): TE.TaskEither<Error, Course> => {
    const { externalId } = dto;
    return pipe(
      externalId,
      O.fromNullable,
      O.fold(
        () =>
          TE.left(
            new NotYetImplementedError('Find by query will be available soon.')
          ),
        (extId) => {
          return this.findOneById(extId);
        }
      )
    );
  };

  findOneById = (externalId: ExternalId): TE.TaskEither<Error, Course> => {
    return TE.tryCatch(
      async () => {
        if (!externalId) {
          throw new RequestInvalidError(
            'Invalid ID supplied to findOne() in MongoDb'
          );
        }
        // const entity = new this.mongoDbCourseModel(course);
        const result = await this.mongoDbCourseModel
          .findOne({
            externalId,
          })
          .exec();

        return this.parseMongoDbCourse(result);
      },
      (error: Error) => error as Error
    );
  };

  /**
   * Processes result from DB; returns mapped result or error
   */
  private parseMongoDbCourse = (mongoDbCourse: MongoDbCourse): Course => {
    return pipe(
      mongoDbCourse,
      O.fromNullable,
      O.fold(
        () => {
          throw new RepositoryItemNotFoundError();
        },
        (course) => {
          return MongoDbCourseMapper.toDomain(course);
        }
      )
    );
  };

  save = (course: Course): TE.TaskEither<Error, void> => {
    return TE.tryCatch(
      async () => {
        const entity = new this.mongoDbCourseModel(course);
        await entity.save();
        return;
      },
      (error: Error) => error as Error
    );
  };
}
