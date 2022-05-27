import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { loadFeature, defineFeature } from 'jest-cucumber';

import { Bootstrap } from '../../../bootstrap/bootstrap';
// import { Course } from '../domain/entities/course';
// import { CourseBuilder } from './data-builders/course.builder';
import { CreateCourseRequestDtoBuilder } from './builders/create-course.request.builder';
import { CoursesModule } from './fake.courses.module';
import { CreateCourseRequestDto } from '../infra/dto/create-course.request.dto';

/**
 * INTEGRATION TEST
 * Making sure all our bits work together
 * Without worrying about third parties
 *
 * Scope
 * - validation of request
 * - receiving response
 */

const feature = loadFeature('./create-course.command.feature', {
  loadRelativePath: true,
});

defineFeature(feature, (test) => {
  let app: INestApplication;
  let createCourseRequestDto: CreateCourseRequestDto;
  // disabling no-explicit-any for testing purposes
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let httpServer: any;

  beforeEach(async () => {
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

  test('Successfully creating a course', ({ given, when, then }) => {
    let response: request.Response;

    given('the request is valid', () => {
      createCourseRequestDto = CreateCourseRequestDtoBuilder()
        .newValid()
        .build();
    });

    when('I attempt to create a course', async () => {
      response = await request(httpServer)
        .post(`/api/courses`)
        .send(createCourseRequestDto);
    });

    then('a new record should have been created', () => {
      expect(response.status).toBe(201);
    });
  });

  test('Fail; Invalid request', ({ given, when, then }) => {
    let response: request.Response;

    given('the request contains invalid data', () => {
      createCourseRequestDto = CreateCourseRequestDtoBuilder()
        .emptyExternalId()
        .buildNoCheck();
    });

    when('I attempt to create a course', async () => {
      response = await request(httpServer)
        .post(`/api/courses`)
        .send(createCourseRequestDto);
    });

    then('I should receive a RequestInvalidError/BadRequestException', () => {
      expect(response.status).toBe(400);
    });
  });

  // test('Fail; Invalid request, missing data', ({ given, when, then }) => {
  //   given('the request contains missing data', () => {
  //     createCourseRequestDto = CreateCourseRequestDtoBuilder()
  //       .noExternalId()
  //       .buildNoCheck();
  //   });

  //   when('I attempt to create a course', async () => {
  //     try {
  //       await controller.create(createCourseRequestDto);
  //     } catch (err) {
  //       error = err;
  //     }
  //   });

  //   then('I should receive a RequestInvalidError', () => {
  //     expect(error).toBeInstanceOf(BadRequestException);
  //     expect(error.message).toContain(RequestInvalidError.baseMessage());
  //   });
  // });
});
