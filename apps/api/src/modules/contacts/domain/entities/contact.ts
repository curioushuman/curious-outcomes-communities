import { Record, Static } from 'runtypes';

import { Name } from '../value-objects/name';
import { Slug } from '../value-objects/slug';

export const Contact = Record({
  name: Name,
  slug: Slug,
});

export type Contact = Static<typeof Contact>;
