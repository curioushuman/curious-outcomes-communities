import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as TE from 'fp-ts/lib/TaskEither';
import * as jwt from 'jsonwebtoken';

import { CourseSource } from '../../../domain/entities/course-source';
import { CourseSourceRepository } from '../../ports/course-source.repository';
import { FindCourseSourceDto } from '../../../application/queries/find-course-source/find-course-source.dto';
import { ErrorFactory } from '../../../../../shared/domain/errors/error-factory';
import { RepositoryAuthenticationError } from '../../../../../shared/domain/errors/repository/authentication.error';
import { RequestInvalidError } from '../../../../../shared/domain/errors/request-invalid.error';
import { SalesforceApiCourseSourceMapper } from './salesforce-api-course-source.mapper';
import {
  SalesforceApiCourseSource,
  salesforceApiCourseSourceFields,
} from './types/course-source';
import {
  SalesforceApiCourseSourceResponse,
  SalesforceApiResponseAuth,
} from './types/course-source-response';
import { executeTask } from '../../../../../shared/utils/execute-task';

@Injectable()
export class SalesforceApiCourseSourceRepository
  implements CourseSourceRepository
{
  private baseURL: string;
  private authURL: string;
  private sourceName: string;
  private fieldsString: string;

  constructor(
    private httpService: HttpService,
    private errorFactory: ErrorFactory
  ) {
    this.baseURL = `${process.env.SALESFORCE_DOMAIN_DATA}/`;
    this.baseURL += `${process.env.SALESFORCE_DOMAIN_DATA_VERSION}/`;
    this.authURL = `${process.env.SALESFORCE_DOMAIN_TOKEN}/services/oauth2/token`;
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
        // TODO: extract this into a httpService wrapper or similar
        const request$ = this.httpService.get(
          `https://pokeapi.co/api/v2/language/en`
        );
        await firstValueFrom(request$);
        // if a value is received, without an error we're good
        return true;
      },
      (error: Error) => this.errorFactory.newError(error)
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
        const query = `SELECT ${this.fieldsString} FROM ${this.sourceName} WHERE Id = '${id}'`;
        const token = await executeTask(this.authorise());
        const request$ =
          this.httpService.get<SalesforceApiCourseSourceResponse>(
            `${this.baseURL}/query`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              params: {
                q: query,
              },
            }
          );
        const response = await firstValueFrom(request$);
        // TODO - improve this
        const salesforceApiCourseSource = SalesforceApiCourseSource.check(
          response.data.records[0]
        );

        // could this similarly be in a serialisation decorator?
        return SalesforceApiCourseSourceMapper.toDomain(
          salesforceApiCourseSource
        );
      },
      (error: Error) => this.errorFactory.newError(error)
    );
  }

  /**
   * TODO
   * - [ ] store token somewhere
   * - [ ] throw error if access_token not actually present
   * - [ ] env variables somewhere better for dev
   * - [ ] env in sealed secrets for K8s
   */
  public authorise(): TE.TaskEither<Error, string> {
    return TE.tryCatch(
      async () => {
        const body = new URLSearchParams({
          grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
          assertion: this.prepareJwt(),
        });
        const request$ = this.httpService.post<SalesforceApiResponseAuth>(
          this.authURL,
          body.toString()
        );
        const response = await firstValueFrom(request$);
        if (response.data?.access_token === undefined) {
          throw new RepositoryAuthenticationError('No access token returned');
        }
        return response.data.access_token;
      },
      (error: Error) =>
        new RepositoryAuthenticationError(
          this.errorFactory.errorAsString(error)
        )
    );
  }

  private prepareJwt(): string {
    return jwt.sign(
      {
        iss: process.env.SALESFORCE_CONSUMER_KEY,
        sub: process.env.SALESFORCE_USER,
        aud: process.env.SALESFORCE_DOMAIN_TOKEN,
      },
      process.env.SALESFORCE_CERTIFICATE_KEY,
      {
        algorithm: 'RS256',
        expiresIn: '1h',
        header: {
          alg: 'RS256',
          typ: 'JWT',
        },
      }
    );
  }

  public testDisableAuth(): void {
    process.env.SALESFORCE_DOMAIN_TOKEN = 'DISABLED';
  }
}
