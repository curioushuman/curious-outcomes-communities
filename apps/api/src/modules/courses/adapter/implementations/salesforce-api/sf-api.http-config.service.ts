import { HttpModuleOptions, HttpModuleOptionsFactory } from '@nestjs/axios';
import axios from 'axios';
import { Injectable } from '@nestjs/common';
import * as TE from 'fp-ts/lib/TaskEither';
import * as jwt from 'jsonwebtoken';
import { pipe } from 'fp-ts/lib/function';

import { LoggableLogger } from '@curioushuman/loggable';

import { executeTask } from '../../../../../shared/utils/execute-task';
import { SalesforceApiResponseAuth } from './types/sf-api.response';
import { ErrorFactory } from '../../../../../shared/domain/errors/error-factory';
import { SalesforceApiRepositoryErrorFactory } from './sf-api.repository.error-factory';
import { logAction } from '../../../../../shared/utils/log-action';

/**
 * Setting up Authorization header and other HTTP config options
 *
 * NOTES
 * - using axios directly rather than HttpService
 *   - Even using common.forwardRef didn't seem to make it possible
 *   - https://docs.nestjs.com/fundamentals/circular-dependency
 *   - as axios is already installed, there is no harm in using it really
 *
 * TODO
 * - [ ] test whether or not the non-DI inclusion of errorFactory behaves as expected
 * - [ ] cache token
 */

@Injectable()
export class SalesforceApiHttpConfigService
  implements HttpModuleOptionsFactory
{
  private logger: LoggableLogger;
  private errorFactory: ErrorFactory;
  private authURL: string;
  private baseURL: string;

  constructor() {
    this.errorFactory = new SalesforceApiRepositoryErrorFactory();
    this.logger = new LoggableLogger(SalesforceApiHttpConfigService.name);
    this.authURL = `${process.env.SALESFORCE_URL_AUTH}/services/oauth2/token`;
    this.baseURL = `${process.env.SALESFORCE_URL_DATA}/${process.env.SALESFORCE_URL_DATA_VERSION}/`;
  }
  async createHttpOptions(): Promise<HttpModuleOptions> {
    const token = await executeTask(this.token());
    return {
      baseURL: this.baseURL,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }

  // UP TO
  // test authentication here
  // remove it from the other locations

  /**
   * TODO - Implement caching of token
   * Create a ternary or similar and look for cache first
   */
  private token(): TE.TaskEither<Error, string> {
    return pipe(
      this.tokenFromSource(),
      logAction(
        this.logger,
        this.errorFactory,
        'Token retrieved',
        'Token retrieval failed'
      )
    );
  }

  private tokenFromSource(): TE.TaskEither<Error, string> {
    return TE.tryCatch(
      async () => {
        const body = new URLSearchParams({
          grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
          assertion: this.prepareJwt(),
        });
        const response = await axios.post<SalesforceApiResponseAuth>(
          this.authURL,
          body
        );
        if (response.data?.access_token === undefined) {
          // this will be caught (below), and passed through ErrorFactory
          throw new Error('No access token returned');
        }
        return response.data.access_token;
      },
      (error: Error) =>
        this.errorFactory.error(error, 'RepositoryAuthenticationError')
    );
  }

  private prepareJwt(): string {
    return jwt.sign(
      {
        iss: process.env.SALESFORCE_CONSUMER_KEY,
        sub: process.env.SALESFORCE_USER,
        aud: process.env.SALESFORCE_URL_AUTH,
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

  public testBreakAuth(): void {
    this.authURL = `${process.env.SALESFORCE_URL_AUTH}/something/completely/wrong`;
  }

  /**
   * Supposed to test a broken connection
   *
   * TODO: get working
   */
  public testBreakConnection(): void {
    this.baseURL = `http://not-salesforce-at-ll.com.au/v1000/`;
  }
}
