import { Controller, Post, Param } from '@nestjs/common';
// import { QueryBus } from '@nestjs/cqrs';
// import * as TE from 'fp-ts/lib/TaskEither';
// import { pipe } from 'fp-ts/lib/function';
// import * as E from 'fp-ts/lib/Either';

import { LoggableLogger } from '@curioushuman/loggable';

import { CreateJourneyRequestDto } from './dto/create-journey.request.dto';

@Controller('journeys')
export class JourneysController {
  constructor(private logger: LoggableLogger) {
    this.logger.setContext('JourneysController');
  }

  @Post()
  async create(@Param() params: CreateJourneyRequestDto): Promise<void> {
    return;
  }
}
