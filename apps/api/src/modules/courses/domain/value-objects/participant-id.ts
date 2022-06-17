import { Static } from 'runtypes';

import { UUID, createUUID } from '../../../../shared/domain/value-objects/uuid';

export const ParticipantId = UUID.withBrand('ParticipantId');

export type ParticipantId = Static<typeof ParticipantId>;

export const createParticipantId = (): ParticipantId => {
  return ParticipantId.check(createUUID());
};
