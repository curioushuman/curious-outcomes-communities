import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { HttpModule } from '@nestjs/axios';

import { LoggableModule } from '@curioushuman/loggable';

import { JourneysController } from '../infra/journeys.controller';
import { CreateJourneyHandler } from '../application/commands/create-journey/create-journey.command';
import { JourneyRepository } from '../adapter/ports/journey.repository';
import { FakeJourneyRepository } from '../adapter/implementations/fake/fake.journey.repository';
import { JourneySourceRepository } from '../adapter/ports/journey-source.repository';
import { FakeJourneySourceRepository } from '../adapter/implementations/fake/fake.journey-source.repository';

const commandHandlers = [CreateJourneyHandler];

const repositories = [
  {
    provide: JourneyRepository,
    useClass: FakeJourneyRepository,
  },
  {
    provide: JourneySourceRepository,
    useClass: FakeJourneySourceRepository,
  },
];

@Module({
  imports: [CqrsModule, HttpModule, LoggableModule],
  controllers: [JourneysController],
  providers: [...commandHandlers, ...repositories],
  exports: [],
})
export class JourneysModule {}
