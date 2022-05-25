import { Injectable, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as TE from 'fp-ts/lib/TaskEither';
import * as O from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/function';
import * as jwt from 'jsonwebtoken';

import { CourseSource } from '../../../domain/entities/course-source';
import { CourseSourceRepository } from '../../ports/course-source.repository';
import { CourseSourceBuilder } from '../../../test/stubs/course-source.stub';
import { FindCourseSourceDto } from '../../../application/queries/find-course-source/find-course-source.dto';
import { ErrorFactory } from '../../../../../shared/domain/errors/error-factory';

interface SalesforceApiResponseAuth {
  data: {
    access_token: string;
  };
}

@Injectable()
export class SalesforceApiCourseSourceRepository
  implements CourseSourceRepository
{
  private courseSources: CourseSource[] = [];

  constructor(
    private httpService: HttpService,
    private errorFactory: ErrorFactory
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
      (error: Error) => this.errorFactory.newError(error)
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
      (error: Error) => this.errorFactory.newError(error)
    );
  }

  /**
   * TODO
   * - [ ] return this error as RepoAuthError, rather than errorFactory
   *       use errorFactory to obtain the message though
   * - [ ] env variables somewhere better for dev
   * - [ ] env in sealed secrets for K8s
   * - [ ] store token somewhere
   */
  public authorise(): TE.TaskEither<Error, boolean> {
    return TE.tryCatch(
      async () => {
        const body = new URLSearchParams({
          grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
          assertion: this.prepareJwt(),
        });
        const request$ = this.httpService.post(
          `${this.tmpDomain}/services/oauth2/token`,
          body.toString()
        );
        const response: SalesforceApiResponseAuth = await firstValueFrom(
          request$
        );
        if (response.data?.access_token === undefined) {
          return false;
        }
        return true;
      },
      (error: Error) => this.errorFactory.newError(error)
    );
  }

  private prepareJwt(): string {
    // prettier-ignore
    const private_key = this.tmpCertKey.replace(/\\n/gm, "\n");
    return jwt.sign(
      {
        iss: this.tmpConsumerKey,
        sub: 'api@asiapacificforum.net.202206',
        aud: this.tmpDomain,
      },
      private_key,
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

  // private tmpDomain = 'https://login.salesforce.com';
  private tmpDomain = 'https://test.salesforce.com';

  private tmpCertKey = 'notRealSecret';
  private tmpConsumerKey = 'notRealKey';
}
