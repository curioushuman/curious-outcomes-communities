import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as TE from 'fp-ts/lib/TaskEither';
import * as T from 'fp-ts/lib/Task';
import { pipe } from 'fp-ts/lib/function';

import { CourseSource } from '../../../../../domain/entities/course-source';
import { SalesforceApiCourseSource } from '../../types/sf-api.course-source';
import { ExternalId } from '../../../../../domain/value-objects/external-id';
import { executeTask } from '../../../../../../../shared/utils/execute-task';
import { SalesforceApiRepositoryError } from '../../sf-api.repository.error-factory';
import { ParticipantSource } from '../../../../../domain/entities/participant-source';
import { SalesforceApiParticipantSource } from '../../types/sf-api.participant-source';
import { SalesforceApiManufacturer } from './sf-api.manufacturer';
import { SalesforceApiCourseSourceCreate } from './types/sf-api.course-create';
import { SalesforceApiParticipantSourceCreate } from './types/sf-api.participant-create';

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

export abstract class SalesforceApiSourceManufacturer<
  SourceType extends SourceTypes
> extends SalesforceApiManufacturer<CreateType<SourceType>> {
  /**
   * From parent
   */
  abstract sourceName: string;
  abstract labelFieldName: string;

  /**
   * Additional
   */
  abstract fields: string[];

  constructor(httpService: HttpService, context: string) {
    super(httpService, context);
  }

  /**
   * From parent
   */
  abstract default(): TE.TaskEither<
    SalesforceApiRepositoryError,
    CreateType<SourceType>
  >;

  /**
   * Additional
   */
  abstract mapSource(salesforceType: SalesforceType<SourceType>): SourceType;

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
}
