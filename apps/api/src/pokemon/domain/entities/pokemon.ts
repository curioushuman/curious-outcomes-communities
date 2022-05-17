import { Record, Static } from 'runtypes';

import { Name } from '../value-objects/name';
import { Slug } from '../value-objects/slug';

export const Pokemon = Record({
  name: Name,
  slug: Slug,
});

export type Pokemon = Static<typeof Pokemon>;
