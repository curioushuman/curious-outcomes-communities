import { GetPokemonQueryDto } from './get-pokemon.query.dto';
import { GetPokemonRequestDto } from '../../../infra/dto/get-pokemon.request.dto';
import { createSlug } from '../../../domain/value-objects/slug';
import { Pokemon } from '../../../domain/entities/pokemon';
import { PokemonResponseDto } from '../../../infra/dto/pokemon.response.dto';

/**
 * TODO
 * - create base abstract class for mappers
 */
export class GetPokemonMapper {
  public static toQueryDto(dto: GetPokemonRequestDto): GetPokemonQueryDto {
    return GetPokemonQueryDto.check({
      slug: createSlug(dto.slug),
    });
  }
  public static toResponseDto(pokemon: Pokemon): PokemonResponseDto {
    return {
      name: pokemon.name,
      slug: pokemon.slug,
    };
  }
}
