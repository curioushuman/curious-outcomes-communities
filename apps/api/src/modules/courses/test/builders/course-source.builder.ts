import { CreateCourseDtoBuilder } from '../../application/commands/create-course/test/builders/create-course.dto.builder';
import { CourseSource } from '../../domain/entities/course-source';

/**
 * Heavily inspired by: https://github.com/VincentJouanne/nest-clean-architecture
 */
export const CourseSourceBuilder = () => {
  const defaultProperties = {
    id: '5000K00002O2GEYQA3',
    name: 'Learn to be a dancer',
    courseId: '',
  };
  const overrides = {
    id: '5000K00002O2GEYQA3',
    name: 'Learn to be a dancer',
    courseId: '',
  };

  return {
    testNewValid() {
      overrides.id = CreateCourseDtoBuilder().newValid().build().externalId;
      overrides.name = 'Dance, the hard way';
      return this;
    },

    testNewInvalid() {
      overrides.id = CreateCourseDtoBuilder().newInvalid().build().externalId;
      overrides.name = '';
      return this;
    },

    testNewHasCourseId() {
      overrides.id = CreateCourseDtoBuilder()
        .newHasCourseId()
        .build().externalId;
      overrides.name = 'Already associated';
      overrides.courseId = 'JustAnyOldCourseIdForNow';
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
