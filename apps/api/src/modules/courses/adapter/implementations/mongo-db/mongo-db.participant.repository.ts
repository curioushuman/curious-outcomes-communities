import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as TE from 'fp-ts/lib/TaskEither';
import * as O from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/function';

import { Participant } from '../../../domain/entities/participant';
import { ParticipantRepository } from '../../ports/participant.repository';
import { FindParticipantDto } from '../../../application/queries/find-participant/find-participant.dto';
import { RequestInvalidError } from '../../../../../shared/domain/errors/request-invalid.error';
import { MongoDbParticipantMapper } from './mongo-db.participant.mapper';
import {
  MongoDbParticipant,
  MongoDbParticipantModel,
} from './schema/participant.schema';
import { ExternalId } from '../../../domain/value-objects/external-id';
import { NotYetImplementedError } from '../../../../../shared/domain/errors/not-yet-implemented.error';
import { RepositoryItemNotFoundError } from '../../../../../shared/domain/errors/repository/item-not-found.error';

@Injectable()
export class MongoDbParticipantRepository implements ParticipantRepository {
  constructor(
    @InjectModel(MongoDbParticipant.name)
    private mongoDbParticipantModel: MongoDbParticipantModel
  ) {}

  findOne = (dto: FindParticipantDto): TE.TaskEither<Error, Participant> => {
    const { externalId } = dto;
    return pipe(
      externalId,
      O.fromNullable,
      O.fold(
        () =>
          TE.left(
            new NotYetImplementedError('Find by query will be available soon.')
          ),
        (extId) => {
          return this.findOneById(extId);
        }
      )
    );
  };

  findOneById = (externalId: ExternalId): TE.TaskEither<Error, Participant> => {
    return TE.tryCatch(
      async () => {
        if (!externalId) {
          throw new RequestInvalidError(
            'Invalid ID supplied to findOne() in MongoDb'
          );
        }
        const result = await this.mongoDbParticipantModel
          .findOne({
            externalId,
          })
          .exec();

        return this.parseMongoDbParticipant(result);
      },
      (error: Error) => error as Error
    );
  };

  /**
   * Processes result from DB; returns mapped result or error
   */
  private parseMongoDbParticipant = (
    mongoDbParticipant: MongoDbParticipant
  ): Participant => {
    return pipe(
      mongoDbParticipant,
      O.fromNullable,
      O.fold(
        () => {
          throw new RepositoryItemNotFoundError(MongoDbParticipant.name);
        },
        (participant) => {
          return MongoDbParticipantMapper.toDomain(participant);
        }
      )
    );
  };

  save = (participant: Participant): TE.TaskEither<Error, void> => {
    return TE.tryCatch(
      async () => {
        const mongoDbParticipant =
          MongoDbParticipantMapper.toPersist(participant);
        const entity = new this.mongoDbParticipantModel(mongoDbParticipant);
        await entity.save();
        return;
      },
      (error: Error) => error as Error
    );
  };
}
