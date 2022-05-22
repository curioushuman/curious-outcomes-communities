import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { TaskEither, tryCatch } from 'fp-ts/lib/TaskEither';

import { CourseSource } from '../../../domain/entities/course-source';
import { CourseSourceRepository } from '../../ports/course-source.repository';
import { CourseSourceBuilder } from '../../../test/stubs/course-source.stub';
import { FindCourseSourceDto } from '../../../application/queries/find-course-source/find-course-source.dto';

@Injectable()
export class FakeCourseSourceRepository implements CourseSourceRepository {
  private courseSources: CourseSource[] = [];

  constructor() {
    this.courseSources.push(CourseSourceBuilder().build());
  }

  public findOne(dto: FindCourseSourceDto): TaskEither<Error, CourseSource> {
    const { id } = dto;
    return tryCatch(
      async () => {
        return this.courseSources.find(
          (courseSource) => courseSource.id === id
        );
      },
      (reason: unknown) => new InternalServerErrorException(reason)
    );
  }
}
