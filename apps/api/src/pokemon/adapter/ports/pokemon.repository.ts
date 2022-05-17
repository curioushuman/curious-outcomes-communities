import { TaskEither } from 'fp-ts/lib/TaskEither';

import { Pokemon } from '../../domain/entities/pokemon';

export abstract class PokemonRepository {
  abstract findOne(slug: string): TaskEither<Error, Pokemon>;
}
