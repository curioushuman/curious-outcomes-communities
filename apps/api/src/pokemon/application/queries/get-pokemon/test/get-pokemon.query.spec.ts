import { Test, TestingModule } from '@nestjs/testing';

import { GetPokemonQuery, GetPokemonHandler } from '../get-pokemon.query';
import { PokemonRepository } from '../../../../adapter/ports/pokemon.repository';
import { FakePokemonRepository } from '../../../../adapter/implementations/fake/fake.pokemon.repository';
import { PokemonBuilder } from '../../../../test/data-builders/pokemon.builder';

/**
 * Use Case tests
 *
 * Notes
 * - it is here, you might test other things that occur _around_ each query or command
 *   - e.g. after post-command events are fired
 * - use mocks/spies to focus just on the subject under test (SUT)
 *   - e.g. you can mock/spy on other commands just to make sure they receive the event
 */

describe('[Unit] Get Pokemon Query', () => {
  let handler: GetPokemonHandler;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        GetPokemonHandler,
        { provide: PokemonRepository, useClass: FakePokemonRepository },
      ],
    }).compile();

    handler = moduleRef.get<GetPokemonHandler>(GetPokemonHandler);
  });

  describe('When ALL input is valid', () => {
    test('Then it should return a pokemon', async () => {
      const pokemon = PokemonBuilder().withDash().build();
      const getPokemonQueryDto = {
        slug: pokemon.slug,
      };

      const result = await handler.execute(
        new GetPokemonQuery(getPokemonQueryDto)
      );

      expect(result).toStrictEqual(pokemon);
    });
  });

  describe('When input is INVALID', () => {
    test('Then it should throw 500 error', async () => {
      try {
        const getPokemonQueryDto = {
          slug: '',
        };
        // Turning off type checking so we make sure we test what would happen
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const getPokemonQuery = new GetPokemonQuery(getPokemonQueryDto);
        await handler.execute(getPokemonQuery);
      } catch (err) {
        expect(err).toBeDefined();
        expect(err.status).toBe(500);
      }
    });
  });
});
