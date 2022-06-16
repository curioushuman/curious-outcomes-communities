import { Record, Static } from 'runtypes';

import { ExternalId } from '../value-objects/external-id';
import { PersonName } from '../../../../shared/domain/value-objects/person-name';
import { Email } from '../../../../shared/domain/value-objects/email';
import { CourseId } from '../value-objects/course-id';
import { UserId } from '../../../../shared/domain/value-objects/user-id';

export const Participant = Record({
  firstName: PersonName,
  lastName: PersonName,
  email: Email,
  externalId: ExternalId,
  courseId: CourseId,
  userId: UserId,
});

export type Participant = Static<typeof Participant>;
