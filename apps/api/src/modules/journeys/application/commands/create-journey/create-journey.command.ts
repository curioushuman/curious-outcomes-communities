import { CommandHandler, ICommandHandler, ICommand } from '@nestjs/cqrs';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as TE from 'fp-ts/lib/TaskEither';
import * as E from 'fp-ts/lib/Either';
import * as O from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/function';

import { JourneyRepository } from '../../../adapter/ports/journey.repository';
import { executeTask } from '../../../../../shared/utils/execute-task';
import { CreateJourneyDto } from './create-journey.dto';
import { CreateJourneyMapper } from './create-journey.mapper';
import { Id } from '../../../domain/value-objects/Id';
import { JourneySourceRepository } from '../../../adapter/ports/journey-source.repository';
import { Journey } from '../../../domain/entities/journey';
import { JourneySource } from '../../../domain/entities/journey-source';

export class CreateJourneyCommand implements ICommand {
  constructor(public readonly createJourneyDto: CreateJourneyDto) {}
}

/**
 * TODO
 * - [ ] better logging of errors
 */

@CommandHandler(CreateJourneyCommand)
export class CreateJourneyHandler
  implements ICommandHandler<CreateJourneyCommand>
{
  constructor(
    private readonly journeyRepository: JourneyRepository,
    private readonly journeySourceRepository: JourneySourceRepository
  ) {}

  async execute(command: CreateJourneyCommand): Promise<void> {
    /**
     * These are the business functions!!
     * NOTE: we return whatever error they return
     */
    const findSource = (id: Id) =>
      TE.tryCatch<Error, JourneySource>(
        async () => await executeTask(this.journeySourceRepository.findOne(id)),
        (error: Error) => error as Error
      );

    const saveJourney = (journey: Journey) =>
      TE.tryCatch<Error, void>(
        async () => await executeTask(this.journeyRepository.save(journey)),
        (error: Error) => error as Error
      );

    /**
     * Then we set up the smaller steps, to support business time
     */
    const { createJourneyDto } = command;

    /**
     * Simple check of the DTO; if all good, we don't even need the source
     */
    const journeyFromDto = pipe(createJourneyDto, this.parseDto, TE.fromEither);

    /**
     * This retrieves the source, and parses it into a DTO
     * NOTE: returns a different error for parseDto
     * As the source isn't user input, but DB data
     *
     * TODO
     * - [ ] switch from ID to findSourceDto for latter extensibility
     */
    const journeyFromSource = pipe(
      createJourneyDto,
      this.extractSourceId,
      TE.chain((id) => findSource(id)),
      TE.chain((journeySource) =>
        pipe(this.parseSource(journeySource), TE.fromEither)
      ),
      TE.chain((journeyDto) =>
        pipe(
          this.parseDto(journeyDto),
          E.mapLeft(
            (error: Error) => new InternalServerErrorException(error.toString())
          ),
          TE.fromEither
        )
      )
    );

    /**
     * Encapsulating the simple logic of:
     * Use the user generated DTO; unless invalid
     * THEN obtain missing values from source
     */
    const journey = pipe(
      journeyFromDto,
      TE.alt(() => journeyFromSource)
    );

    // TODO - merge the source with the user generated (UG)
    // UG is the source of truth
    // you'll need to parse one more time, returning bad request if fails

    const task = pipe(
      journey,
      TE.chain((j) => saveJourney(j))
    );

    return executeTask(task);
  }

  extractSourceId(
    dto: CreateJourneyDto
  ): TE.TaskEither<BadRequestException, Id> {
    return pipe(
      dto,
      O.fromNullable,
      O.map(({ externalId }) => externalId),
      TE.fromOption(() => new BadRequestException('No externalId'))
    );
  }

  parseDto(dto: CreateJourneyDto): E.Either<BadRequestException, Journey> {
    return E.tryCatch<BadRequestException, Journey>(
      () => {
        return pipe(dto, CreateJourneyMapper.toDomain);
      },
      (error: Error) => new BadRequestException(error.toString())
    );
  }

  parseSource(source: JourneySource): E.Either<BadRequestException, Journey> {
    return E.tryCatch<BadRequestException, CreateJourneyDto>(
      () => {
        return pipe(source, CreateJourneyMapper.fromSource);
      },
      (error: Error) => new BadRequestException(error.toString())
    );
  }
}
