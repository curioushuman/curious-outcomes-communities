import { InternalServerErrorException } from '@nestjs/common';
import { pipe } from 'fp-ts/lib/function';
import * as O from 'fp-ts/lib/Option';

/**
 * Common domain error, when item returned from source is invalid
 *
 * Error manifested as exception
 * to be caught by Nest and returned
 * as HTTP exception
 */
export class SourceInvalidError extends InternalServerErrorException {
  constructor(message?: string) {
    super(SourceInvalidError.initMessage(message));
  }

  public static initMessage(message: string): string {
    const baseMessage = SourceInvalidError.baseMessage();
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
    return 'Course is invalid';
  }
}
