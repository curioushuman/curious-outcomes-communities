import { Record, Static } from 'runtypes';

import { Id } from '../../../domain/value-objects/Id';

export const FindJourneySourceDto = Record({
  id: Id,
});

export type FindJourneySourceDto = Static<typeof FindJourneySourceDto>;
