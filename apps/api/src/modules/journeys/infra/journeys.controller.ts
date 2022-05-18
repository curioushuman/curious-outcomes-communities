import { BadRequestException, Controller, Post, Param } from '@nestjs/common';
// import { QueryBus } from '@nestjs/cqrs';
// import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/function';
import * as E from 'fp-ts/lib/Either';

import { LoggableLogger } from '@curioushuman/loggable';

import { CreateJourneyRequestDto } from './dto/create-journey.request.dto';
import { CreateJourneyDto } from '../application/commands/create-journey/create-journey.dto';
import { CreateJourneyMapper } from '../application/commands/create-journey/create-journey.mapper';

@Controller('journeys')
export class JourneysController {
  constructor(private logger: LoggableLogger) {
    this.logger.setContext('JourneysController');
  }

  @Post()
  async create(@Param() params: CreateJourneyRequestDto): Promise<void> {
    const task = pipe(params, this.checkCreateJourneyRequest);

    // return executeTask(task);

    return;
  }

  checkCreateJourneyRequest(
    params: CreateJourneyRequestDto
  ): E.Either<Error, CreateJourneyDto> {
    return E.tryCatch(
      () => {
        return pipe(
          params,
          CreateJourneyRequestDto.check,
          CreateJourneyMapper.toCommandDto
        );
      },
      (error: Error) => new BadRequestException(error.toString())
    );
  }
}
