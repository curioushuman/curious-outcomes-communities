import { Null, Optional, Record, Static } from 'runtypes';

import { ExternalId } from '../value-objects/external-id';
import { PersonName } from '../../../../shared/domain/value-objects/person-name';
import { Email } from '../../../../shared/domain/value-objects/email';
import { ParticipantId } from '../value-objects/participant-id';

export const ParticipantSource = Record({
  firstName: Optional(PersonName),
  lastName: PersonName,
  email: Email,
  externalId: ExternalId,
  externalCourseId: ExternalId,
  participantId: Optional(ParticipantId.Or(Null)),
});

export type ParticipantSource = Static<typeof ParticipantSource>;

const sourceForCreate = Record({
  participantId: ParticipantId.Or(Null).withConstraint(
    (id) => !id || `Source (${id}) already associated with a Participant`
  ),
});
export const ParticipantSourceForCreate =
  sourceForCreate.And(ParticipantSource);

export type ParticipantSourceForCreate = Static<
  typeof ParticipantSourceForCreate
>;
