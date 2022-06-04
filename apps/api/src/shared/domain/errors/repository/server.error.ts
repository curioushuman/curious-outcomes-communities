import { InternalServerErrorException } from '@nestjs/common';
import { pipe } from 'fp-ts/lib/function';
import * as O from 'fp-ts/lib/Option';

/**
 * Common domain error, issues accessing repo
 *
 * Error manifested as exception
 */
export class RepositoryServerError extends InternalServerErrorException {
  constructor(message?: string) {
    super(RepositoryServerError.initMessage(message));
  }

  public static initMessage(message: string): string {
    const baseMessage = RepositoryServerError.baseMessage();
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
    return 'Error accessing repository';
  }
}
