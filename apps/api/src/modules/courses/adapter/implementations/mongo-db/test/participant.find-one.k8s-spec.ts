import { loadFeature, defineFeature } from 'jest-cucumber';
import { Test } from '@nestjs/testing';
import { Connection } from 'mongoose';

import { MongoDbParticipantRepository } from '../mongo-db.participant.repository';
import { ParticipantRepository } from '../../../ports/participant.repository';
import { executeTask } from '../../../../../../shared/utils/execute-task';
import { Participant } from '../../../../domain/entities/participant';
import { FindParticipantDto } from '../../../../application/queries/find-participant/find-participant.dto';
import { ParticipantManufacturer } from './builders/participant.manufacturer';
import { MongoDbModule } from '../../../../../../shared/infra/database/mongo-db/mongo-db.module';
import { MongooseModule } from '@nestjs/mongoose';
import {
  MongoDbParticipant,
  MongoDbParticipantSchema,
} from '../schema/participant.schema';
import { MongoDbService } from '../../../../../../shared/infra/database/mongo-db/mongo-db.service';
import { RepositoryItemNotFoundError } from '../../../../../../shared/domain/errors/repository/item-not-found.error';
import { ParticipantBuilder } from '../../../../test/builders/participant.builder';

/**
 * INTEGRATION TEST
 * SUT = the findOne function OF an external repository
 * i.e. are we actually connecting with and getting data from MongoDB?
 *
 * Scope
 * - repository functions and behaviours
 * - changes to API/data structure
 * - handling of their various responses/errors
 */

const feature = loadFeature('./find-one.feature', {
  loadRelativePath: true,
});

defineFeature(feature, (test) => {
  let testingContext: string;
  let participantManufacturer: ParticipantManufacturer;
  let repository: MongoDbParticipantRepository;
  let connection: Connection;
  let participant: Participant;
  let findParticipantDto: FindParticipantDto;

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

    testingContext = 'find-one-ext';
    participantManufacturer = new ParticipantManufacturer(
      connection,
      testingContext
    );
  });

  afterAll(async () => {
    await participantManufacturer.tidyUp();
    await connection.close();
  });

  test('Successfully find one participant', ({ given, and, when, then }) => {
    let result: Participant;
    let error: Error;

    given('I am authorised to access the repository', () => {
      // out of scope
    });

    and('a matching record exists in the repository', async () => {
      participant = await participantManufacturer.build();
      findParticipantDto = {
        externalId: participant.externalId,
      };
    });

    when('I request the participant by ID', async () => {
      try {
        result = await executeTask(repository.findOne(findParticipantDto));
      } catch (err) {
        error = err;
        expect(error).toBeUndefined();
      }
    });

    then('a participant corresponding to that ID should be returned', () => {
      expect(result.externalId).toEqual(participant.externalId);
    });
  });

  test('Fail; Participant not found for ID provided', ({
    given,
    and,
    when,
    then,
  }) => {
    let result: Participant;
    let error: Error;

    given('I am authorised to access the repository', () => {
      // assumed
    });

    and('a matching record DOES NOT exist at the repository', () => {
      participant = ParticipantBuilder().doesntExist().build();
      findParticipantDto = {
        externalId: participant.externalId,
      };
    });

    when('I request the participant by ID', async () => {
      try {
        result = await executeTask(repository.findOne(findParticipantDto));
      } catch (err) {
        error = err;
      }
    });

    then('I should receive a RepositoryItemNotFoundError', () => {
      expect(error).toBeInstanceOf(RepositoryItemNotFoundError);
    });

    and('no result is returned', () => {
      expect(result).toBeUndefined();
    });
  });
});
