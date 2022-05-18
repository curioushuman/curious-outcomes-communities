import { CreateJourneyRequestDto } from '../../infra/dto/create-journey.request.dto';

/**
 * Heavily inspired by: https://github.com/VincentJouanne/nest-clean-architecture
 */
export const CreateJourneyRequestDtoBuilder = () => {
  const defaultProperties = {
    name: 'Learn to be a dancer',
  };
  const overrides = {
    name: 'Learn to be a dancer',
  };

  return {
    withFunkyCharsSpace() {
      overrides.name = "Don't you wanna be a dancer!";
      return this;
    },

    build(): CreateJourneyRequestDto {
      return CreateJourneyRequestDto.check({
        ...defaultProperties,
        ...overrides,
      });
    },
  };
};
