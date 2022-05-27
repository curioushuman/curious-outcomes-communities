import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CqrsModule, CommandBus } from '@nestjs/cqrs';
import { loadFeature, defineFeature } from 'jest-cucumber';

import { LoggableLogger } from '@curioushuman/loggable';

import { CoursesController } from '../../courses.controller';
import { CreateCourseRequestDto } from '../../dto/create-course.request.dto';
import { CreateCourseRequestDtoBuilder } from '../../../test/builders/create-course.request.builder';
import { RequestInvalidError } from '../../../../../shared/domain/errors/request-invalid.error';

/**
 * UNIT TEST
 * SUT = the controller
 *
 * Scope
 * - validation of request
 * - transformation of request
 * - calling the command/query
 */

const feature = loadFeature('./create-course-command.feature', {
  loadRelativePath: true,
});

const commandBus = {
  execute: jest.fn(),
};

defineFeature(feature, (test) => {
  let controller: CoursesController;
  let createCourseRequestDto: CreateCourseRequestDto;
  // disabling no-explicit-any for testing purposes
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let error: any;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule],
      controllers: [CoursesController],
      providers: [
        LoggableLogger,
        { provide: CommandBus, useValue: commandBus },
      ],
    }).compile();

    controller = moduleRef.get<CoursesController>(CoursesController);
    jest.clearAllMocks();
  });

  test('Successfully creating a course', ({ given, when, then }) => {
    let executeSpy: jest.SpyInstance;

    beforeAll(async () => {
      executeSpy = jest.spyOn(commandBus, 'execute');
    });

    given('the request is valid', () => {
      // we test request validity in controller
      // here we assume it is valid, and has been transformed into valid command dto
      createCourseRequestDto = CreateCourseRequestDtoBuilder().build();
    });

    when('I attempt to create a course', async () => {
      await controller.create(createCourseRequestDto);
    });

    then('a new record should have been created', () => {
      expect(executeSpy).toHaveBeenCalled();
    });
  });

  test('Fail; Invalid request, invalid data', ({ given, when, then }) => {
    given('the request contains invalid data', () => {
      createCourseRequestDto = CreateCourseRequestDtoBuilder()
        .emptyExternalId()
        .buildNoCheck();
    });

    when('I attempt to create a course', async () => {
      try {
        await controller.create(createCourseRequestDto);
      } catch (err) {
        error = err;
      }
    });

    then('I should receive a RequestInvalidError', () => {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.message).toContain(RequestInvalidError.baseMessage());
    });
  });

  test('Fail; Invalid request, missing data', ({ given, when, then }) => {
    given('the request contains missing data', () => {
      createCourseRequestDto = CreateCourseRequestDtoBuilder()
        .noExternalId()
        .buildNoCheck();
    });

    when('I attempt to create a course', async () => {
      try {
        await controller.create(createCourseRequestDto);
      } catch (err) {
        error = err;
      }
    });

    then('I should receive a RequestInvalidError', () => {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.message).toContain(RequestInvalidError.baseMessage());
    });
  });
});
