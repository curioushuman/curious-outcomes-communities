import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';

import { Bootstrap } from '../../bootstrap/bootstrap';
import { Pokemon } from '../domain/entities/pokemon';
import { PokemonBuilder } from './data-builders/pokemon.builder';
import { PokemonModule } from './fake.pokemon.module';

/**
 * For local integration tests we just want to make sure
 * - endpoints behave how they should
 *
 * We ignore some of the additional elements such as:
 * - authentication/authorisation/access
 *
 * We use mocks/fakes to focus on the subject under test (SUT)
 *
 * TODO
 * - mimic e2e tests
 */

describe('[Integration] PokemonModule', () => {
  let app: INestApplication;
  // disabling no-explicit-any for testing purposes
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let httpServer: any;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [PokemonModule],
    }).compile();

    app = moduleRef.createNestApplication();
    Bootstrap.useGlobalSettings(app);
    await app.init();
    httpServer = app.getHttpServer();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('When a Pokemon is requested', () => {
    let requestTest: request.Test;
    let pokemon: Pokemon;

    beforeAll(() => {
      pokemon = PokemonBuilder().withDash().build();
      requestTest = request(httpServer).get(`/api/pokemon/${pokemon.slug}`);
    });
    test('Then it should return a 200 response status', async () => {
      requestTest.expect(200);
    });

    test('And the correct Pokemon', async () => {
      requestTest.expect(pokemon);
    });
  });
});
