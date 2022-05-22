import { Record, Static } from 'runtypes';

import { ExternalId } from '../value-objects/external-id';
import { Name } from '../value-objects/name';
import { Slug } from '../value-objects/slug';

/**
 * TODO
 * - [ ] startDate
 * - [ ] endDate
 * - [ ] description
 */

export const Course = Record({
  name: Name,
  slug: Slug,
  externalId: ExternalId,
});

export type Course = Static<typeof Course>;
