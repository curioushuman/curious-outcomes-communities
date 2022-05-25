import { Optional, Record, Static, String } from 'runtypes';
import { CourseId } from '../value-objects/course-id';

import { ExternalId } from '../value-objects/external-id';
import { Name } from '../value-objects/name';
import { Slug } from '../value-objects/slug';

/**
 * TODO
 * - [ ] startDate
 * - [ ] endDate
 * - [ ] description
 */

export const CourseSource = Record({
  id: ExternalId,
  name: Name,
  slug: Optional(Slug),
  courseId: Optional(CourseId),
});

export type CourseSource = Static<typeof CourseSource>;

const sourceForCreate = Record({
  courseId: String.withConstraint(
    (id) => id === '' || `Source (${id}) already associated with a Course`
  ),
});
export const CourseSourceForCreate = sourceForCreate.And(CourseSource);

export type CourseSourceForCreate = Static<typeof CourseSourceForCreate>;
