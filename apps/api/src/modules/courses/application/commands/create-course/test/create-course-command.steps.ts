import { NotFoundException } from '@nestjs/common';
import { loadFeature, defineFeature } from 'jest-cucumber';
import { Test, TestingModule } from '@nestjs/testing';

import {
  CreateCourseCommand,
  CreateCourseHandler,
} from '../create-course.command';
import { CourseRepository } from '../../../../adapter/ports/course.repository';
import { FakeCourseRepository } from '../../../../adapter/implementations/fake/fake.course.repository';
import { CourseSourceRepository } from '../../../../adapter/ports/course-source.repository';
import { FakeCourseSourceRepository } from '../../../../adapter/implementations/fake/fake.course-source.repository';
import { CreateCourseDtoBuilder } from './stubs/create-course.dto.stub';
import { executeTask } from '../../../../../../shared/utils/execute-task';
import { CreateCourseRequestDto } from '../../../../infra/dto/create-course.request.dto';
import { Course } from '../../../../domain/entities/course';
import { RepositoryItemNotFoundError } from '../../../../../../shared/domain/errors/repository/item-not-found.error';
import { CourseInvalidError } from '../../../../domain/errors/course-invalid.error';
import { CourseConflictError } from '../../../../domain/errors/course-conflict.error';
import { ErrorFactory } from '../../../../../../shared/domain/errors/error-factory';
import { FakeRepositoryErrorFactory } from '../../../../../../shared/adapter/fake-repository.error-factory';

/**
 * SUT = the command & command handler
 *
 * Out of scope
 * - request validation
 * - repository authorisation
 * - repository access issues
 */

const feature = loadFeature('./create-course-command.feature', {
  loadRelativePath: true,
});

defineFeature(feature, (test) => {
  let repository: FakeCourseRepository;
  let handler: CreateCourseHandler;
  let createCourseDto: CreateCourseRequestDto;
  // disabling no-explicit-any for testing purposes
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let error: any;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        CreateCourseHandler,
        { provide: CourseRepository, useClass: FakeCourseRepository },
        {
          provide: CourseSourceRepository,
          useClass: FakeCourseSourceRepository,
        },
        {
          provide: ErrorFactory,
          useClass: FakeRepositoryErrorFactory,
        },
      ],
    }).compile();

    repository = moduleRef.get<CourseRepository>(
      CourseRepository
    ) as FakeCourseRepository;
    handler = moduleRef.get<CreateCourseHandler>(CreateCourseHandler);
  });

  test('Successfully creating a course', ({ given, and, when, then }) => {
    let courses: Course[];
    let coursesBefore: number;
    // disabling no-explicit-any for testing purposes
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let result: any;

    given('a matching record is found at the source', () => {
      // we know this to exist in our fake repo
      createCourseDto = CreateCourseDtoBuilder().newValid().build();
    });

    and('the returned source populates a valid course', () => {
      // we know this to be true
      // out of scope for this test
    });

    and('the source does not already exist in our DB', async () => {
      courses = await executeTask(repository.all());
      coursesBefore = courses.length;
    });

    when('I attempt to create a course', async () => {
      result = await handler.execute(new CreateCourseCommand(createCourseDto));
    });

    then('a new record should have been created', async () => {
      courses = await executeTask(repository.all());
      expect(courses.length).toEqual(coursesBefore + 1);
    });

    and('no result is returned', () => {
      expect(result).toEqual(undefined);
    });
  });

  test('Fail; Source not found for ID provided', ({ given, when, then }) => {
    given('no record exists that matches our request', () => {
      createCourseDto = CreateCourseDtoBuilder().noMatchingObject().build();
    });

    when('I attempt to create a course', async () => {
      try {
        await handler.execute(new CreateCourseCommand(createCourseDto));
      } catch (err) {
        error = err;
      }
    });

    then('I should receive a RepositoryItemNotFoundError', () => {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toContain(
        RepositoryItemNotFoundError.baseMessage()
      );
    });
  });

  test('Fail; Source does not translate into a valid Course', ({
    given,
    and,
    when,
    then,
  }) => {
    given('a matching record is found at the source', () => {
      createCourseDto = CreateCourseDtoBuilder().newInvalid().build();
    });

    and('the returned source does not populate a valid Course', () => {
      // this occurs during
    });

    when('I attempt to create a course', async () => {
      try {
        await handler.execute(new CreateCourseCommand(createCourseDto));
      } catch (err) {
        error = err;
      }
    });

    then('I should receive a CourseInvalidError', () => {
      expect(error).toBeInstanceOf(CourseInvalidError);
    });
  });

  test('Fail; Source already exists in our DB', ({
    given,
    and,
    when,
    then,
  }) => {
    given('a matching record is found at the source', () => {
      // confirmed
    });

    and('the returned source populates a valid course', () => {
      // known
    });

    and('the source DOES already exist in our DB', () => {
      // added above, in first test
      createCourseDto = CreateCourseDtoBuilder().exists().build();
    });

    when('I attempt to create a course', async () => {
      try {
        const blkah = await handler.execute(
          new CreateCourseCommand(createCourseDto)
        );
      } catch (err) {
        error = err;
      }
    });

    then('I should receive a CourseConflictError', () => {
      expect(error).toBeInstanceOf(CourseConflictError);
    });
  });
});
