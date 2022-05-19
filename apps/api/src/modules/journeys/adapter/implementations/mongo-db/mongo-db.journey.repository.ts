import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TaskEither, tryCatch } from 'fp-ts/lib/TaskEither';

import { Journey } from '../../../domain/entities/journey';
import { JourneyRepository } from '../../ports/journey.repository';
import { MongoDbJourney, MongoDbJourneyModel } from './schema/journey.schema';

@Injectable()
export class MongoDbJourneyRepository implements JourneyRepository {
  constructor(
    @InjectModel(MongoDbJourney.name)
    private mongoDbJourneyModel: MongoDbJourneyModel
  ) {}

  save = (journey: Journey): TaskEither<Error, void> => {
    return tryCatch(
      async () => {
        const entity = new this.mongoDbJourneyModel(journey);
        await entity.save();
        return;
      },
      (reason: unknown) => new InternalServerErrorException(reason)
    );
  };
}
