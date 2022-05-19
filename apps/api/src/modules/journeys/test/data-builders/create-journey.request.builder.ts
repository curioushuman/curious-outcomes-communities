import {
  CreateJourneyFromRequestDto,
  CreateJourneyRequestDto,
} from '../../infra/dto/create-journey.request.dto';

/**
 * Heavily inspired by: https://github.com/VincentJouanne/nest-clean-architecture
 */
export const CreateJourneyRequestDtoBuilder = () => {
  const defaultProperties = {
    name: 'Oh to be a dancer',
    description: 'You know you wanna',
  };
  const overrides = {
    name: 'Oh to be a dancer',
    description: 'You know you wanna',
  };

  return {
    withFunkyChars() {
      overrides.name = "Don't you wanna be a dancer!";
      return this;
    },

    failingPartial() {
      delete defaultProperties.name;
      delete overrides.name;
      return this;
    },

    passingPartial() {
      delete defaultProperties.description;
      delete overrides.description;
      return this;
    },

    build(): CreateJourneyRequestDto {
      return CreateJourneyRequestDto.check({
        ...defaultProperties,
        ...overrides,
      });
    },
    buildNoCheck(): CreateJourneyRequestDto {
      return {
        ...defaultProperties,
        ...overrides,
      };
    },
  };
};

export const CreateJourneyFromRequestDtoBuilder = () => {
  const defaultProperties = {
    externalId: '5000K00002O2GEYQA3',
  };
  const overrides = {
    externalId: '5000K00002O2GEYQA3',
  };

  return {
    noMatchingObject() {
      overrides.externalId = 'ShhhImNotActuallyARealId';
      return this;
    },

    noExternalId() {
      delete defaultProperties.externalId;
      delete overrides.externalId;
      return this;
    },

    fullBody() {
      const createJourneyDto = CreateJourneyRequestDtoBuilder().build();
      Object.keys(createJourneyDto).forEach((key) => {
        overrides[key] = createJourneyDto[key];
      });
      return this;
    },

    failButPassBody() {
      const createJourneyDto = CreateJourneyRequestDtoBuilder()
        .failingPartial()
        .buildNoCheck();
      Object.keys(createJourneyDto).forEach((key) => {
        overrides[key] = createJourneyDto[key];
      });
      return this;
    },

    build(): CreateJourneyFromRequestDto {
      return CreateJourneyFromRequestDto.check({
        ...defaultProperties,
        ...overrides,
      });
    },
  };
};
