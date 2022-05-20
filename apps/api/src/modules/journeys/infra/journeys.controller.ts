import { BadRequestException, Controller, Post, Body } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/function';
import * as E from 'fp-ts/lib/Either';

import { LoggableLogger } from '@curioushuman/loggable';

import { executeTask } from '../../../shared/utils/execute-task';
import {
  CreateJourneyFromRequestDto,
  CreateJourneyRequestDto,
} from './dto/create-journey.request.dto';
import { CreateJourneyDto } from '../application/commands/create-journey/create-journey.dto';
import { CreateJourneyMapper } from '../application/commands/create-journey/create-journey.mapper';
import { CreateJourneyCommand } from '../application/commands/create-journey/create-journey.command';

@Controller('journeys')
export class JourneysController {
  constructor(
    private logger: LoggableLogger,
    private readonly commandBus: CommandBus
  ) {
    this.logger.setContext('JourneysController');
  }

  /**
   * Notes
   * The anonymous function that calls the command has been left in
   * as when it was extracted to a separate method
   * it lost access to the commandBus
   * This could possibly be a Nest issue.
   */
  @Post()
  async create(@Body() body: CreateJourneyRequestDto): Promise<void> {
    const task = pipe(
      body,
      this.parseCreateJourney,
      TE.fromEither,
      TE.chain((createJourneyDto) =>
        TE.tryCatch(
          async () => {
            const command = new CreateJourneyCommand(createJourneyDto);
            return await this.commandBus.execute<CreateJourneyCommand>(command);
          },
          (error: Error) => error as Error
        )
      )
    );

    return executeTask(task);
  }

  parseCreateJourney(
    dto: CreateJourneyRequestDto
  ): E.Either<BadRequestException, CreateJourneyDto> {
    return E.tryCatch(
      () => {
        return pipe(
          dto,
          CreateJourneyRequestDto.check,
          CreateJourneyMapper.fromRequestDto
        );
      },
      (error: Error) => new BadRequestException(error.toString())
    );
  }

  @Post('from')
  async createFrom(@Body() body: CreateJourneyFromRequestDto): Promise<void> {
    const task = pipe(
      body,
      this.parseCreateJourneyFrom,
      TE.fromEither,
      TE.chain((createJourneyDto) =>
        TE.tryCatch(
          async () => {
            const command = new CreateJourneyCommand(createJourneyDto);
            return await this.commandBus.execute<CreateJourneyCommand>(command);
          },
          (error: Error) => error as Error
        )
      )
    );
    return executeTask(task);
  }

  parseCreateJourneyFrom(
    dto: CreateJourneyFromRequestDto
  ): E.Either<Error, CreateJourneyDto> {
    return E.tryCatch(
      () => {
        return pipe(
          dto,
          CreateJourneyFromRequestDto.check,
          CreateJourneyMapper.fromRequestDto
        );
      },
      (error: Error) => new BadRequestException(error.toString())
    );
  }
}
