import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { Connection } from 'mongoose';

import { Bootstrap } from '../../../bootstrap/bootstrap';
import { AppModule } from '../../../app/app.module';
import { CreateCourseRequestDtoBuilder } from './stubs/create-course.request.stub';
import { CreateCourseRequestDto } from '../infra/dto/create-course.request.dto';
import { MongoDbService } from '../../../shared/infra/database/mongo-db/mongo-db.service';

/**
 * E2E testing might look similar to more localised integration tests
 * However it should also include higher level aspects such as:
 * - authentication/authorisation/access
 *
 * * NOTE: these often fail due to timeout the first time you run skaffold dev
 * * If you make an additional minor change they'll run again and pass (grrr)
 *
 * TODO
 * - [ ] write proper acceptance tests and then come back to this
 */

jest.setTimeout(10000);

describe('[E2E] CoursesModule', () => {
  let app: INestApplication;
  let connection: Connection;
  // disabling no-explicit-any for testing purposes
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let httpServer: any;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    Bootstrap.useGlobalSettings(app);
    await app.init();
    httpServer = app.getHttpServer();
    connection = moduleRef.get<MongoDbService>(MongoDbService).getConnection();
    await connection.collection('mongodbcourses').deleteMany({});
  });

  afterAll(async () => {
    await app.close();
  });

  describe('[COMMAND] Create Course', () => {
    let response: request.Response;
    let createCourseDto: CreateCourseRequestDto;
    describe('When creating a Course from Source', () => {
      describe('And the request is valid', () => {
        describe('And the source exists', () => {
          describe('And the source is valid / does not exist in our DB', () => {
            beforeAll(async () => {
              createCourseDto = CreateCourseRequestDtoBuilder().build();
              response = await request(httpServer)
                .post(`/api/courses`)
                .send(createCourseDto);
            });
            test('Then response status should be 201', () => {
              expect(response.status).toBe(201);
            });

            test('And a course should have been added to the database', async () => {
              const courses = await connection
                .collection('mongodbcourses')
                .find()
                .toArray();
              expect(courses.length).toEqual(1);
            });
          });
          describe('And the source is valid BUT IT ALREADY EXISTS in our DB', () => {
            test.todo(
              'Then it should return CourseConflictError extends ConflictException'
            );
          });
        });
      });
    });
  });
});
