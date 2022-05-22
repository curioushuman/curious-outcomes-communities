import { loadFeature, defineFeature } from 'jest-cucumber';
import { Test, TestingModule } from '@nestjs/testing';
import { CqrsModule, CommandBus } from '@nestjs/cqrs';

import { LoggableLogger } from '@curioushuman/loggable';

import { CoursesController } from '../../courses.controller';
import { CreateCourseRequestDto } from '../../dto/create-course.request.dto';
import { CreateCourseRequestDtoBuilder } from '../../../test/stubs/create-course.request.stub';

const feature = loadFeature('./create-course-command.feature', {
  loadRelativePath: true,
});

const commandBus = {
  execute: jest.fn(),
};

defineFeature(feature, (test) => {
  let controller: CoursesController;
  let executeSpy: jest.SpyInstance;
  let createCourseRequestDto: CreateCourseRequestDto;
  // disabling no-explicit-any for testing purposes
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // let result: any;

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

    then('the command should be called via the command bus', () => {
      expect(executeSpy).toHaveBeenCalled();
    });
  });
});
