import { CommandHandler, ICommandHandler, ICommand } from '@nestjs/cqrs';
import { InternalServerErrorException } from '@nestjs/common';
import * as TE from 'fp-ts/lib/TaskEither';
import * as E from 'fp-ts/lib/Either';
import * as O from 'fp-ts/lib/Option';
import { ValidationError } from 'runtypes';

import { JourneyRepository } from '../../../adapter/ports/journey.repository';
import { executeTask } from '../../../../../shared/utils/execute-task';
import { CreateJourneyDto } from './create-journey.dto';
import { CreateJourneyMapper } from './create-journey.mapper';
import { Id } from '../../../domain/value-objects/Id';
import { JourneySourceRepository } from '../../../adapter/ports/journey-source.repository';
import { Journey } from '../../../domain/entities/journey';
import { pipe } from 'fp-ts/lib/function';
import { JourneySource } from '../../../domain/entities/journey-source';

export class CreateJourneyCommand implements ICommand {
  constructor(public readonly createJourneyDto: CreateJourneyDto) {}
}

@CommandHandler(CreateJourneyCommand)
export class CreateJourneyHandler
  implements ICommandHandler<CreateJourneyCommand>
{
  constructor(
    private readonly journeyRepository: JourneyRepository,
    private readonly journeySourceRepository: JourneySourceRepository
  ) {}

  async execute(command: CreateJourneyCommand): Promise<void> {
    const { createJourneyDto } = command;

    // we need to check FIRST if we need to even get from source
    const fromDtoToDomain = (createJourneyDto: CreateJourneyDto) =>
      E.tryCatch<Error, Journey>(
        () => CreateJourneyMapper.toDomain(createJourneyDto),
        (reason) => new Error(String(reason))
      );

    const idOrOpt: O.Option<Id> = pipe(
      createJourneyDto,
      O.fromNullable,
      O.map(({ externalId }) => externalId)
    );

    const findSource = (id: Id) =>
      TE.tryCatch<Error, JourneySource>(
        async () => await executeTask(this.journeySourceRepository.findOne(id)),
        (reason) => new Error(String(reason))
      );

    const findSourceAndParse = (id: Id) =>
      pipe(
        id,
        findSource,
        TE.chain((journeySource) =>
          pipe(
            journeySource,
            CreateJourneyMapper.fromSource,
            fromDtoToDomain,
            TE.fromEither
          )
        )
      );
    // const parseFromSource = (journeySource: JourneySource) =>
    //   TE.tryCatch<Error, Journey>(
    //     () =>
    //       pipe(
    //         journeySource,
    //         CreateJourneyMapper.fromSource,
    //         fromDtoToDomain
    //         // TE.fromEither
    //       ),
    //     (reason) => new Error(String(reason))
    //   );

    const journeyFromSource = pipe(
      idOrOpt,
      TE.fromOption(() => new Error()),
      TE.chain((externalId) => findSourceAndParse(externalId))
    );

    const journeyFromDto = pipe(
      createJourneyDto,
      fromDtoToDomain,
      TE.fromEither
    );

    const journey = pipe(
      journeyFromDto,
      TE.alt(() => journeyFromSource)
    );

    const saveJourney = (journey: Journey) =>
      TE.tryCatch<Error, void>(
        async () => await executeTask(this.journeyRepository.save(journey)),
        (reason) => new Error(String(reason))
      );

    const task = pipe(
      journey,
      TE.chain((j) => saveJourney(j))
    );

    return executeTask(task);
  }
}
