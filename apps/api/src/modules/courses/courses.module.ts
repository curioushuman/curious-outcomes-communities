import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';

import { LoggableModule } from '@curioushuman/loggable';

import { CoursesController } from './infra/courses.controller';
import { CreateCourseHandler } from './application/commands/create-course/create-course.command';
import { CourseRepository } from './adapter/ports/course.repository';
import { MongoDbCourseRepository } from './adapter/implementations/mongo-db/mongo-db.course.repository';
import {
  MongoDbCourse,
  MongoDbCourseSchema,
} from './adapter/implementations/mongo-db/schema/course.schema';
import { CourseSourceRepository } from './adapter/ports/course-source.repository';
import { FakeCourseSourceRepository } from './adapter/implementations/fake/fake.course-source.repository';
import { ErrorFactory } from '../../shared/domain/errors/error-factory';
import { FakeRepositoryErrorFactory } from '../../shared/adapter/fake-repository.error-factory';

const commandHandlers = [CreateCourseHandler];

const repositories = [
  {
    provide: CourseRepository,
    useClass: MongoDbCourseRepository,
  },
  {
    provide: CourseSourceRepository,
    useClass: FakeCourseSourceRepository,
  },
];

const services = [
  {
    provide: ErrorFactory,
    useClass: FakeRepositoryErrorFactory,
  },
];

/**
 * Courses module
 *
 * NOTES
 * - Course is the aggregate root of this module
 *  - therefore all *commands* should be routed through it
 */

@Module({
  imports: [
    CqrsModule,
    HttpModule,
    LoggableModule,
    MongooseModule.forFeature([
      { name: MongoDbCourse.name, schema: MongoDbCourseSchema },
    ]),
  ],
  controllers: [CoursesController],
  providers: [...commandHandlers, ...repositories, ...services],
  exports: [],
})
export class CoursesModule {}
