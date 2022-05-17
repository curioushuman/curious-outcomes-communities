import { QueryHandler, IQueryHandler, IQuery } from '@nestjs/cqrs';
import { tryCatch } from 'fp-ts/lib/TaskEither';

import { PokemonRepository } from '../../../adapter/ports/pokemon.repository';
import { executeTask } from '../../../../shared/utils/execute-task';
import { GetPokemonQueryDto } from './get-pokemon.query.dto';
import { Pokemon } from '../../../domain/entities/pokemon';
import { Slug } from '../../../domain/value-objects/slug';
import { ValidationError } from 'runtypes';
import { InternalServerErrorException } from '@nestjs/common';

export class GetPokemonQuery implements IQuery {
  constructor(public readonly getPokemonQueryDto: GetPokemonQueryDto) {}
}

@QueryHandler(GetPokemonQuery)
export class GetPokemonHandler implements IQueryHandler {
  constructor(private readonly pokemonRepository: PokemonRepository) {}

  async execute(query: GetPokemonQuery): Promise<Pokemon> {
    const { getPokemonQueryDto } = query;

    // TODO: it is here you _might_ interpret different inputs
    // in the query DTO e.g. slug vs id

    const findOne = tryCatch(
      async () => {
        const slug = Slug.check(getPokemonQueryDto.slug);
        return await executeTask(this.pokemonRepository.findOne(slug));
      },
      (error: Error) => {
        if (error instanceof ValidationError) {
          return new InternalServerErrorException(
            `Invalid slug "${getPokemonQueryDto.slug})" supplied in GetPokemonHandler`
          );
        }
        return error;
      }
    );
    return executeTask(findOne);
  }
}
