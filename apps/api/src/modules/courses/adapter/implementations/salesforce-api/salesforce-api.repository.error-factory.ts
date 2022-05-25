import { Injectable } from '@nestjs/common';
import { ErrorFactory } from '../../../../../shared/domain/errors/error-factory';

interface SalesforceApiRepositoryError extends Error {
  response?: {
    status: number;
    statusText: string;
    data: {
      error: string;
      error_description: string;
    };
  };
}

@Injectable()
export class SalesforceApiRepositoryErrorFactory extends ErrorFactory {
  public errorStatusCode(error: SalesforceApiRepositoryError): number {
    return error.response === undefined ? 500 : error.response.status;
  }

  public errorDescription(error: SalesforceApiRepositoryError): string {
    return error.response === undefined
      ? error.message
      : error.response.data.error_description;
  }
}
