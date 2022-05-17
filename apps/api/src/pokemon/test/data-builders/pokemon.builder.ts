import { Pokemon } from '../../domain/entities/pokemon';

/**
 * Heavily inspired by: https://github.com/VincentJouanne/nest-clean-architecture
 */
export const PokemonBuilder = () => {
  const defaultProperties = {
    name: 'pikachu',
    slug: 'pikachu',
  };
  const overrides = {
    name: 'pikachu',
    slug: 'pikachu',
  };

  return {
    withAssumedSpace() {
      overrides.name = 'jigglypuff';
      overrides.slug = overrides.name;
      return this;
    },

    withApostrophe() {
      overrides.name = 'farfetchd';
      overrides.slug = overrides.name;
      return this;
    },

    withDash() {
      overrides.name = 'hakamo-o';
      overrides.slug = overrides.name;
      return this;
    },

    build(): Pokemon {
      return Pokemon.check({
        ...defaultProperties,
        ...overrides,
      });
    },
  };
};
