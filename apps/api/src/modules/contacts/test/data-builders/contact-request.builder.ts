import { GetContactRequestDto } from '../../infra/dto/get-contact.request.dto';

/**
 * Heavily inspired by: https://github.com/VincentJouanne/nest-clean-architecture
 */
export const GetContactRequestDtoBuilder = () => {
  const defaultProperties = {
    slug: 'pikachu',
  };
  const overrides = {
    slug: 'pikachu',
  };

  return {
    withAssumedSpace() {
      overrides.slug = 'jiggly puff';
      return this;
    },

    withApostrophe() {
      overrides.slug = "farfetch'd";
      return this;
    },

    doesntExist() {
      overrides.slug = 'furfligarbabard';
      return this;
    },

    build(): GetContactRequestDto {
      return GetContactRequestDto.check({
        ...defaultProperties,
        ...overrides,
      });
    },
  };
};
