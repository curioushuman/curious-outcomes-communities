import { TaskEither } from 'fp-ts/lib/TaskEither';

import { JourneySource } from '../../domain/entities/journey-source';
import { FindJourneySourceDto } from '../../application/queries/find-journey-source/find-journey-source.dto';

export abstract class JourneySourceRepository {
  abstract findOne(dto: FindJourneySourceDto): TaskEither<Error, JourneySource>;
}
