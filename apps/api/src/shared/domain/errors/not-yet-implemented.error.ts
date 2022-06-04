import { NotImplementedException } from '@nestjs/common';
import { pipe } from 'fp-ts/lib/function';
import * as O from 'fp-ts/lib/Option';

/**
 * Common domain error
 * Occurs when use requests a service that is on our roadmap
 * Error manifested as exception
 * to be caught by Nest and returned
 * as HTTP exception
 */
export class NotYetImplementedError extends NotImplementedException {
  constructor(message?: string) {
    super(NotYetImplementedError.initMessage(message));
  }

  public static initMessage(message: string): string {
    const baseMessage = NotYetImplementedError.baseMessage();
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
    return 'This service is not yet available, please try again later';
  }
}
