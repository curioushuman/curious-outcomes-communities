import { UnauthorizedException } from '@nestjs/common';
import { pipe } from 'fp-ts/lib/function';
import * as O from 'fp-ts/lib/Option';

/**
 * Common domain error, issues authenticating with repo
 *
 * Error manifested as exception
 */
export class RepositoryAuthenticationError extends UnauthorizedException {
  constructor(message?: string) {
    super(RepositoryAuthenticationError.initMessage(message));
  }

  public static initMessage(message: string): string {
    const baseMessage = RepositoryAuthenticationError.baseMessage();
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
    return 'Error authenticating at repository';
  }
}
