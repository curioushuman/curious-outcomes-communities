import { CreateJourneyRequestDto } from '../../infra/dto/create-journey.request.dto';

/**
 * Heavily inspired by: https://github.com/VincentJouanne/nest-clean-architecture
 */
export const CreateJourneyRequestDtoBuilder = () => {
  const defaultProperties = {
    name: 'Oh to be a dancer',
  };
  const overrides = {
    name: 'Oh to be a dancer',
  };

  return {
    withFunkyChars() {
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
