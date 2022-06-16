import { Static, String } from 'runtypes';

export const CourseId = String.withBrand('CourseId');

export type CourseId = Static<typeof CourseId>;
