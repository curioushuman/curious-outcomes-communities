import { Static } from 'runtypes';

import { UUID, createUUID } from '../../../../shared/domain/value-objects/uuid';

export const CourseId = UUID.withBrand('CourseId');

export type CourseId = Static<typeof CourseId>;

export const createCourseId = (): CourseId => {
  return CourseId.check(createUUID());
};
