import { Injectable, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as TE from 'fp-ts/lib/TaskEither';
import * as O from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/function';

import { CourseSource } from '../../../domain/entities/course-source';
import { CourseSourceRepository } from '../../ports/course-source.repository';
import { CourseSourceBuilder } from '../../../test/stubs/course-source.stub';
import { FindCourseSourceDto } from '../../../application/queries/find-course-source/find-course-source.dto';
import { ErrorFactory } from '../../../../../shared/domain/errors/error-factory';

@Injectable()
export class SalesforceApiCourseSourceRepository
  implements CourseSourceRepository
{
  private courseSources: CourseSource[] = [];

  constructor(
    private httpService: HttpService,
    private readonly errorFactory: ErrorFactory
  ) {
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
      (error: Error) => this.errorFactory.error(error)
    );
  }

  public livenessProbe(): TE.TaskEither<Error, boolean> {
    return TE.tryCatch(
      async () => {
        // TODO: extract this into a httpService wrapper or similar
        const request$ = this.httpService.get(
          `https://pokeapi.co/api/v2/language/en`
        );
        await firstValueFrom(request$);
        // if a value is received, without an error we're good
        return true;
      },
      (error: Error) => this.errorFactory.error(error)
    );
  }

  public authorise(): TE.TaskEither<Error, boolean> {
    return TE.tryCatch(
      async () => {
        return true;
      },
      (error: Error) => this.errorFactory.error(error)
    );
  }
}
