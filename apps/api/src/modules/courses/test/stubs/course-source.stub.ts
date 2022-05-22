import { CourseSource } from '../../domain/entities/course-source';

/**
 * Heavily inspired by: https://github.com/VincentJouanne/nest-clean-architecture
 */
export const CourseSourceBuilder = () => {
  const defaultProperties = {
    id: '5000K00002O2GEYQA3',
    name: 'Learn to be a dancer',
  };
  const overrides = {
    id: '5000K00002O2GEYQA3',
    name: 'Learn to be a dancer',
  };

  return {
    build(): CourseSource {
      return CourseSource.check({
        ...defaultProperties,
        ...overrides,
      });
    },
  };
};
