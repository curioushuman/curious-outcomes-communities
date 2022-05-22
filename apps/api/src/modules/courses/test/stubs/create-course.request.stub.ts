import { CreateCourseRequestDto } from '../../infra/dto/create-course.request.dto';

/**
 * Heavily inspired by: https://github.com/VincentJouanne/nest-clean-architecture
 */

export const CreateCourseRequestDtoBuilder = () => {
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

    build(): CreateCourseRequestDto {
      return CreateCourseRequestDto.check({
        ...defaultProperties,
        ...overrides,
      });
    },
  };
};
