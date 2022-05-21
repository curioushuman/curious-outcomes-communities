import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { TaskEither, tryCatch } from 'fp-ts/lib/TaskEither';

import { JourneySource } from '../../../domain/entities/journey-source';
import { JourneySourceRepository } from '../../ports/journey-source.repository';
import { JourneySourceBuilder } from '../../../test/stubs/journey-source.stub';
import { FindJourneySourceDto } from '../../../application/queries/find-journey-source/find-journey-source.dto';

@Injectable()
export class FakeJourneySourceRepository implements JourneySourceRepository {
  private journeySources: JourneySource[] = [];

  constructor() {
    this.journeySources.push(JourneySourceBuilder().build());
  }

  public findOne(dto: FindJourneySourceDto): TaskEither<Error, JourneySource> {
    const { id } = dto;
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
