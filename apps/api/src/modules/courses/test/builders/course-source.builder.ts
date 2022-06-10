import { CourseSource } from '../../domain/entities/course-source';

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

const caseDummyId = process.env.SALESFORCE_TEST_CASE_DUMMY_ID;
const caseAlphaId = process.env.SALESFORCE_TEST_CASE_ALPHA_ID;
const caseBetaId = process.env.SALESFORCE_TEST_CASE_BETA_ID;

export const CourseSourceBuilder = () => {
  /**
   * Default properties don't exist in source repository
   */
  const defaultProperties = {
    id: caseDummyId,
    name: 'Learn to be a dancer',
    courseId: '',
  };
  const overrides = {
    id: caseDummyId,
    name: 'Learn to be a dancer',
    courseId: '',
  };

  return {
    matchingSourceAlpha() {
      overrides.id = caseAlphaId;
      overrides.name = 'Dance, like an alpha';
      return this;
    },

    matchingSourceBeta() {
      overrides.id = caseBetaId;
      overrides.name = 'Beta ray dancing';
      return this;
    },

    noMatchingSource() {
      return this;
    },

    matchingSourceWithCourse() {
      overrides.id = 'SourceWithCourseForFakeRepoId';
      overrides.name = 'Already associated';
      overrides.courseId = 'JustAnyOldCourseIdForNow';
      return this;
    },

    matchingSourceInvalid() {
      overrides.id = 'InvalidIdForFakeRepo';
      overrides.name = '';
      return this;
    },

    exists() {
      overrides.id = 'ThisSourceExists';
      return this;
    },

    build(): CourseSource {
      return CourseSource.check({
        ...defaultProperties,
        ...overrides,
      });
    },
  };
};
