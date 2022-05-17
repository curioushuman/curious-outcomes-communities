import { Contact } from '../../domain/entities/contact';

/**
 * Heavily inspired by: https://github.com/VincentJouanne/nest-clean-architecture
 */
export const ContactBuilder = () => {
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

    build(): Contact {
      return Contact.check({
        ...defaultProperties,
        ...overrides,
      });
    },
  };
};
