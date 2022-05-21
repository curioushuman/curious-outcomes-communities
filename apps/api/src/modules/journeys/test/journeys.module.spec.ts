import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';

import { Bootstrap } from '../../../bootstrap/bootstrap';
// import { Journey } from '../domain/entities/journey';
// import { JourneyBuilder } from './data-builders/journey.builder';
import {
  CreateJourneyRequestDtoBuilder,
  CreateJourneyFromRequestDtoBuilder,
} from './stubs/create-journey.request.stub';
import { JourneysModule } from './fake.journeys.module';
import {
  CreateJourneyFromRequestDto,
  CreateJourneyRequestDto,
} from '../infra/dto/create-journey.request.dto';

/**
 * For local integration tests we just want to make sure
 * - endpoints behave how they should
 *
 * We ignore some of the higher elements such as:
 * - authentication/authorisation/access
 *
 * We also ignore some of the lower elements such as:
 * - logging
 *
 * We use mocks/fakes to focus on the subject under test (SUT)
 *
 * TODO
 * - mimic e2e tests
 */

describe('[Unit] JourneysModule', () => {
  let app: INestApplication;
  // disabling no-explicit-any for testing purposes
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let httpServer: any;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [JourneysModule],
    }).compile();

    app = moduleRef.createNestApplication();
    Bootstrap.useGlobalSettings(app);
    await app.init();
    httpServer = app.getHttpServer();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('[COMMAND] Create Journey', () => {
    let response: request.Response;
    let createJourneyDto: CreateJourneyRequestDto;
    let createJourneyFromDto: CreateJourneyFromRequestDto;

    describe('When that Journey does NOT exist in our DB', () => {
      describe('And the body is valid', () => {
        beforeAll(async () => {
          createJourneyDto = CreateJourneyRequestDtoBuilder().build();
          response = await request(httpServer)
            .post(`/api/journeys`)
            .send(createJourneyDto);
        });
        test('Then response status should be 201', () => {
          expect(response.status).toBe(201);
        });
      });
    });

    describe('When creating FROM external source, that exists', () => {
      describe('And all data is being drawn from said external source', () => {
        beforeAll(async () => {
          createJourneyFromDto = CreateJourneyFromRequestDtoBuilder().build();
          response = await request(httpServer)
            .post(`/api/journeys/from`)
            .send(createJourneyFromDto);
        });
        test('Then response status should be 201', () => {
          expect(response.status).toBe(201);
        });
      });
    });
  });
});
