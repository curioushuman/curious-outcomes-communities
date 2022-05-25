import { CourseSource } from '../../../domain/entities/course-source';
import { SalesforceApiCourseSource } from './types/course-source';

export class SalesforceApiCourseSourceMapper {
  public static toDomain(source: SalesforceApiCourseSource): CourseSource {
    return CourseSource.check({
      name: source.Summary_quick_year__c,
      slug: source.Slug__c,
    });
  }
}
