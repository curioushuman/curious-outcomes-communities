import { HttpException, Injectable } from '@nestjs/common';
import { ErrorFactory } from '../../../../../shared/domain/errors/error-factory';

@Injectable()
export class SalesforceApiRepositoryErrorFactory extends ErrorFactory {
  public errorStatusCode(error: HttpException): number {
    return error.getStatus();
  }
}
