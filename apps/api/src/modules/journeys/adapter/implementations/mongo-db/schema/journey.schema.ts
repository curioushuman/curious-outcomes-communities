import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';

import type { Journey } from '../../../../domain/entities/journey';
import { Name } from '../../../../domain/value-objects/name';
import { Slug } from '../../../../domain/value-objects/slug';

@Schema()
export class MongoDbJourney implements Journey {
  @Prop({ required: true, unique: true, type: String })
  name!: Name;

  @Prop({ required: true, unique: true, type: String })
  slug!: Slug;
}

export const MongoDbJourneySchema =
  SchemaFactory.createForClass(MongoDbJourney);
export type MongoDbJourneyDocument = MongoDbJourney & Document;

export type MongoDbJourneyModel = Model<MongoDbJourneyDocument>;
