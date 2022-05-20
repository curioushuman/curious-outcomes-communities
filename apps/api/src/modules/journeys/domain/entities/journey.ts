import { Optional, Record, Static } from 'runtypes';

import { Id } from '../value-objects/Id';
import { Name } from '../value-objects/name';
import { Slug } from '../value-objects/slug';

export const Journey = Record({
  name: Name,
  slug: Slug,
  externalId: Optional(Id),
});

export type Journey = Static<typeof Journey>;
