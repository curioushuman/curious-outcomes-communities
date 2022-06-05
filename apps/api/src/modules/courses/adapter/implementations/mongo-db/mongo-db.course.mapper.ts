import { Course } from '../../../domain/entities/course';
import { MongoDbCourse } from './schema/course.schema';

export class MongoDbCourseMapper {
  /**
   * Note: responsibility for slug creation left to the create-course.command
   */
  public static toDomain(mongoDbCourse: MongoDbCourse): Course {
    // Check for slug separately for more granular error reporting
    return Course.check({
      externalId: mongoDbCourse.externalId,
      name: mongoDbCourse.name,
      slug: mongoDbCourse.slug,
    });
  }
}
