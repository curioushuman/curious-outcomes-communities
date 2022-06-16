import { CourseSource } from '../../domain/entities/course-source';
import { ExternalId } from '../../domain/value-objects/external-id';
import { CourseBuilder } from './course.builder';

/**
 * A builder for Course Sources to play with in testing.
 */

/**
 * * NOTE: if you switch to a different source repository type (i.e. not Salesforce)
 * ! you'll need to update this builder.
 *
 * TODO
 * - [ ] support multiple source repositories concurrently during testing
 *
 * Heavily inspired by: https://github.com/VincentJouanne/nest-clean-architecture
 */

export const CourseSourceBuilder = () => {
  /**
   * Default properties don't exist in source repository
   */
  const defaultProperties = {
    id: '5008s1234519CjIAAU',
    name: 'Learn to be a dancer',
    courseId: '',
  };
  const overrides = {
    id: '5008s1234519CjIAAU',
    name: 'Learn to be a dancer',
    courseId: '',
  };

  return {
    alpha() {
      overrides.id = CourseBuilder().alpha().build().externalId;
      overrides.name = 'Dance, like an alpha';
      return this;
    },

    beta() {
      overrides.id = CourseBuilder().beta().build().externalId;
      overrides.name = 'Beta ray dancing';
      return this;
    },

    noMatchingSource() {
      return this;
    },

    withCourse() {
      overrides.id = ExternalId.check('SourceWithCourseForFakeRepoId');
      overrides.name = 'Already associated';
      overrides.courseId = 'JustAnyOldCourseIdForNow';
      return this;
    },

    invalidSource() {
      overrides.id = ExternalId.check('InvalidIdForFakeRepo');
      overrides.name = '';
      return this;
    },

    exists() {
      overrides.id = ExternalId.check('ThisSourceExists');
      return this;
    },

    build(): CourseSource {
      return CourseSource.check({
        ...defaultProperties,
        ...overrides,
      });
    },

    buildNoCheck(): CourseSource {
      return {
        ...defaultProperties,
        ...overrides,
      } as CourseSource;
    },
  };
};
