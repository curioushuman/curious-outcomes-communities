import { HttpModule } from '@nestjs/axios';
import { Test } from '@nestjs/testing';

import { PokemonRepository } from '../../../ports/pokemon.repository';
import { PokeApiPokemonRepository } from '../poke-api.pokemon.repository';
import { executeTask } from '../../../../../shared/utils/execute-task';
import { PokemonBuilder } from '../../../../../pokemon/test/data-builders/pokemon.builder';
import { GetPokemonRequestDtoBuilder } from '../../../../../pokemon/test/data-builders/pokemon-request.builder';

/**
 * This will be an integration test as we're focussing on is
 * the _integration_ of this external service with our app.
 *
 * We want to test things like:
 * - we can connect to the service
 * - all the relevant functions are available
 * - and behave as expected
 * - how we handle a change to their API/data structures
 * - how we handle their various responses based on our requests
 */

describe('[Integration] PokeApiRepository', () => {
  let repository: PokeApiPokemonRepository;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        { provide: PokemonRepository, useClass: PokeApiPokemonRepository },
      ],
    }).compile();

    repository = moduleRef.get<PokemonRepository>(
      PokemonRepository
    ) as PokeApiPokemonRepository;
  });

  describe('livenessProbe', () => {
    test('Should indicate the service is alive', async () => {
      try {
        const live = await executeTask(repository.livenessProbe());
        expect(live).toBe(true);
      } catch (err) {
        expect(err).toBeUndefined();
      }
    });
  });

  describe('findOne', () => {
    describe('When a Pokemon exists', () => {
      test('Then it should be returned as a Pokemon', async () => {
        try {
          const pokemon = PokemonBuilder().build();
          const pokemonFound = await executeTask(
            repository.findOne(pokemon.slug)
          );
          expect(pokemonFound).toStrictEqual(pokemon);
        } catch (err) {
          expect(err).toBeUndefined();
        }
      });
    });

    describe('When a Pokemon DOES NOT exist', () => {
      test('Then it should throw a 404', async () => {
        try {
          const pokemonSlug = GetPokemonRequestDtoBuilder()
            .doesntExist()
            .build().slug;
          await executeTask(repository.findOne(pokemonSlug));
        } catch (err) {
          expect(err).toBeDefined();
          expect(err.status).toBe(404);
        }
      });
    });

    describe('When an invalid request is sent', () => {
      test('Then it should throw a 500', async () => {
        try {
          const pokemonSlug = '';

          // Turning off type checking so we make sure we test what would happen
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          await executeTask(repository.findOne(pokemonSlug));
        } catch (err) {
          expect(err).toBeDefined();
          expect(err.status).toBe(500);
        }
      });
    });

    describe('IF they change their data structure', () => {
      // You'll need to mock the httpService
      // and return a response with a different data structure
      // essentially it will throw an error (instanceof) ValidationError
      // which you will need to check for specifically
      test.todo('Then it should throw a 500');
    });
  });
});
