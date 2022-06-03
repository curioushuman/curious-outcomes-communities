import { Injectable } from '@nestjs/common';

import { SourceInvalidError } from './repository/source-invalid.error';
import { RequestInvalidError } from './request-invalid.error';
import { ErrorFactory } from './error-factory';

const allowedErrors = {
  RequestInvalidError,
  SourceInvalidError,
};
export type AllowedErrorTypeName = keyof typeof allowedErrors;

const errorMap = {
  400: RequestInvalidError,
};

@Injectable()
export class ValidationErrorFactory extends ErrorFactory<AllowedErrorTypeName> {
  constructor() {
    super(errorMap);
  }

  // we don't need the error status for this type of error
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public errorStatusCode(_: Error): number {
    return 400;
  }

  public errorDescription(error: Error): string {
    return error.toString();
  }
}
