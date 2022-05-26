import { HttpModuleOptions, HttpModuleOptionsFactory } from '@nestjs/axios';
import axios from 'axios';
import { Injectable } from '@nestjs/common';
import * as TE from 'fp-ts/lib/TaskEither';
import * as jwt from 'jsonwebtoken';

import { executeTask } from '../../../../../shared/utils/execute-task';
import { SalesforceApiResponseAuth } from './types/course-source-response';
import { RepositoryAuthenticationError } from '../../../../../shared/domain/errors/repository/authentication.error';

/**
 * Setting up Authorization header and other HTTP config options
 *
 * NOTES
 * - using axios over HttpService
 *   - Even using common.forwardRef didn't seem to make it possible
 *   - https://docs.nestjs.com/fundamentals/circular-dependency
 *   - as axios is already installed, there is no harm in using it really
 *
 * TODO
 * - [ ] cache token
 */

@Injectable()
export class SalesforceApiHttpConfigService
  implements HttpModuleOptionsFactory
{
  async createHttpOptions(): Promise<HttpModuleOptions> {
    const token = await executeTask(this.token());
    const baseURL = `${process.env.SALESFORCE_DOMAIN_DATA}/${process.env.SALESFORCE_DOMAIN_DATA_VERSION}/`;
    return {
      baseURL,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }

  /**
   * Implement caching of token
   * Create a ternary or similar and look for cache first
   */
  public token(): TE.TaskEither<Error, string> {
    return this.tokenFromSource();
  }

  public tokenFromSource(): TE.TaskEither<Error, string> {
    const authUrl = `${process.env.SALESFORCE_DOMAIN_TOKEN}/services/oauth2/token`;
    return TE.tryCatch(
      async () => {
        const body = new URLSearchParams({
          grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
          assertion: this.prepareJwt(),
        });
        const response = await axios.post<SalesforceApiResponseAuth>(
          authUrl,
          body
        );
        if (response.data?.access_token === undefined) {
          throw new RepositoryAuthenticationError('No access token returned');
        }
        return response.data?.access_token;
      },
      (error: Error) =>
        new RepositoryAuthenticationError(
          `Error retrieving access token; ${error.toString()}`
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
}
