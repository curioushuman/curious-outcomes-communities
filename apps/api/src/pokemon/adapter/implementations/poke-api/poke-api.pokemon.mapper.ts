import { Pokemon } from '../../../domain/entities/pokemon';
import { PokeApiPokemonDto } from './poke-api.pokemon.dto';

/**
 * TODO
 * - create base abstract class for mappers
 */
export class PokeApiPokemonMapper {
  public static toDomain(dto: PokeApiPokemonDto): Pokemon {
    // TODO: do we need a tryCatch here?
    // or will the exception(s) potentially thrown by Record.check()
    // be caught by the tryCatch in the repository (or application)?

    // we aren't doing Slug.check() here
    // as it's coming from the source
    // to which our constraints come from, rather than check
    return Pokemon.check({
      name: dto.name,
      slug: dto.name,
    });
  }
}
