import { Injectable } from '@nestjs/common';
import { ErrorFactory } from '../../../../../shared/domain/errors/error-factory';

interface SalesforceApiRepositoryErrorDataObject {
  error?: string;
  error_description?: string;
  message?: string;
}

type SalesforceApiRepositoryErrorDataArray =
  SalesforceApiRepositoryErrorDataObject[];

type SalesforceApiRepositoryErrorData =
  | SalesforceApiRepositoryErrorDataObject
  | SalesforceApiRepositoryErrorDataArray;

interface SalesforceApiRepositoryError extends Error {
  response?: {
    status: number;
    statusText: string;
    data: SalesforceApiRepositoryErrorData;
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
      : this.errorDescriptionFromData(error);
  }

  public errorDescriptionFromData(error: SalesforceApiRepositoryError): string {
    const description = Array.isArray(error.response.data)
      ? error.response.data.map((d) => d.message).join('\n')
      : error.response.data.error_description;
    this.logger.debug(description);
    return description;
  }
}
