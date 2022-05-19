import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { Connection } from 'mongoose';

import { Bootstrap } from '../../../bootstrap/bootstrap';
import { AppModule } from '../../../app/app.module';
import { CreateJourneyRequestDtoBuilder } from './data-builders/create-journey.request.builder';
import { CreateJourneyRequestDto } from '../infra/dto/create-journey.request.dto';
import { MongoDbService } from '../../../shared/infra/database/mongo-db/mongo-db.service';

/**
 * E2E testing might look similar to more localised integration tests
 * However it should also include aspects such as:
 * - authentication/authorisation/access
 *
 * * NOTE: these often fail due to timeout the first time you run skaffold dev
 * * If you make an additional minor change they'll run again and pass (grrr)
 */

jest.setTimeout(10000);

describe('[E2E] JourneysModule', () => {
  let app: INestApplication;
  let connection: Connection;
  // disabling no-explicit-any for testing purposes
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let httpServer: any;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    Bootstrap.useGlobalSettings(app);
    await app.init();
    httpServer = app.getHttpServer();
    connection = moduleRef.get<MongoDbService>(MongoDbService).getConnection();
    await connection.collection('mongodbjourneys').deleteMany({});
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Given a journey is being created', () => {
    let response: request.Response;
    let createJourneyDto: CreateJourneyRequestDto;

    describe('When that Journey does not exist, and the body is valid', () => {
      describe('Simplest version', () => {
        beforeAll(async () => {
          createJourneyDto = CreateJourneyRequestDtoBuilder().build();
          response = await request(httpServer)
            .post(`/api/journeys`)
            .send(createJourneyDto);
        });
        test('Then response status should be 201', () => {
          expect(response.status).toBe(201);
        });

        test('And a journey should have been added to the database', async () => {
          const journeys = await connection
            .collection('mongodbjourneys')
            .find()
            .toArray();
          expect(journeys.length).toEqual(1);
        });

        test.todo('And the request/response is logged');
      });
    });
  });
});
