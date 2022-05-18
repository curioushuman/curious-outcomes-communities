import { TaskEither } from 'fp-ts/lib/TaskEither';

import { CreateJourneyDto } from '../../application/commands/create-journey/create-journey.dto';

// import { Journey } from '../../domain/entities/journey';

export abstract class JourneyRepository {
  // abstract findOne(slug: string): TaskEither<Error, Journey>;
  abstract create(createJourneyDto: CreateJourneyDto): TaskEither<Error, void>;
}
