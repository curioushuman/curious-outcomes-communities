import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';

import type { Participant } from '../../../../domain/entities/participant';
import { ExternalId } from '../../../../domain/value-objects/external-id';
import { ParticipantId } from '../../../../domain/value-objects/participant-id';
import { Email } from '../../../../../../shared/domain/value-objects/email';
import { PersonName } from '../../../../../../shared/domain/value-objects/person-name';
import { CourseId } from '../../../../domain/value-objects/course-id';
import { UserId } from '../../../../../../shared/domain/value-objects/user-id';

/**
 * Schema for Course
 *
 * NOTE:
 * - I'm using id for my field, even though MongoDb uses _id for the primary key
 */

@Schema()
export class MongoDbParticipant implements Participant {
  @Prop({ required: true, unique: true, type: String })
  id!: ParticipantId;

  @Prop({ required: true, unique: true, type: String })
  externalId!: ExternalId;

  @Prop({ required: true, unique: true, type: String })
  courseId!: CourseId;

  @Prop({ required: true, unique: true, type: String })
  userId!: UserId;

  @Prop({ required: true, unique: true, type: String })
  firstName?: PersonName;

  @Prop({ required: true, unique: true, type: String })
  lastName!: PersonName;

  @Prop({ required: true, unique: true, type: String })
  email!: Email;
}

export const MongoDbParticipantSchema =
  SchemaFactory.createForClass(MongoDbParticipant);
export type MongoDbParticipantDocument = MongoDbParticipant & Document;

export type MongoDbParticipantModel = Model<MongoDbParticipantDocument>;
