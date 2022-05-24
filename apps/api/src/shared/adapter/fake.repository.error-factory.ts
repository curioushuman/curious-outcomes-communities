import { HttpException, Injectable } from '@nestjs/common';
import { ErrorFactory } from '../domain/errors/error-factory';

@Injectable()
export class FakeRepositoryErrorFactory extends ErrorFactory {
  public errorStatusCode(error: HttpException): number {
    return error.getStatus();
  }
}
