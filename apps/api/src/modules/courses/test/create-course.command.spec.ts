import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { loadFeature, defineFeature } from 'jest-cucumber';

import { Bootstrap } from '../../../bootstrap/bootstrap';
import { CreateCourseRequestDtoBuilder } from './builders/create-course.request.builder';
import { CoursesModule } from './fake.courses.module';
import { CreateCourseRequestDto } from '../infra/dto/create-course.request.dto';
import { FakeCourseRepository } from '../adapter/implementations/fake/fake.course.repository';
import { CourseRepository } from '../adapter/ports/course.repository';
import { Course } from '../domain/entities/course';
import { executeTask } from '../../../shared/utils/execute-task';

/**
 * INTEGRATION TEST
 * Making sure all our bits work together
 * Without worrying about third parties
 *
 * Scope
 * - sending request
 * - receiving response
 */

const feature = loadFeature('./create-course.command.feature', {
  loadRelativePath: true,
});

defineFeature(feature, (test) => {
  let app: INestApplication;
  let repository: FakeCourseRepository;
  let createCourseRequestDto: CreateCourseRequestDto;
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
    repository = moduleRef.get<CourseRepository>(
      CourseRepository
    ) as FakeCourseRepository;
  });

  afterAll(async () => {
    await app.close();
  });

  test('Successfully creating a course', ({ given, and, when, then }) => {
    let response: request.Response;
    let courses: Course[];
    let coursesBefore: number;

    beforeAll(async () => {
      courses = await executeTask(repository.all());
      coursesBefore = courses.length;
    });

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

    then('a new record should have been created', async () => {
      courses = await executeTask(repository.all());
      expect(courses.length).toEqual(coursesBefore + 1);
    });

    and('a positive response received', () => {
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

  test('Fail; Source not found for ID provided', ({
    given,
    and,
    when,
    then,
  }) => {
    let response: request.Response;

    given('the request is valid', () => {
      // true
    });

    and('no record exists that matches our request', () => {
      createCourseRequestDto = CreateCourseRequestDtoBuilder()
        .noMatchingObject()
        .buildNoCheck();
    });

    when('I attempt to create a course', async () => {
      response = await request(httpServer)
        .post(`/api/courses`)
        .send(createCourseRequestDto);
    });

    then(
      'I should receive a RepositoryItemNotFoundError/NotFoundException',
      () => {
        expect(response.status).toBe(404);
      }
    );
  });

  test('Fail; Source does not translate into a valid Course', ({
    given,
    and,
    when,
    then,
  }) => {
    let response: request.Response;

    given('the request is valid', () => {
      // true
    });

    and('a matching record is found at the source', () => {
      // true
    });

    and('the returned source does not populate a valid Course', () => {
      createCourseRequestDto = CreateCourseRequestDtoBuilder()
        .newInvalid()
        .buildNoCheck();
    });

    when('I attempt to create a course', async () => {
      response = await request(httpServer)
        .post(`/api/courses`)
        .send(createCourseRequestDto);
    });

    then('I should receive a CourseInvalidError/BadRequestException', () => {
      expect(response.status).toBe(400);
    });
  });

  test('Fail; Source already exists in our DB', ({
    given,
    and,
    when,
    then,
  }) => {
    let response: request.Response;

    given('the request is valid', () => {
      // true
    });

    and('a matching record is found at the source', () => {
      // true
    });

    and('the returned source populates a valid course', () => {
      // true
    });

    and('the source DOES already exist in our DB', () => {
      createCourseRequestDto = CreateCourseRequestDtoBuilder()
        .exists()
        .buildNoCheck();
    });

    when('I attempt to create a course', async () => {
      response = await request(httpServer)
        .post(`/api/courses`)
        .send(createCourseRequestDto);
    });

    then('I should receive a CourseConflictError/ConflictException', () => {
      expect(response.status).toBe(409);
    });
  });
});
