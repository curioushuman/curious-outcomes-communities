import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';

import { Bootstrap } from '../../../bootstrap/bootstrap';
// import { Course } from '../domain/entities/course';
// import { CourseBuilder } from './data-builders/course.builder';
import { CreateCourseRequestDtoBuilder } from './builders/create-course.request.builder';
import { CoursesModule } from './fake.courses.module';
import { CreateCourseRequestDto } from '../infra/dto/create-course.request.dto';

/**
 * For local integration tests we just want to make sure
 * - endpoints behave how they should
 *
 * We ignore some of the higher elements such as:
 * - authentication/authorisation/access
 *
 * We also ignore some of the lower elements such as:
 * - logging
 *
 * We use mocks/fakes to focus on the subject under test (SUT)
 *
 * TODO
 * - [ ] write proper acceptance tests and then come back to this
 */

describe('[Unit] CoursesModule', () => {
  let app: INestApplication;
  // disabling no-explicit-any for testing purposes
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let httpServer: any;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [CoursesModule],
    }).compile();

    app = moduleRef.createNestApplication();
    Bootstrap.useGlobalSettings(app);
    await app.init();
    httpServer = app.getHttpServer();
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
          });
        });
      });
    });
  });
});
