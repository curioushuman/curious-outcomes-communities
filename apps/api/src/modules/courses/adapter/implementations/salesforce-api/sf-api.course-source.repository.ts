import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as TE from 'fp-ts/lib/TaskEither';

import { CourseSource } from '../../../domain/entities/course-source';
import { CourseSourceRepository } from '../../ports/course-source.repository';
import { FindCourseSourceDto } from '../../../application/queries/find-course-source/find-course-source.dto';
import { ErrorFactory } from '../../../../../shared/domain/errors/error-factory';
import { RequestInvalidError } from '../../../../../shared/domain/errors/request-invalid.error';
import { SalesforceApiCourseSourceMapper } from './sf-api-course-source.mapper';
import {
  SalesforceApiCourseSource,
  salesforceApiCourseSourceFields,
} from './types/sf-api.course-source';
import { SalesforceApiCourseSourceResponse } from './types/sf-api.course-source';
import { RepositoryItemNotFoundError } from '../../../../../shared/domain/errors/repository/item-not-found.error';

@Injectable()
export class SalesforceApiCourseSourceRepository
  implements CourseSourceRepository
{
  private sourceName: string;
  private fieldsString: string;

  constructor(
    private httpService: HttpService,
    private errorFactory: ErrorFactory
  ) {
    this.sourceName = 'Case';
    this.fieldsString = salesforceApiCourseSourceFields.join(', ');
  }

  /**
   * TODO
   * - [ ] find a useful SF endpoint for this
   */
  public livenessProbe(): TE.TaskEither<Error, boolean> {
    return TE.tryCatch(
      async () => {
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

  public findOne(dto: FindCourseSourceDto): TE.TaskEither<Error, CourseSource> {
    const { id } = dto;
    return TE.tryCatch(
      async () => {
        if (!id) {
          throw new RequestInvalidError(
            'Invalid ID supplied to findOne() in SalesforceApi'
          );
        }
        const q = `SELECT ${this.fieldsString} FROM ${this.sourceName} WHERE Id = '${id}'`;
        const request$ =
          this.httpService.get<SalesforceApiCourseSourceResponse>(`query`, {
            params: {
              q,
            },
          });
        const response = await firstValueFrom(request$);
        if (response.data.records.length === 0) {
          throw new RepositoryItemNotFoundError();
        }
        // TODO - improve this
        const salesforceApiCourseSource = SalesforceApiCourseSource.check(
          response.data.records[0]
        );

        // could this similarly be in a serialisation decorator?
        return SalesforceApiCourseSourceMapper.toDomain(
          salesforceApiCourseSource
        );
      },
      (error: Error) => this.errorFactory.error(error)
    );
  }
}
