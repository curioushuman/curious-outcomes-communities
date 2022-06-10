import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as TE from 'fp-ts/lib/TaskEither';

import { LoggableLogger } from '@curioushuman/loggable';

import { CourseSource } from '../../../domain/entities/course-source';
import { CourseSourceRepository } from '../../ports/course-source.repository';
import { FindCourseSourceDto } from '../../../application/queries/find-course-source/find-course-source.dto';
import { RequestInvalidError } from '../../../../../shared/domain/errors/request-invalid.error';
import { SalesforceApiCourseSourceMapper } from './sf-api.course-source.mapper';
import {
  SalesforceApiCourseSource,
  salesforceApiCourseSourceFields,
} from './types/sf-api.course-source';

@Injectable()
export class SalesforceApiCourseSourceRepository
  implements CourseSourceRepository
{
  private sourceName: string;

  constructor(
    private httpService: HttpService,
    private logger: LoggableLogger
  ) {
    this.sourceName = 'Case';
    this.logger.setContext(SalesforceApiCourseSourceRepository.name);
  }

  /**
   * TODO
   * - [ ] find a useful+public SF endpoint for this
   */
  livenessProbe = (): TE.TaskEither<Error, boolean> => {
    return TE.tryCatch(
      async () => {
        const request$ = this.httpService.get(
          `https://pokeapi.co/api/v2/language/en`
        );
        await firstValueFrom(request$);
        // if a value is received, without an error we're good
        return true;
      },
      (error: Error) => error as Error
    );
  };

  findOne = (dto: FindCourseSourceDto): TE.TaskEither<Error, CourseSource> => {
    const { id } = dto;
    if (!id) {
      throw new RequestInvalidError(
        'Invalid ID supplied to findOne() in SalesforceApi'
      );
    }
    const endpoint = `sobjects/${this.sourceName}/${id}`;
    // TODO: use keyof to get the fields
    const fields = salesforceApiCourseSourceFields;
    this.logger.debug(`Finding ${this.sourceName} with endpoint ${endpoint}`);
    return TE.tryCatch(
      async () => {
        const request$ = this.httpService.get<SalesforceApiCourseSource>(
          endpoint,
          {
            params: {
              fields,
            },
          }
        );
        const response = await firstValueFrom(request$);

        // NOTE: if the response was invalid, an error would have been thrown
        // could this similarly be in a serialisation decorator?
        return SalesforceApiCourseSourceMapper.toDomain(response.data);
      },
      (error: Error) => error as Error
    );
  };

  // the below is for later when we introduce query-ing
  // findOne = (dto: FindCourseSourceDto): TE.TaskEither<Error, CourseSource> => {
  //   const { id } = dto;
  //   return pipe(
  //     id,
  //     O.fromNullable,
  //     O.fold(
  //       () =>
  //         TE.left(
  //           new NotYetImplementedError(
  //             'Salesforce API repository > findByQuery'
  //           )
  //         ),
  //       (extId) => {
  //         return this.findOneById(extId);
  //       }
  //     )
  //   );
  // }

  // findOneById = (id: ExternalId): TE.TaskEither<Error, CourseSource> => {
  //   return TE.tryCatch(
  //     async () => {
  //       if (!id) {
  //         throw new RequestInvalidError(
  //           'Invalid ID supplied to findOne() in SalesforceApi'
  //         );
  //       }
  //       const request$ = this.httpService.get<SalesforceApiCourseSource>(
  //         `sobjects/${this.sourceName}/${id}`,
  //         {
  //           params: {
  //             fields: salesforceApiCourseSourceFields,
  //           },
  //         }
  //       );
  //       const response = await firstValueFrom(request$);

  //       // could this similarly be in a serialisation decorator?
  //       return SalesforceApiCourseSourceMapper.toDomain(response.data);

  //       // Save this for the findByQuery() method
  //       // Obviously need to update this line to handle different queries
  //       // const q = `SELECT ${this.fieldsString} FROM ${this.sourceName} WHERE Id = '${id}'`;
  //       // const request$ =
  //       //   this.httpService.get<SalesforceApiCourseSources>(`query`, {
  //       //     params: {
  //       //       q,
  //       //     },
  //       //   });
  //       // if (response.data.records.length === 0) {
  //       //   throw new RepositoryItemNotFoundError();
  //       // }
  //       // const salesforceApiCourseSource = SalesforceApiCourseSource.check(
  //       //   response.data.records[0]
  //       // );
  //     },
  //     (error: Error) => error as Error
  //   );
  // }
}
