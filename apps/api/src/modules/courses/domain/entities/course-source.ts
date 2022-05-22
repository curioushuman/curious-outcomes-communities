import { Record, Static } from 'runtypes';

import { ExternalId } from '../value-objects/external-id';
import { Name } from '../value-objects/name';

/**
 * TODO
 * - [ ] startDate
 * - [ ] endDate
 * - [ ] description
 */

export const CourseSource = Record({
  id: ExternalId,
  name: Name,
});

export type CourseSource = Static<typeof CourseSource>;
