import { Record, Static } from 'runtypes';

import { ExternalId } from '../value-objects/external-id';
import { CourseName } from '../value-objects/course-name';
import { Slug } from '../value-objects/slug';

/**
 * TODO
 * - [ ] startDate
 * - [ ] endDate
 * - [ ] description
 */

export const Course = Record({
  name: CourseName,
  slug: Slug,
  externalId: ExternalId,
});

export type Course = Static<typeof Course>;
