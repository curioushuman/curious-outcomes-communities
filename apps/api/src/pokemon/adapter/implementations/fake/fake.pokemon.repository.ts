import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { TaskEither, tryCatch } from 'fp-ts/lib/TaskEither';

import { Pokemon } from '../../../domain/entities/pokemon';
import { PokemonRepository } from '../../ports/pokemon.repository';
import { PokemonBuilder } from '../../../test/data-builders/pokemon.builder';

@Injectable()
export class FakePokemonRepository implements PokemonRepository {
  private pokemon: Pokemon[] = [];

  constructor() {
    this.pokemon.push(PokemonBuilder().build());
    this.pokemon.push(PokemonBuilder().withDash().build());
    this.pokemon.push(PokemonBuilder().withApostrophe().build());
  }

  public findOne(slug: string): TaskEither<Error, Pokemon> {
    return tryCatch(
      async () => {
        return this.pokemon.find((pokemon) => pokemon.slug === slug);
      },
      (reason: unknown) => new InternalServerErrorException(reason)
    );
  }
}
