import { Test, TestingModule } from '@nestjs/testing';
import { CqrsModule, CommandBus } from '@nestjs/cqrs';

import { LoggableLogger } from '@curioushuman/loggable';

import { CoursesController } from '../courses.controller';
import { CreateCourseRequestDto } from '../dto/create-course.request.dto';
import { CreateCourseRequestDtoBuilder } from '../../test/stubs/create-course.request.stub';

const commandBus = {
  execute: jest.fn(),
};

/**
 * SUT = the controller
 *
 * Who is the user of the controller?
 * - other devs
 *
 * What BEHAVIOURS does a controller fulfil?
 * - validates input
 * - transforms input
 * - calls the command/query
 *
 * This is all we need to test here
 */

describe('[Unit] CoursesController', () => {
  let controller: CoursesController;

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

  describe('[COMMAND] Create Course', () => {
    let executeSpy: jest.SpyInstance;
    let createCourseDto: CreateCourseRequestDto;

    describe('When creating a Course from Source', () => {
      describe('And the request is valid', () => {
        beforeEach(async () => {
          executeSpy = jest.spyOn(commandBus, 'execute');
          createCourseDto = CreateCourseRequestDtoBuilder().build();
          await controller.create(createCourseDto);
        });

        test('Then it should call the command, via the commandBus', async () => {
          expect(executeSpy).toHaveBeenCalled();
        });
      });
    });

    describe('When creating a Course from Source', () => {
      describe('And the request is invalid', () => {
        test.todo(
          'Then it should return RequestInvalidError extends BadRequestException'
        );
      });
    });
  });
});
