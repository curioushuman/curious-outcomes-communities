import { Record, Static } from 'runtypes';

import { Id } from '../value-objects/Id';
import { Name } from '../value-objects/name';

export const JourneySource = Record({
  id: Id,
  name: Name,
});

export type JourneySource = Static<typeof JourneySource>;
