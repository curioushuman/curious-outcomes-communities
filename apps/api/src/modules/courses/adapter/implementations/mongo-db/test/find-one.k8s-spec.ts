import { loadFeature, defineFeature } from 'jest-cucumber';
import { Test } from '@nestjs/testing';
import { Connection } from 'mongoose';

import { MongoDbCourseRepository } from '../mongo-db.course.repository';
import { CourseRepository } from '../../../ports/course.repository';
import { executeTask } from '../../../../../../shared/utils/execute-task';
import { Course } from '../../../../domain/entities/course';
import { FindCourseDto } from '../../../../application/queries/find-course/find-course.dto';
import { CourseBuilder } from './builders/course.builder';
import { MongoDbModule } from '../../../../../../shared/infra/database/mongo-db/mongo-db.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoDbCourse, MongoDbCourseSchema } from '../schema/course.schema';
import { MongoDbService } from '../../../../../../shared/infra/database/mongo-db/mongo-db.service';
import { RepositoryItemNotFoundError } from '../../../../../../shared/domain/errors/repository/item-not-found.error';

/**
 * INTEGRATION TEST
 * SUT = the findOne function OF an external repository
 * i.e. are we actually connecting with and getting data from MongoDB?
 *
 * Scope
 * - repository functions and behaviours
 * - changes to API/data structure
 * - handling of their various responses/errors
 */

const feature = loadFeature('./find-one.feature', {
  loadRelativePath: true,
});

defineFeature(feature, (test) => {
  let repository: MongoDbCourseRepository;
  let connection: Connection;
  let tempCourse: Course;
  let findCourseDto: FindCourseDto;

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

    tempCourse = await CourseBuilder().create(connection);
  });

  afterAll(async () => {
    await CourseBuilder().delete(connection);
    connection.close();
  });

  test('Successfully find one course', ({ given, and, when, then }) => {
    let result: Course;
    let error: Error;

    given('I am authorised to access the repository', () => {
      // out of scope
    });

    and('a matching record exists in the repository', () => {
      findCourseDto = {
        externalId: tempCourse.externalId,
      };
    });

    when('I request the course by ID', async () => {
      try {
        result = await executeTask(repository.findOne(findCourseDto));
      } catch (err) {
        error = err;
        expect(error).toBeUndefined();
      }
    });

    then('a course corresponding to that ID should be returned', () => {
      expect(result.externalId).toEqual(tempCourse.externalId);
    });
  });

  test('Fail; Course not found for ID provided', ({
    given,
    and,
    when,
    then,
  }) => {
    let absentCourse: Course;
    let result: Course;
    let error: Error;

    given('I am authorised to access the repository', () => {
      // assumed
    });

    and('a matching record DOES NOT exist at the repository', () => {
      absentCourse = CourseBuilder().noMatchingObject().build();
      findCourseDto = {
        externalId: absentCourse.externalId,
      };
    });

    when('I request the course by ID', async () => {
      try {
        result = await executeTask(repository.findOne(findCourseDto));
      } catch (err) {
        error = err;
      }
    });

    then('I should receive an Error', () => {
      expect(error).toBeInstanceOf(RepositoryItemNotFoundError);
    });

    and('no result is returned', () => {
      expect(result).toBeUndefined();
    });
  });
});
