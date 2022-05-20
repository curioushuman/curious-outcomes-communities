import { TaskEither } from 'fp-ts/lib/TaskEither';

import { JourneySource } from '../../domain/entities/journey-source';

export abstract class JourneySourceRepository {
  abstract findOne(slug: string): TaskEither<Error, JourneySource>;
}
