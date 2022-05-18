import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { HttpModule } from '@nestjs/axios';

import { LoggableModule } from '@curioushuman/loggable';

import { JourneysController } from '../infra/journeys.controller';

@Module({
  imports: [CqrsModule, HttpModule, LoggableModule],
  controllers: [JourneysController],
  exports: [],
})
export class JourneysModule {}
