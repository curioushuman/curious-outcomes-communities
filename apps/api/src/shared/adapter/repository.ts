import { ErrorFactory } from '../domain/errors/error-factory';

export abstract class Repository {
  abstract errorFactory: ErrorFactory;
}
