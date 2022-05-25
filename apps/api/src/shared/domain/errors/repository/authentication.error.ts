import { UnauthorizedException } from '@nestjs/common';
import { pipe } from 'fp-ts/lib/function';
import * as O from 'fp-ts/lib/Option';

/**
 * Error manifested as exception
 */
export class RepositoryAuthenticationError extends UnauthorizedException {
  constructor(postscript?: string) {
    super(RepositoryAuthenticationError.initMessage(postscript));
  }

  public static initMessage(postscript: string): string {
    const baseMessage = RepositoryAuthenticationError.baseMessage();
    return pipe(
      postscript,
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
