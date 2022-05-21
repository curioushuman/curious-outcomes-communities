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
import { JourneySourceRepository } from '../../../adapter/ports/journey-source.repository';
import { Journey } from '../../../domain/entities/journey';
import { JourneySource } from '../../../domain/entities/journey-source';
import { FindJourneySourceDto } from '../../queries/find-journey-source/find-journey-source.dto';

export class CreateJourneyCommand implements ICommand {
  constructor(public readonly createJourneyDto: CreateJourneyDto) {}
}

/**
 * TODO
 * - [ ] logging
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
    const findSource = (dto: FindJourneySourceDto) =>
      TE.tryCatch<Error, JourneySource>(
        async () =>
          await executeTask(this.journeySourceRepository.findOne(dto)),
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
      this.findSourceDto,
      TE.chain((dto) => findSource(dto)),
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
    const validateJourney = pipe(
      journeyFromDto,
      TE.alt(() => journeyFromSource)
    );

    // TODO - merge the source with the user generated (UG)
    // UG is the source of truth
    // you'll need to parse one more time, returning bad request if fails

    const task = pipe(
      validateJourney,
      TE.chain((j) => saveJourney(j))
    );

    return executeTask(task);
  }

  /**
   * TODO
   * - [ ] consider moving this to create-journey.mapper
   */
  findSourceDto(
    dto: CreateJourneyDto
  ): TE.TaskEither<BadRequestException, FindJourneySourceDto> {
    return pipe(
      dto,
      O.fromNullable,
      O.map(({ externalId }) => {
        return { id: externalId } as FindJourneySourceDto;
      }),
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
