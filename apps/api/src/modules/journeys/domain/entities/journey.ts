import { Record, Static } from 'runtypes';

import { Name } from '../value-objects/name';
import { Slug } from '../value-objects/slug';

export const Journey = Record({
  name: Name,
  slug: Slug,
});

export type Journey = Static<typeof Journey>;
