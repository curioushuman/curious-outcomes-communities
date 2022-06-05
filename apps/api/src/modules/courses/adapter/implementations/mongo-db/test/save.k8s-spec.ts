import { loadFeature, defineFeature } from 'jest-cucumber';
import { Test } from '@nestjs/testing';
import { Connection } from 'mongoose';

import { MongoDbCourseRepository } from '../mongo-db.course.repository';
import { CourseRepository } from '../../../ports/course.repository';
import { executeTask } from '../../../../../../shared/utils/execute-task';
import { Course } from '../../../../domain/entities/course';
import { CourseBuilder } from './builders/course.builder';
import { MongoDbModule } from '../../../../../../shared/infra/database/mongo-db/mongo-db.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoDbCourse, MongoDbCourseSchema } from '../schema/course.schema';
import { MongoDbService } from '../../../../../../shared/infra/database/mongo-db/mongo-db.service';

/**
 * INTEGRATION TEST
 * SUT = the save function OF an external repository
 * i.e. are we actually connecting with and getting data from MongoDB?
 *
 * Scope
 * - repository functions and behaviours
 * - changes to API/data structure
 * - handling of their various responses/errors
 */

const feature = loadFeature('./save.feature', {
  loadRelativePath: true,
});

defineFeature(feature, (test) => {
  let repository: MongoDbCourseRepository;
  let connection: Connection;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        MongoDbModule,
        MongooseModule.forFeature([
          { name: MongoDbCourse.name, schema: MongoDbCourseSchema },
        ]),
      ],
      providers: [
        {
          provide: CourseRepository,
          useClass: MongoDbCourseRepository,
        },
      ],
    }).compile();

    repository = moduleRef.get<CourseRepository>(
      CourseRepository
    ) as MongoDbCourseRepository;
    connection = moduleRef.get<MongoDbService>(MongoDbService).getConnection();
  });

  afterAll(async () => {
    await CourseBuilder().delete(connection);
    connection.close();
  });

  test('Successfully creating a course', ({ given, and, when, then }) => {
    // Disabled for testing
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let result: any;
    let error: Error;
    let tempCourse: Course;

    given('I am authorised to access the repository', () => {
      // out of scope
    });

    and('a matching record does not already exist in our DB', () => {
      tempCourse = CourseBuilder().build();
    });

    when('I attempt to create a course', async () => {
      try {
        result = await executeTask(repository.save(tempCourse));
      } catch (err) {
        error = err;
        expect(error).toBeUndefined();
      }
    });

    then('a new record should have been created', async () => {
      const courseCreated = await CourseBuilder().find(connection);
      expect(courseCreated?.externalId).toEqual(tempCourse.externalId);
    });

    and('no result is returned', () => {
      expect(result).toBeUndefined();
    });
  });

  test('Fail; Course could not be created', ({ given, and, when, then }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let result: any;
    let error: Error;
    let invalidCourse: Course;

    given('I am authorised to access the repository', () => {
      // assumed
    });

    and('an error occurred during record creation', () => {
      invalidCourse = CourseBuilder().invalid().build();
    });

    when('I attempt to create a course', async () => {
      try {
        result = await executeTask(repository.save(invalidCourse));
      } catch (err) {
        error = err;
      }
    });

    then('I should receive an Error', () => {
      expect(error).toBeInstanceOf(Error);
    });

    and('no result is returned', () => {
      expect(result).toBeUndefined();
    });
  });
});
