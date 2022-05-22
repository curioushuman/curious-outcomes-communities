import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';

import type { Course } from '../../../../domain/entities/course';
import { Name } from '../../../../domain/value-objects/name';
import { Slug } from '../../../../domain/value-objects/slug';

@Schema()
export class MongoDbCourse implements Course {
  @Prop({ required: true, unique: true, type: String })
  name!: Name;

  @Prop({ required: true, unique: true, type: String })
  slug!: Slug;
}

export const MongoDbCourseSchema = SchemaFactory.createForClass(MongoDbCourse);
export type MongoDbCourseDocument = MongoDbCourse & Document;

export type MongoDbCourseModel = Model<MongoDbCourseDocument>;
