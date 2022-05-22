import { BadRequestException } from '@nestjs/common';
import { pipe } from 'fp-ts/lib/function';
import * as O from 'fp-ts/lib/Option';

/**
 * Error manifested as exception
 */
export class RequestInvalidError extends BadRequestException {
  constructor(reason?: string) {
    const defaultMessage = 'Request is invalid';
    const message = pipe(
      reason,
      O.fromNullable,
      O.fold(
        () => defaultMessage,
        (r) => {
          return `${defaultMessage}: ${r}`;
        }
      )
    );
    super(message);
  }
}
