import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
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
export abstract class ErrorFactory {
  public error(error: Error): Error {
    // return error as Error;
    return this.isKnown(error) ? error : this.newError(error);
  }

  public newError(error: Error): ExtractInstanceType<errorTypes> {
    return new errorMap[this.errorStatusCode(error)](
      this.errorDescription(error)
    );
  }

  public isKnown(error: unknown): boolean {
    return Object.values(errorMap).includes(typeof error);
  }

  public errorAsString(error: Error): string {
    const status = this.errorStatusCode(error);
    const description = this.errorDescription(error);
    return `${status}: ${description}`;
  }

  abstract errorStatusCode(error: Error): number;
  abstract errorDescription(error: Error): string;
}
