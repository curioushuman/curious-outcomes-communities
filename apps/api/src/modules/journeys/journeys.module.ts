import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';

import { LoggableModule } from '@curioushuman/loggable';

import { JourneysController } from './infra/journeys.controller';
import { CreateJourneyHandler } from './application/commands/create-journey/create-journey.command';
import { JourneyRepository } from './adapter/ports/journey.repository';
import { MongoDbJourneyRepository } from './adapter/implementations/mongo-db/mongo-db.journey.repository';
import {
  MongoDbJourney,
  MongoDbJourneySchema,
} from './adapter/implementations/mongo-db/schema/journey.schema';
import { JourneySourceRepository } from './adapter/ports/journey-source.repository';
import { FakeJourneySourceRepository } from './adapter/implementations/fake/fake.journey-source.repository';

const commandHandlers = [CreateJourneyHandler];

const repositories = [
  {
    provide: JourneyRepository,
    useClass: MongoDbJourneyRepository,
  },
  {
    provide: JourneySourceRepository,
    useClass: FakeJourneySourceRepository,
  },
];

/**
 * Journeys module
 *
 * NOTES
 * - Journey is the aggregate root of this module
 *  - therefore all *commands* should be routed through it
 */

@Module({
  imports: [
    CqrsModule,
    HttpModule,
    LoggableModule,
    MongooseModule.forFeature([
      { name: MongoDbJourney.name, schema: MongoDbJourneySchema },
    ]),
  ],
  controllers: [JourneysController],
  providers: [...commandHandlers, ...repositories],
  exports: [],
})
export class JourneysModule {}
