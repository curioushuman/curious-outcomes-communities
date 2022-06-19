import { Injectable, NotFoundException } from '@nestjs/common';
import * as TE from 'fp-ts/lib/TaskEither';
import * as O from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/function';

import { ParticipantSource } from '../../../domain/entities/participant-source';
import { ParticipantSourceRepository } from '../../ports/participant-source.repository';
import { ParticipantSourceBuilder } from '../../../test/builders/participant-source.builder';
import { FindParticipantSourceDto } from '../../../application/queries/find-participant-source/find-participant-source.dto';

@Injectable()
export class FakeParticipantSourceRepository
  implements ParticipantSourceRepository
{
  private participantSources: ParticipantSource[] = [];

  constructor() {
    this.participantSources.push(ParticipantSourceBuilder().exists().build());
    this.participantSources.push(
      ParticipantSourceBuilder().invalidSource().buildNoCheck()
    );
    this.participantSources.push(ParticipantSourceBuilder().alpha().build());
    this.participantSources.push(ParticipantSourceBuilder().beta().build());
    this.participantSources.push(
      ParticipantSourceBuilder().withParticipant().build()
    );
  }

  findOne = (
    dto: FindParticipantSourceDto
  ): TE.TaskEither<Error, ParticipantSource> => {
    const { id } = dto;
    return TE.tryCatch(
      async () => {
        const participantSource = this.participantSources.find(
          (cs) => cs.id === id
        );
        return pipe(
          participantSource,
          O.fromNullable,
          O.fold(
            () => {
              // this mimics an API or DB call throwing an error
              throw new NotFoundException(
                `Participant source with id ${id} not found`
              );
            },
            // this mimics the fact that all non-fake adapters
            // will come with a mapper, which will perform a check
            // prior to return
            (source) => ParticipantSource.check(source)
          )
        );
      },
      (error: Error) => error as Error
    );
  };
}
