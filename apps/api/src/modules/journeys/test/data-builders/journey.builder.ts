import { Journey } from '../../domain/entities/journey';

/**
 * Heavily inspired by: https://github.com/VincentJouanne/nest-clean-architecture
 */
export const JourneyBuilder = () => {
  const defaultProperties = {
    name: 'Learn to be a dancer',
    slug: 'learn-to-be-a-dancer',
  };
  const overrides = {
    name: 'Learn to be a dancer',
    slug: 'learn-to-be-a-dancer',
  };

  return {
    withFunkyChars() {
      overrides.name = "I'm gonna be a dancer!";
      overrides.slug = 'im-gonna-be-a-dancer';
      return this;
    },

    build(): Journey {
      return Journey.check({
        ...defaultProperties,
        ...overrides,
      });
    },
  };
};
