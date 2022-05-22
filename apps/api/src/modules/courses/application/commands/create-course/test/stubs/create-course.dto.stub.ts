import { CreateCourseDto } from '../../create-course.dto';

/**
 * Heavily inspired by: https://github.com/VincentJouanne/nest-clean-architecture
 */
export const CreateCourseDtoBuilder = () => {
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

    newValid() {
      overrides.externalId = '5000K000027ORQSQA4';
      return this;
    },

    noExternalId() {
      delete defaultProperties.externalId;
      delete overrides.externalId;
      return this;
    },

    build(): CreateCourseDto {
      return CreateCourseDto.check({
        ...defaultProperties,
        ...overrides,
      });
    },
  };
};
