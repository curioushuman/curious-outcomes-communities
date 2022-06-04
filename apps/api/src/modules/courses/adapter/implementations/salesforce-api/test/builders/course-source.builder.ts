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
  const overrides = {
    id: '5008s000000y7LUAAY',
    name: '2022 Test course',
    slug: '2022_test_course',
    courseId: '',
  };

  return {
    noMatchingObject() {
      // a slightly incorrect ID
      // but still conforms to SF ID validity
      overrides.id = '5000K01232O2GEYQA3';
      return this;
    },

    build(): CourseSource {
      return CourseSource.check({
        ...defaultProperties,
        ...overrides,
      });
    },

    // TODO - actually create a record in the DB
    create(): CourseSource {
      return this.build();
    },

    // TODO - actually delete something
    delete(courseSource: CourseSource): void {
      return;
    },
  };
};
