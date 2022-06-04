import { ServiceUnavailableException } from '@nestjs/common';
import { pipe } from 'fp-ts/lib/function';
import * as O from 'fp-ts/lib/Option';

/**
 * Common domain error, issues accessing repo
 *
 * Error manifested as exception
 */
export class RepositoryServerUnavailableError extends ServiceUnavailableException {
  constructor(message?: string) {
    super(RepositoryServerUnavailableError.initMessage(message));
  }

  public static initMessage(message: string): string {
    const baseMessage = RepositoryServerUnavailableError.baseMessage();
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
