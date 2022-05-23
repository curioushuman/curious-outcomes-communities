import { RepositoryItemNotFoundError } from './repository/item-not-found.error';
import { UnknownException } from './unknown.error';

const errorMap = {
  404: RepositoryItemNotFoundError,
  0: UnknownException,
};
type errorKeys = keyof typeof errorMap;
type errorTypes = typeof errorMap[errorKeys];
type ExtractInstanceType<T> = T extends new () => infer R ? R : never;

export abstract class ErrorFactory {
  public error(error: Error): ExtractInstanceType<errorTypes> {
    const status = this.errorStatusCode(error);
    return new errorMap[status]();
  }

  abstract errorStatusCode(error: Error): number;
}
