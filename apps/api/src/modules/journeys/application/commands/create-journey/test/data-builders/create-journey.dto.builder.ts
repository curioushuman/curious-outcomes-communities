import { CreateJourneyDto } from '../../create-journey.dto';

/**
 * Heavily inspired by: https://github.com/VincentJouanne/nest-clean-architecture
 */
export const CreateJourneyDtoBuilder = () => {
  const defaultProperties = {
    name: 'Oh to be a dancer',
    slug: 'oh-to-be-a-dancer',
  };
  const overrides = {
    name: 'Oh to be a dancer',
    slug: 'oh-to-be-a-dancer',
  };

  return {
    withFunkyChars() {
      overrides.name = "Don't you wanna be a dancer!";
      overrides.slug = 'dont-you-wanna-be-a-dancer';
      return this;
    },

    build(): CreateJourneyDto {
      return CreateJourneyDto.check({
        ...defaultProperties,
        ...overrides,
      });
    },
  };
};
