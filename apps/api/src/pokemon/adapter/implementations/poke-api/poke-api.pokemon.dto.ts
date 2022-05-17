import { Number, Record, Static, String } from 'runtypes';

/**
 * This is the form of the data we expect (and process) from the Poke API
 * The full API can be found at https://pokeapi.co/docs/v2
 * We can use this runtype to check the data we get from the API
 *
 * TODO
 * - Move the error types to a shared library
 *   - Or at least create a base class/interface
 */

export const PokeApiPokemonDto = Record({
  name: String,
});

export type PokeApiPokemonDto = Static<typeof PokeApiPokemonDto>;

export const PokeApiPokemonErrorResponseDto = Record({
  status: Number,
  statusText: String,
});
export type PokeApiPokemonErrorResponseDto = Static<
  typeof PokeApiPokemonErrorResponseDto
>;

export const PokeApiPokemonErrorDto = Record({
  response: PokeApiPokemonErrorResponseDto,
});
export type PokeApiPokemonErrorDto = Static<typeof PokeApiPokemonErrorDto>;
