import { Course } from '../../../domain/entities/course';
import { MongoDbCourse } from './schema/course.schema';

export class MongoDbCourseMapper {
  public static toDomain(mongoDbCourse: MongoDbCourse): Course {
    return Course.check({
      externalId: mongoDbCourse.externalId,
      name: mongoDbCourse.name,
      slug: mongoDbCourse.slug,
    });
  }

  public static toPersist(course: Course): MongoDbCourse {
    return {
      externalId: course.externalId,
      name: course.name,
      slug: course.slug,
    };
  }
}
