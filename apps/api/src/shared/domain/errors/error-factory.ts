import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { RepositoryItemNotFoundError } from './repository/item-not-found.error';
import { UnknownException } from './unknown.error';

const errorMap = {
  404: RepositoryItemNotFoundError,
  400: BadRequestException,
  500: InternalServerErrorException,
  0: UnknownException,
  1: Error,
};
type errorKeys = keyof typeof errorMap;
type errorTypes = typeof errorMap[errorKeys];
type ExtractInstanceType<T> = T extends new () => infer R ? R : never;

/**
 * TODO
 * - [ ] Replace BadRequestException with
 * - [ ] use a constructor, rather than setting error in newError
 *       NOTE: doing so resulted in some Nest dependency injection issues
 */
export abstract class ErrorFactory {
  public newError(error: Error): ExtractInstanceType<errorTypes> {
    return new errorMap[this.errorStatusCode(error)](
      this.errorDescription(error)
    );
    // return error as Error;
  }

  abstract errorStatusCode(error: Error): number;
  abstract errorDescription(error: Error): string;
}
