import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/function';

import { SalesforceApiResponseCreate } from '../../types/sf-api.response';
import { ExternalId } from '../../../../../domain/value-objects/external-id';
import { executeTask } from '../../../../../../../shared/utils/execute-task';
import { SalesforceApiRepositoryError } from '../../sf-api.repository.error-factory';

type SalesforceItemForDelete = {
  Id: string;
};

export abstract class SalesforceApiManufacturer<CreateType> {
  abstract sourceName: string;
  abstract labelFieldName: string;

  constructor(
    protected readonly httpService: HttpService,
    protected context: string
  ) {}

  /**
   * Abstract functions
   */

  /**
   * Note: this returns a TE just in case it needs to obtain related objects
   */
  abstract default(): TE.TaskEither<SalesforceApiRepositoryError, CreateType>;

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

  async buildNoReturn(): Promise<void> {
    const task = pipe(
      this.default(),
      TE.chain((sourceCreate) => this.create(sourceCreate))
    );
    executeTask(task);
  }

  protected create = (
    createSource: CreateType
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

  async tidyUp(): Promise<readonly void[]> {
    const task = pipe(
      this.findAllForDelete(),
      TE.chain((all) => pipe(all, this.deleteAll, TE.sequenceArray))
    );
    return executeTask(task);
  }

  private findAllForDelete = (): TE.TaskEither<
    SalesforceApiRepositoryError,
    SalesforceItemForDelete[]
  > => {
    return TE.tryCatch(
      async () => {
        const q = `SELECT Id FROM ${this.sourceName} WHERE ${this.labelFieldName} LIKE '%${this.context}'`;
        const request$ = this.httpService.get<{
          records: SalesforceItemForDelete[];
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
    items: SalesforceItemForDelete[]
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
