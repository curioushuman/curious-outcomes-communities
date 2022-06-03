import { BadRequestException } from '@nestjs/common';
import { pipe } from 'fp-ts/lib/function';
import * as O from 'fp-ts/lib/Option';

/**
 * Common domain error
 * Occurs when request from use is invalid
 * Error manifested as exception
 * to be caught by Nest and returned
 * as HTTP exception
 */
export class RequestInvalidError extends BadRequestException {
  constructor(message?: string) {
    super(RequestInvalidError.initMessage(message));
  }

  public static initMessage(message: string): string {
    const baseMessage = RequestInvalidError.baseMessage();
    return pipe(
      message,
      O.fromNullable,
      O.fold(
        () => baseMessage,
        (r) => {
          return `${baseMessage}: ${r}`;
        }
      )
    );
  }

  public static baseMessage(): string {
    return 'Request is invalid';
  }
}
