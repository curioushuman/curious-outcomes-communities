import { Test, TestingModule } from '@nestjs/testing';
import { CqrsModule, CommandBus } from '@nestjs/cqrs';

import { LoggableLogger } from '@curioushuman/loggable';

import { JourneysController } from '../journeys.controller';
import { CreateJourneyRequestDto } from '../dto/create-journey.request.dto';
import { CreateJourneyRequestDtoBuilder } from '../../test/stubs/create-journey.request.stub';

const commandBus = {
  execute: jest.fn(),
};

describe('[Unit] JourneysController', () => {
  let controller: JourneysController;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule],
      controllers: [JourneysController],
      providers: [
        LoggableLogger,
        { provide: CommandBus, useValue: commandBus },
      ],
    }).compile();

    controller = moduleRef.get<JourneysController>(JourneysController);
    jest.clearAllMocks();
  });

  describe('POST /', () => {
    let executeSpy: jest.SpyInstance;
    let createJourneyDto: CreateJourneyRequestDto;

    describe('When the request is valid', () => {
      beforeEach(async () => {
        executeSpy = jest.spyOn(commandBus, 'execute');
        createJourneyDto = CreateJourneyRequestDtoBuilder().build();
        await controller.create(createJourneyDto);
      });

      test('Then it should call the command, via the commandBus', async () => {
        expect(executeSpy).toHaveBeenCalled();
      });
    });
  });
});
