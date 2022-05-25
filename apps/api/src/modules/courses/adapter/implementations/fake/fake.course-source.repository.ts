import { Injectable, NotFoundException } from '@nestjs/common';
import * as TE from 'fp-ts/lib/TaskEither';
import * as O from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/function';

import { CourseSource } from '../../../domain/entities/course-source';
import { CourseSourceRepository } from '../../ports/course-source.repository';
import { CourseSourceBuilder } from '../../../test/stubs/course-source.stub';
import { FindCourseSourceDto } from '../../../application/queries/find-course-source/find-course-source.dto';
import { ErrorFactory } from '../../../../../shared/domain/errors/error-factory';

@Injectable()
export class FakeCourseSourceRepository implements CourseSourceRepository {
  private courseSources: CourseSource[] = [];

  constructor(private readonly errorFactory: ErrorFactory) {
    this.courseSources.push(CourseSourceBuilder().build());
    this.courseSources.push(CourseSourceBuilder().testNewValid().build());
    this.courseSources.push(CourseSourceBuilder().testNewInvalid().build());
    this.courseSources.push(CourseSourceBuilder().testNewHasCourseId().build());
  }

  public findOne(dto: FindCourseSourceDto): TE.TaskEither<Error, CourseSource> {
    const { id } = dto;
    return TE.tryCatch(
      async () => {
        const courseSource = this.courseSources.find((cs) => cs.id === id);
        return pipe(
          courseSource,
          O.fromNullable,
          O.fold(
            () => {
              // this mimics an API or DB call throwing an error
              throw new NotFoundException(
                `Course source with id ${id} not found`
              );
            },
            (source) => source
          )
        );
      },
      (error: Error) => this.errorFactory.newError(error)
    );
  }
}
