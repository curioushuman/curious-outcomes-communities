import { Course } from '../../domain/entities/course';

/**
 * Heavily inspired by: https://github.com/VincentJouanne/nest-clean-architecture
 */
export const CourseBuilder = () => {
  const defaultProperties = {
    name: 'Learn to be a dancer',
    slug: 'learn-to-be-a-dancer',
    externalId: '5000K00002O2GEYQA3',
  };
  const overrides = {
    name: 'Learn to be a dancer',
    slug: 'learn-to-be-a-dancer',
    externalId: '5000K00002O2GEYQA3',
  };

  return {
    withFunkyChars() {
      overrides.name = "I'm gonna be a dancer!";
      overrides.slug = 'im-gonna-be-a-dancer';
      return this;
    },

    build(): Course {
      return Course.check({
        ...defaultProperties,
        ...overrides,
      });
    },
  };
};
