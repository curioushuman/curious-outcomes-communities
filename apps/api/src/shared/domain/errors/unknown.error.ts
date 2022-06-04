import { InternalServerErrorException } from '@nestjs/common';
import { pipe } from 'fp-ts/lib/function';
import * as O from 'fp-ts/lib/Option';

/**
 * Unknown exception
 * Calling it out as unknown so we can track them,
 * and know them.
 *
 * TODO
 * - [ ] how to ensure all custom errors include the baseMessage method
 *       while retaining the extension of Nest-specific HTTP exceptions
 */
export class UnknownException extends InternalServerErrorException {
  constructor(message?: string) {
    super(UnknownException.initMessage(message));
  }

  public static initMessage(message: string): string {
    const baseMessage = UnknownException.baseMessage();
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
    return 'Unknown error occurred';
  }
}
