import { Connection } from 'mongoose';
import { Filter, InferIdType } from 'mongodb';
import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/function';

import { Course } from '../../../../../domain/entities/course';
import { MongoDbCourse } from '../../schema/course.schema';
import { CourseBuilder } from '../../../../../test/builders/course.builder';
import { executeTask } from '../../../../../../../shared/utils/execute-task';
import { MongoDbCourseMapper } from '../../mongo-db.course.mapper';

/**
 * Creates/deletes records in MongoDB around tests
 *
 * NOTES
 * - reliance on the objects having a CO_test_context:string field in Salesforce
 *
 * TODO
 * - [ ] implement a tidyUp system that doesn't rely on a custom field
 */

export class CourseManufacturer {
  private context = 'CO_TEST';
  constructor(private readonly connection: Connection, context?: string) {
    this.context = context ?? this.context;
  }

  setContext(context: string): void {
    this.context = context;
  }

  randomString(base: string): string {
    const rando = Math.floor(Math.random() * 1789);
    return `${base} ${rando}`;
  }

  default(): Course {
    return CourseBuilder().forTidy(this.context).build();
  }

  async build(course?: Course): Promise<Course> {
    const courseToBuild = course ?? this.default();
    const task = pipe(
      courseToBuild,
      MongoDbCourseMapper.toPersist,
      this.create,
      TE.chain((id) => this.findById(id))
    );
    return executeTask(task);
  }

  async check(course: Course): Promise<Course> {
    const filter = {
      name: course.name,
    } as Filter<MongoDbCourse>;
    const task = pipe(filter, this.findOne);
    return executeTask(task);
  }

  create = (
    mongoDbCourse: MongoDbCourse
  ): TE.TaskEither<Error, InferIdType<MongoDbCourse>> => {
    return TE.tryCatch(
      async () => {
        const result = await this.connection
          .collection<MongoDbCourse>('mongodbcourses')
          .insertOne(mongoDbCourse);
        return result.insertedId;
      },
      (error: Error) => error as Error
    );
  };

  findById = (id: InferIdType<MongoDbCourse>): TE.TaskEither<Error, Course> => {
    return TE.tryCatch(
      async () => {
        const course = await this.connection
          .collection<MongoDbCourse>('mongodbcourses')
          .findOne({ _id: id });
        return MongoDbCourseMapper.toDomain(course);
      },
      (error: Error) => error as Error
    );
  };

  findOne = (filter: Filter<MongoDbCourse>): TE.TaskEither<Error, Course> => {
    return TE.tryCatch(
      async () => {
        const mongoDbCourse = await this.connection
          .collection<MongoDbCourse>('mongodbcourses')
          .findOne(filter);
        return mongoDbCourse
          ? MongoDbCourseMapper.toDomain(mongoDbCourse)
          : null;
      },
      (error: Error) => error as Error
    );
  };

  async tidyUp(): Promise<void> {
    return executeTask(this.deleteAll());
  }

  deleteAll = (): TE.TaskEither<Error, void> => {
    return TE.tryCatch(
      async () => {
        await this.connection.collection('mongodbcourses').deleteMany({
          name: {
            $regex: `.*${this.context}$`,
          },
        });
      },
      (error: Error) => error as Error
    );
  };
}
