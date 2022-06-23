import { loadFeature, defineFeature } from 'jest-cucumber';
import { Test } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

import { MongoDbParticipantRepository } from '../mongo-db.participant.repository';
import { ParticipantRepository } from '../../../ports/participant.repository';
import { executeTask } from '../../../../../../shared/utils/execute-task';
import { Participant } from '../../../../domain/entities/participant';
import { ParticipantManufacturer } from './builders/participant.manufacturer';
import { MongoDbModule } from '../../../../../../shared/infra/database/mongo-db/mongo-db.module';
import {
  MongoDbParticipant,
  MongoDbParticipantSchema,
} from '../schema/participant.schema';
import { MongoDbService } from '../../../../../../shared/infra/database/mongo-db/mongo-db.service';
import { ParticipantBuilder } from '../../../../test/builders/participant.builder';

/**
 * INTEGRATION TEST
 * SUT = the save function OF an external repository
 * i.e. are we actually connecting with and getting data from MongoDB?
 *
 * Scope
 * - repository functions and behaviours
 * - changes to API/data structure
 * - handling of their various responses/errors
 */

const feature = loadFeature('./save.feature', {
  loadRelativePath: true,
});

defineFeature(feature, (test) => {
  let testingContext: string;
  let participantManufacturer: ParticipantManufacturer;
  let repository: MongoDbParticipantRepository;
  let connection: Connection;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        MongoDbModule,
        MongooseModule.forFeature([
          { name: MongoDbParticipant.name, schema: MongoDbParticipantSchema },
        ]),
      ],
      providers: [
        {
          provide: ParticipantRepository,
          useClass: MongoDbParticipantRepository,
        },
      ],
    }).compile();

    repository = moduleRef.get<ParticipantRepository>(
      ParticipantRepository
    ) as MongoDbParticipantRepository;
    connection = moduleRef.get<MongoDbService>(MongoDbService).getConnection();

    testingContext = 'save-ext';
    participantManufacturer = new ParticipantManufacturer(
      connection,
      testingContext
    );
  });

  afterAll(async () => {
    await participantManufacturer.tidyUp();
    await connection.close();
  });

  test('Successfully creating a participant', ({ given, and, when, then }) => {
    // Disabled for testing
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let result: any;
    let error: Error;
    let participant: Participant;

    given('I am authorised to access the repository', () => {
      // out of scope
    });

    and('a matching record does not already exist in our DB', () => {
      participant = ParticipantBuilder()
        .alpha()
        .forTidy(testingContext)
        .build();
    });

    when('I attempt to create a participant', async () => {
      try {
        result = await executeTask(repository.save(participant));
      } catch (err) {
        error = err;
        expect(error).toBeUndefined();
      }
    });

    then('a new record should have been created', async () => {
      const participantCreated = await participantManufacturer.check(
        participant
      );
      expect(participantCreated?.externalId).toEqual(participant.externalId);
    });

    and('no result is returned', () => {
      expect(result).toBeUndefined();
    });
  });

  test('Fail; Participant could not be created', ({
    given,
    and,
    when,
    then,
  }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let result: any;
    let error: Error;
    let invalidParticipant: Participant;

    given('I am authorised to access the repository', () => {
      // assumed
    });

    and('an error occurred during record creation', () => {
      invalidParticipant = ParticipantBuilder().invalid().buildNoCheck();
    });

    when('I attempt to create a participant', async () => {
      try {
        result = await executeTask(repository.save(invalidParticipant));
      } catch (err) {
        error = err;
      }
    });

    then('I should receive an Error', () => {
      expect(error).toBeInstanceOf(Error);
    });

    and('no result is returned', () => {
      expect(result).toBeUndefined();
    });
  });
});
