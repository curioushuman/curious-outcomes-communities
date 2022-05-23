import { CreateCourseDto } from './create-course.dto';
import { CreateCourseRequestDto } from '../../../infra/dto/create-course.request.dto';
import { FindCourseSourceDto } from '../../queries/find-course-source/find-course-source.dto';
import { CourseSource } from '../../../domain/entities/course-source';
import { Course } from '../../../domain/entities/course';
import { createSlug } from '../../../domain/value-objects/slug';

/**
 * TODO
 * - create base abstract class for mappers
 */
export class CreateCourseMapper {
  public static fromRequestDto(dto: CreateCourseRequestDto): CreateCourseDto {
    return CreateCourseDto.check({
      externalId: dto.externalId,
    });
  }

  public static toFindCourseSourceDto(
    dto: CreateCourseDto
  ): FindCourseSourceDto {
    return FindCourseSourceDto.check({
      id: dto.externalId,
    });
  }

  /**
   * TODO
   * - [ ] move this to a better home
   */
  public static fromSourceToCourse(source: CourseSource): Course {
    const slug = source.name ? createSlug(source.name) : undefined;
    return Course.check({
      externalId: source.id,
      name: source.name,
      slug,
    });
  }
}