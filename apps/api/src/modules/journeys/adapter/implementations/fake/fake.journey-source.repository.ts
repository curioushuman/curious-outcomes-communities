import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { TaskEither, tryCatch } from 'fp-ts/lib/TaskEither';

import { JourneySource } from '../../../domain/entities/journey-source';
import { JourneySourceRepository } from '../../ports/journey-source.repository';
import { JourneySourceBuilder } from '../../../test/data-builders/journey-source.builder';
import { Id } from '../../../domain/value-objects/Id';

@Injectable()
export class FakeJourneySourceRepository implements JourneySourceRepository {
  private journeySources: JourneySource[] = [];

  constructor() {
    this.journeySources.push(JourneySourceBuilder().build());
  }

  public findOne(id: Id): TaskEither<Error, JourneySource> {
    return tryCatch(
      async () => {
        return this.journeySources.find(
          (journeySource) => journeySource.id === id
        );
      },
      (reason: unknown) => new InternalServerErrorException(reason)
    );
  }
}
