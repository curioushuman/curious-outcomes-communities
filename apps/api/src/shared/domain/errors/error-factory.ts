import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import { LoggableLogger } from '@curioushuman/loggable';

import { RepositoryAuthenticationError } from './repository/authentication.error';
import { RepositoryItemNotFoundError } from './repository/item-not-found.error';
import { UnknownException } from './unknown.error';

const errorMap = {
  400: BadRequestException,
  401: RepositoryAuthenticationError,
  404: RepositoryItemNotFoundError,
  500: InternalServerErrorException,
  0: UnknownException,
  1: typeof Error,
};
type errorKeys = keyof typeof errorMap;
type errorTypes = typeof errorMap[errorKeys];
type ExtractInstanceType<T> = T extends new () => infer R ? R : never;

/**
 * TODO
 * - [ ] Replace BadRequestException with something more specific
 * - [ ] use a constructor, rather than setting error in newError
 *       NOTE: doing so resulted in some Nest dependency injection issues
 */
@Injectable()
export abstract class ErrorFactory {
  constructor(protected logger: LoggableLogger) {
    this.logger.setContext('ErrorFactory');
  }

  public error(error: Error): Error {
    const err = this.isKnown(error) ? error : this.newError(error);
    this.logger.debug(err);
    return err;
  }

  public newError(error: Error): ExtractInstanceType<errorTypes> {
    return new errorMap[this.errorStatusCode(error)](
      this.errorDescription(error)
    );
  }

  public isKnown(error: Error): boolean {
    const knownError = Object.keys(errorMap).find(
      (k) => errorMap[k].name === error.name
    );
    return 'response' in error && 'status' in error && knownError !== undefined;
  }

  public errorAsString(error: Error): string {
    const status = this.errorStatusCode(error);
    const description = this.errorDescription(error);
    return `${status}: ${description}`;
  }

  abstract errorStatusCode(error: Error): number;
  abstract errorDescription(error: Error): string;
}
