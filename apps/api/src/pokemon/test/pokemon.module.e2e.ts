import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';

import { Bootstrap } from '../../bootstrap/bootstrap';
import { AppModule } from '../../app/app.module';
import { PokemonBuilder } from './data-builders/pokemon.builder';
import { GetPokemonRequestDtoBuilder } from './data-builders/pokemon-request.builder';
import { Pokemon } from '../domain/entities/pokemon';

/**
 * E2E testing might look similar to more localised integration tests
 * However it should also include aspects such as:
 * - authentication/authorisation/access
 *
 * * NOTE: these often fail due to timeout the first time you run skaffold dev
 * * If you make an additional minor change they'll run again and pass (grrr)
 */

jest.setTimeout(10000);

describe('[E2E] PokemonModule', () => {
  let app: INestApplication;
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
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Given a specific Pokemon is being requested', () => {
    let response: request.Response;
    let pokemon: Pokemon;

    describe('When that Pokemon exists, and the request is valid', () => {
      describe('Pikachu definitely exists, and everyone knows how to spell it', () => {
        beforeAll(async () => {
          pokemon = PokemonBuilder().build();
          response = await request(httpServer).get(
            `/api/pokemon/${pokemon.slug}`
          );
        });
        test('Then response status should be 200', () => {
          expect(response.status).toBe(200);
        });

        test('And Pikachu is returned', () => {
          expect(response.body.name).toEqual(pokemon.slug);
        });

        test.todo('And the request/response is logged');
      });
      describe("Farfetch'd is a bit tricky, but savvy ppl remove the apostrophe", () => {
        beforeAll(async () => {
          pokemon = PokemonBuilder().withApostrophe().build();
          response = await request(httpServer).get(
            `/api/pokemon/${pokemon.slug}`
          );
        });
        test('Then response status should be 200', () => {
          expect(response.status).toBe(200);
        });
      });
    });

    describe('When that Pokemon does not exist e.g. Furfligarbabard', () => {
      beforeAll(async () => {
        const dto = GetPokemonRequestDtoBuilder().doesntExist().build();
        response = await request(httpServer).get(`/api/pokemon/${dto.slug}`);
      });
      test('Then response status should be 404 (not found)', () => {
        expect(response.status).toBe(404);
      });

      test.todo('And the request/response is logged');
    });

    describe('When that Pokemon exists, but the request is invalid', () => {
      describe("Farfetch'd, but they forgot to remove the apostrophe", () => {
        beforeAll(async () => {
          pokemon = PokemonBuilder().withApostrophe().build();
          const dto = GetPokemonRequestDtoBuilder().withApostrophe().build();
          response = await request(httpServer).get(`/api/pokemon/${dto.slug}`);
        });
        test('Then response status should STILL BE 200 (as we tidy the slug for them)', () => {
          expect(response.status).toBe(200);
        });
        test("And Farfetch'd is returned", () => {
          expect(response.body.name).toEqual(pokemon.slug);
        });
        test.todo('And the request/response is logged');
      });
    });
  });
});
