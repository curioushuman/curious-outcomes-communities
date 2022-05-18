import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { HttpModule } from '@nestjs/axios';

import { LoggableModule } from '@curioushuman/loggable';

import { JourneysController } from './infra/journeys.controller';
import { CreateJourneyHandler } from './application/commands/create-journey/create-journey.command';

const commandHandlers = [CreateJourneyHandler];

@Module({
  imports: [CqrsModule, HttpModule, LoggableModule],
  controllers: [JourneysController],
  providers: [...commandHandlers],
  exports: [],
})
export class JourneysModule {}
