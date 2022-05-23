import { CreateCourseDtoBuilder } from '../../application/commands/create-course/test/stubs/create-course.dto.stub';
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
    testNewValid() {
      overrides.id = CreateCourseDtoBuilder().newValid().build().externalId;
      overrides.name = 'Dance, the hard way';
      return this;
    },

    build(): CourseSource {
      return CourseSource.check({
        ...defaultProperties,
        ...overrides,
      });
    },
  };
};