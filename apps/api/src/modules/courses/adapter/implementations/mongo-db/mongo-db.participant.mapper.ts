import { Participant } from '../../../domain/entities/participant';
import { MongoDbParticipant } from './schema/participant.schema';

export class MongoDbParticipantMapper {
  public static toDomain(mongoDbParticipant: MongoDbParticipant): Participant {
    return Participant.check({
      id: mongoDbParticipant.id,
      externalId: mongoDbParticipant.externalId,
      courseId: mongoDbParticipant.courseId,
      userId: mongoDbParticipant.userId,
      firstName: mongoDbParticipant.firstName,
      lastName: mongoDbParticipant.lastName,
      email: mongoDbParticipant.email,
    });
  }

  public static toPersist(participant: Participant): MongoDbParticipant {
    return {
      id: participant.id,
      externalId: participant.externalId,
      courseId: participant.courseId,
      userId: participant.userId,
      firstName: participant.firstName,
      lastName: participant.lastName,
      email: participant.email,
    };
  }
}
