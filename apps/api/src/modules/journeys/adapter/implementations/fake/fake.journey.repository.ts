import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { TaskEither, tryCatch } from 'fp-ts/lib/TaskEither';

import { Journey } from '../../../domain/entities/journey';
import { JourneyRepository } from '../../ports/journey.repository';
import { JourneyBuilder } from '../../../test/data-builders/journey.builder';

@Injectable()
export class FakeJourneyRepository implements JourneyRepository {
  private journeys: Journey[] = [];

  constructor() {
    this.journeys.push(JourneyBuilder().build());
    this.journeys.push(JourneyBuilder().withFunkyChars().build());
  }

  // public findOne(slug: string): TaskEither<Error, Journey> {
  //   return tryCatch(
  //     async () => {
  //       return this.journeys.find((journeys) => journeys.slug === slug);
  //     },
  //     (reason: unknown) => new InternalServerErrorException(reason)
  //   );
  // }

  public save(journey: Journey): TaskEither<Error, void> {
    return tryCatch(
      async () => {
        this.journeys.push(journey);
      },
      (reason: unknown) => new InternalServerErrorException(reason)
    );
  }

  all = (): TaskEither<Error, Journey[]> => {
    return tryCatch(
      async () => {
        return this.journeys;
      },
      (reason: unknown) => new InternalServerErrorException(reason)
    );
  };
}
