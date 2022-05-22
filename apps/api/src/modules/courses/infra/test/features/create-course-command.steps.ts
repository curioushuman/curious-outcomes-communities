import { loadFeature, defineFeature } from 'jest-cucumber';
import { Test, TestingModule } from '@nestjs/testing';
import { CqrsModule, CommandBus } from '@nestjs/cqrs';

import { LoggableLogger } from '@curioushuman/loggable';

import { CoursesController } from '../../courses.controller';
import { CreateCourseRequestDto } from '../../dto/create-course.request.dto';
import { CreateCourseRequestDtoBuilder } from '../../../test/stubs/create-course.request.stub';
import { BadRequestException } from '@nestjs/common';
import { RequestInvalidError } from '../../../domain/errors/request-invalid.error';

const feature = loadFeature('./create-course-command.feature', {
  loadRelativePath: true,
});

const commandBus = {
  execute: jest.fn(),
};

defineFeature(feature, (test) => {
  let controller: CoursesController;
  let createCourseRequestDto: CreateCourseRequestDto;

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

    when('I create a course', async () => {
      await controller.create(createCourseRequestDto);
    });

    then('a new record should have been created', () => {
      expect(executeSpy).toHaveBeenCalled();
    });
  });

  test('Fail; Invalid request', ({ given, when, then }) => {
    // disabling no-explicit-any for testing purposes
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let error: any;

    given('the request is invalid', () => {
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

    then('I should receive a BadRequestException', () => {
      // Nest will return the exception, rather than the error
      // expect(error).toBeInstanceOf(RequestInvalidError);
      expect(error).toBeInstanceOf(BadRequestException);
    });
  });
});
