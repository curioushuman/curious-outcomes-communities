import { CourseSource } from '../../../../../domain/entities/course-source';

/**
 * Heavily inspired by: https://github.com/VincentJouanne/nest-clean-architecture
 */
export const CourseSourceBuilder = () => {
  const defaultProperties = {
    id: '5008s000000y7LUAAY',
    name: '2022 Test course',
    slug: '2022_test_course',
    courseId: '',
  };

  return {
    // TODO - actually create a record in the DB
    create(): CourseSource {
      return CourseSource.check({
        ...defaultProperties,
      });
    },

    // TODO - actually delete something
    delete(courseSource: CourseSource): void {
      return;
    },
  };
};
