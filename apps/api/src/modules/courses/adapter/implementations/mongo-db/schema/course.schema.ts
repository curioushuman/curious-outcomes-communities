import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';

import type { Course } from '../../../../domain/entities/course';
import { ExternalId } from '../../../../domain/value-objects/external-id';
import { CourseName } from '../../../../domain/value-objects/course-name';
import { Slug } from '../../../../../../shared/domain/value-objects/slug';

@Schema()
export class MongoDbCourse implements Course {
  @Prop({ required: true, unique: true, type: String })
  name!: CourseName;

  @Prop({ required: true, unique: true, type: String })
  slug!: Slug;

  @Prop({ required: true, unique: true, type: String })
  externalId!: ExternalId;
}

export const MongoDbCourseSchema = SchemaFactory.createForClass(MongoDbCourse);
export type MongoDbCourseDocument = MongoDbCourse & Document;

export type MongoDbCourseModel = Model<MongoDbCourseDocument>;
