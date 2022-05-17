import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { TaskEither, tryCatch } from 'fp-ts/lib/TaskEither';

import { Pokemon } from '../../../domain/entities/pokemon';
import { PokemonRepository } from '../../ports/pokemon.repository';
import {
  PokeApiPokemonDto,
  PokeApiPokemonErrorDto,
} from './poke-api.pokemon.dto';
import { PokeApiPokemonMapper } from './poke-api.pokemon.mapper';

@Injectable()
export class PokeApiPokemonRepository extends PokemonRepository {
  constructor(private httpService: HttpService) {
    super();
  }

  public livenessProbe(): TaskEither<Error, boolean> {
    return tryCatch(
      async () => {
        // TODO: extract this into a httpService wrapper or similar
        const pokemonRequest$ = this.httpService.get(
          `https://pokeapi.co/api/v2/language/en`
        );
        await firstValueFrom(pokemonRequest$);
        // if a value is received, without an error we're good
        return true;
      },
      (error: PokeApiPokemonErrorDto) => {
        // TODO: similarly could we centralise/standardise the error handling
        const { status, statusText } = error.response;
        return new InternalServerErrorException(
          `Error (${status} - ${statusText}) occurred during livenessProbe at PokeApi`
        );
      }
    );
  }

  public findOne(slug: string): TaskEither<Error, Pokemon> {
    return tryCatch(
      async () => {
        // Final empty slug check
        if (!slug) {
          throw new BadRequestException(
            'Empty slug supplied to findOne() in PokeApi'
          );
        }
        // TODO: extract this into a httpService wrapper or similar
        const pokemonRequest$ = this.httpService.get<PokeApiPokemonDto>(
          `https://pokeapi.co/api/v2/pokemon/${slug}`
        );
        const response = await firstValueFrom(pokemonRequest$);
        // maybe this included
        const pokeApiPokemonDto = PokeApiPokemonDto.check(response.data);

        // could this similarly be in a serialisation decorator?
        return PokeApiPokemonMapper.toDomain(pokeApiPokemonDto);
      },
      (error: PokeApiPokemonErrorDto) => {
        const { status, statusText } = error.response || {
          status: 0,
          statusText: 'Unknown',
        };
        // TODO: similarly could we centralise/standardise the error handling
        if (status === 404) {
          return new NotFoundException(
            `${slug} could not be found via findOne() in PokeApi`
          );
        }
        // TODO: is there a simpler way of just passing up the same error
        // e.g. 404, 400, etc if response.status exists
        return new InternalServerErrorException(
          `Error (${status} - ${statusText}) occurred for findOne(${slug}) in PokeApi`
        );
      }
    );
  }
}
