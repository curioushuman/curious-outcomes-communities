import { GetPokemonRequestDto } from '../../infra/dto/get-pokemon.request.dto';

/**
 * Heavily inspired by: https://github.com/VincentJouanne/nest-clean-architecture
 */
export const GetPokemonRequestDtoBuilder = () => {
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

    build(): GetPokemonRequestDto {
      return GetPokemonRequestDto.check({
        ...defaultProperties,
        ...overrides,
      });
    },
  };
};
