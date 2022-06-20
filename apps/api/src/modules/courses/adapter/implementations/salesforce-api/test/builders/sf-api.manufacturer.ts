import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as TE from 'fp-ts/lib/TaskEither';
import * as T from 'fp-ts/lib/Task';
import { pipe } from 'fp-ts/lib/function';

import { CourseSource } from '../../../../../domain/entities/course-source';
import {
  SalesforceApiCourseSource,
  SalesforceApiCourseSourceCreate,
} from '../../types/sf-api.course-source';
import { SalesforceApiResponseCreate } from '../../types/sf-api.response';
import { ExternalId } from '../../../../../domain/value-objects/external-id';
import { executeTask } from '../../../../../../../shared/utils/execute-task';
import { SalesforceApiRepositoryError } from '../../sf-api.repository.error-factory';
import { ParticipantSource } from '../../../../../domain/entities/participant-source';
import {
  SalesforceApiParticipantSource,
  SalesforceApiParticipantSourceCreate,
} from '../../types/sf-api.participant-source';

/**
 * Creates/deletes records in Salesforce around tests
 *
 * ! UP TO HERE!!!
 * Creating an abstract class
 * Making sure course still works
 * * Then create person and organisation manufacturers
 * * Then finish off participant manufacturer
 * * And finally, the participant tests
 */

export type SourceName = 'Case' | 'Participant__c';
type SourceTypes = CourseSource | ParticipantSource;

/**
 * These are type definitions, based on other types
 * e.g. if the sourceType is CourseSource,
 *      then the Salesforce type is SalesforceApiCourseSource
 */

type SalesforceType<SourceType> = SourceType extends CourseSource
  ? SalesforceApiCourseSource
  : SourceType extends ParticipantSource
  ? SalesforceApiParticipantSource
  : never;

type CreateType<SourceType> = SourceType extends CourseSource
  ? SalesforceApiCourseSourceCreate
  : SourceType extends ParticipantSource
  ? SalesforceApiParticipantSourceCreate
  : never;

export abstract class SalesforceApiManufacturer<
  SourceType extends SourceTypes
> {
  abstract sourceName: SourceName;
  abstract labelFieldName: string;
  abstract fields: string[];

  constructor(
    private readonly httpService: HttpService,
    protected context: string
  ) {}

  /**
   * Abstract functions
   */

  /**
   * Note: this returns a TE just in case it needs to obtain related objects
   */
  abstract default(): TE.TaskEither<
    SalesforceApiRepositoryError,
    CreateType<SourceType>
  >;

  abstract mapSource(salesforceType: SalesforceType<SourceType>): SourceType;

  /**
   * Other functions
   */

  setContext(context: string): void {
    this.context = context;
  }

  private randomString(): string {
    return Math.floor(Math.random() * 123456789).toString();
  }

  contextualLabel(): string {
    const name = `TEST CO ${this.sourceName} `;
    return name.concat(this.randomString(), ' ', this.context);
  }

  async build(): Promise<SourceType> {
    const task = pipe(
      this.default(),
      TE.chain((sourceCreate) => this.create(sourceCreate)),
      // this delays the next call by half a second
      TE.chain((val) => pipe(val, T.of, T.delay(500), TE.fromTask)),
      // passes on through
      TE.chain((id) => this.findById(id))
    );
    return executeTask(task);
  }

  private create = (
    createSource: CreateType<SourceType>
  ): TE.TaskEither<SalesforceApiRepositoryError, ExternalId> => {
    return TE.tryCatch(
      async () => {
        const request$ = this.httpService.post<SalesforceApiResponseCreate>(
          `sobjects/${this.sourceName}`,
          createSource
        );
        const response = await firstValueFrom(request$);
        if (response.data.success === true) {
          return response.data.id as ExternalId;
        }
        throw new Error(`Failed to create TEST ${this.sourceName}`);
      },
      (error: SalesforceApiRepositoryError) => this.handleError(error)
    );
  };

  private findById = (
    id: ExternalId
  ): TE.TaskEither<SalesforceApiRepositoryError, SourceType> => {
    return TE.tryCatch(
      async () => {
        const request$ = this.httpService.get<SalesforceType<SourceType>>(
          `sobjects/${this.sourceName}/${id}`,
          {
            params: {
              fields: this.fields,
            },
          }
        );
        const response = await firstValueFrom(request$);
        return this.mapSource(response.data);
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

  private findAll = (): TE.TaskEither<
    SalesforceApiRepositoryError,
    SalesforceType<SourceType>[]
  > => {
    return TE.tryCatch(
      async () => {
        const q = `SELECT Id FROM ${this.sourceName} WHERE ${this.labelFieldName} LIKE '%${this.context}'`;
        const request$ = this.httpService.get<{
          records: SalesforceType<SourceType>[];
        }>(`query`, {
          params: {
            q,
          },
        });
        const response = await firstValueFrom(request$);
        if (response.data?.records?.length === 0) {
          return [];
        }
        return response.data.records;
      },
      (error: SalesforceApiRepositoryError) => this.handleError(error)
    );
  };

  private deleteAll = (
    items: SalesforceType<SourceType>[]
  ): TE.TaskEither<Error, void>[] => {
    return items.map((item) => this.deleteOne(item.Id as ExternalId));
  };

  private deleteOne = (
    id: ExternalId
  ): TE.TaskEither<SalesforceApiRepositoryError, void> => {
    return TE.tryCatch(
      async () => {
        const request$ = this.httpService.delete(
          `sobjects/${this.sourceName}/${id}`
        );
        await firstValueFrom(request$);
      },
      (error: SalesforceApiRepositoryError) => this.handleError(error)
    );
  };

  protected handleError = (
    error: SalesforceApiRepositoryError
  ): SalesforceApiRepositoryError => {
    console.log(error);
    return error;
  };
}
