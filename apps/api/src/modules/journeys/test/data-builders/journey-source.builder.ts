import { JourneySource } from '../../domain/entities/journey-source';

/**
 * Heavily inspired by: https://github.com/VincentJouanne/nest-clean-architecture
 */
export const JourneySourceBuilder = () => {
  const defaultProperties = {
    id: '5000K00002O2GEYQA3',
    name: 'Learn to be a dancer',
  };
  const overrides = {
    id: '5000K00002O2GEYQA3',
    name: 'Learn to be a dancer',
  };

  return {
    build(): JourneySource {
      return JourneySource.check({
        ...defaultProperties,
        ...overrides,
      });
    },
  };
};
