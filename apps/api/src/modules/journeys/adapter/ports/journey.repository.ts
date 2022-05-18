import { TaskEither } from 'fp-ts/lib/TaskEither';

import { Journey } from '../../domain/entities/journey';

export abstract class JourneyRepository {
  // abstract findOne(slug: string): TaskEither<Error, Journey>;
  abstract save(journey: Journey): TaskEither<Error, void>;
}
