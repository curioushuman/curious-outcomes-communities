import { Test, TestingModule } from '@nestjs/testing';

import {
  CreateJourneyCommand,
  CreateJourneyHandler,
} from '../create-journey.command';
import { JourneyRepository } from '../../../../adapter/ports/journey.repository';
import { FakeJourneyRepository } from '../../../../adapter/implementations/fake/fake.journey.repository';
import { JourneySourceRepository } from '../../../../adapter/ports/journey-source.repository';
import { FakeJourneySourceRepository } from '../../../../adapter/implementations/fake/fake.journey-source.repository';
// import { JourneyBuilder } from '../../../../test/data-builders/journey.builder';
import { CreateJourneyDtoBuilder } from './stubs/create-journey.dto.stub';
import { executeTask } from '../../../../../../shared/utils/execute-task';

/**
 * Use Case tests
 *
 * Notes
 * - it is here, you might test other things that occur _around_ each query or command
 *   - e.g. after post-command events are fired
 * - use mocks/spies to focus just on the subject under test (SUT)
 *   - e.g. you can mock/spy on other commands just to make sure they receive the event
 */

let repository: FakeJourneyRepository;

describe('[Unit] Create Journey Command', () => {
  let handler: CreateJourneyHandler;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        CreateJourneyHandler,
        { provide: JourneyRepository, useClass: FakeJourneyRepository },
        {
          provide: JourneySourceRepository,
          useClass: FakeJourneySourceRepository,
        },
      ],
    }).compile();

    repository = moduleRef.get<JourneyRepository>(
      JourneyRepository
    ) as FakeJourneyRepository;
    handler = moduleRef.get<CreateJourneyHandler>(CreateJourneyHandler);
  });

  describe('When ALL input is valid', () => {
    test('Then it should return a journey', async () => {
      let journeys = await executeTask(repository.all());
      const journeysBefore = journeys.length;

      const createJourneyDto = CreateJourneyDtoBuilder().build();
      const result = await handler.execute(
        new CreateJourneyCommand(createJourneyDto)
      );

      journeys = await executeTask(repository.all());
      const journeysAfter = journeys.length;

      expect(result).toEqual(undefined);
      expect(journeysAfter).toEqual(journeysBefore + 1);
    });
  });
});
