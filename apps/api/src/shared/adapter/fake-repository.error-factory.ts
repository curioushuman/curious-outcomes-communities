import { HttpException } from '@nestjs/common';
import { ErrorFactory } from '../domain/errors/error-factory';

export class FakeRepositoryErrorFactory extends ErrorFactory {
  public errorStatusCode(error: HttpException): number {
    return error.getStatus();
  }
}
