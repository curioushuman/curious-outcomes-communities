import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as TE from 'fp-ts/lib/TaskEither';
import * as T from 'fp-ts/lib/Task';
import { pipe } from 'fp-ts/lib/function';

import { CourseSource } from '../../../../../domain/entities/course-source';
import { SalesforceApiCourseSourceMapper } from '../../sf-api.course-source.mapper';
import {
  SalesforceApiCourseSource,
  SalesforceApiCourseSourceCreate,
  salesforceApiCourseSourceFields,
  SalesforceApiCourseSources,
} from '../../types/sf-api.course-source';
import { SalesforceApiResponseCreate } from '../../types/sf-api.response';
import { ExternalId } from '../../../../../domain/value-objects/external-id';
import { executeTask } from '../../../../../../../shared/utils/execute-task';
import { SalesforceApiRepositoryError } from '../../sf-api.repository.error-factory';

/**
 * Creates/deletes records in Salesforce around tests
 */

export class CourseSourceManufacturer {
  private context = 'CO_TEST';
  constructor(private readonly httpService: HttpService, context?: string) {
    this.context = context ?? this.context;
  }

  setContext(context: string): void {
    this.context = context;
  }

  randomString(): string {
    return Math.floor(Math.random() * 123456789).toString();
  }

  contextualName(): string {
    const name = 'TEST CO course ';
    return name.concat(this.randomString(), ' ', this.context);
  }

  default(): SalesforceApiCourseSourceCreate {
    return {
      Subject: this.contextualName(),
      Status: 'In progress',
      Type: 'Capacity development',
      Type_sub__c: 'Blended learning',
      Case_Year__c: '2022',
      RecordTypeId: '0120K000000yprEQAQ',
    };
  }

  async build(): Promise<CourseSource> {
    const courseSource = this.default();
    const task = pipe(
      courseSource,
      this.create,
      // this delays the next call by half a second
      TE.chain((val) => pipe(val, T.of, T.delay(500), TE.fromTask)),
      // passes on through
      TE.chain((id) => this.findById(id))
    );
    return executeTask(task);
  }

  create = (
    courseSource: SalesforceApiCourseSourceCreate
  ): TE.TaskEither<SalesforceApiRepositoryError, ExternalId> => {
    return TE.tryCatch(
      async () => {
        const request$ = this.httpService.post<SalesforceApiResponseCreate>(
          `sobjects/Case`,
          courseSource
        );
        const response = await firstValueFrom(request$);
        if (response.data.success === true) {
          return response.data.id as ExternalId;
        }
        throw new Error('Failed to create TEST CourseSource');
      },
      (error: SalesforceApiRepositoryError) => this.handleError(error)
    );
  };

  findById = (
    id: ExternalId
  ): TE.TaskEither<SalesforceApiRepositoryError, CourseSource> => {
    const fields = salesforceApiCourseSourceFields;
    return TE.tryCatch(
      async () => {
        const request$ = this.httpService.get<SalesforceApiCourseSource>(
          `sobjects/Case/${id}`,
          {
            params: {
              fields,
            },
          }
        );
        const response = await firstValueFrom(request$);
        return SalesforceApiCourseSourceMapper.toDomain(response.data);
      },
      (error: SalesforceApiRepositoryError) => this.handleError(error)
    );
  };

  async tidyUp(): Promise<readonly void[]> {
    const task = pipe(
      this.findAll(),
      TE.chain((all) => pipe(all, this.deleteAll, TE.sequenceArray))
    );
    return executeTask(task);
  }

  /**
   * TODO
   * - [ ] don't hard code 'Case'
   */
  findAll = (): TE.TaskEither<
    SalesforceApiRepositoryError,
    SalesforceApiCourseSource[]
  > => {
    return TE.tryCatch(
      async () => {
        const q = `SELECT Id FROM Case WHERE Subject LIKE '%${this.context}'`;
        const request$ = this.httpService.get<SalesforceApiCourseSources>(
          `query`,
          {
            params: {
              q,
            },
          }
        );
        const response = await firstValueFrom(request$);
        if (response.data?.records?.length === 0) {
          return [];
        }
        return response.data.records;
      },
      (error: SalesforceApiRepositoryError) => this.handleError(error)
    );
  };

  deleteAll = (
    items: SalesforceApiCourseSource[]
  ): TE.TaskEither<Error, void>[] => {
    return items.map((item) => this.deleteOne(item.Id as ExternalId));
  };

  deleteOne = (
    id: ExternalId
  ): TE.TaskEither<SalesforceApiRepositoryError, void> => {
    return TE.tryCatch(
      async () => {
        const request$ = this.httpService.delete(`sobjects/Case/${id}`);
        await firstValueFrom(request$);
      },
      (error: SalesforceApiRepositoryError) => this.handleError(error)
    );
  };

  handleError = (
    error: SalesforceApiRepositoryError
  ): SalesforceApiRepositoryError => {
    console.log(error);
    return error;
  };
}
