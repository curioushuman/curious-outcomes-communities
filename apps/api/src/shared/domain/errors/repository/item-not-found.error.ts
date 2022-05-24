import { NotFoundException } from '@nestjs/common';
import { pipe } from 'fp-ts/lib/function';
import * as O from 'fp-ts/lib/Option';

/**
 * Error manifested as exception
 */
export class RepositoryItemNotFoundError extends NotFoundException {
  constructor(postscript?: string) {
    super(RepositoryItemNotFoundError.initMessage(postscript));
  }

  public static initMessage(postscript: string): string {
    const baseMessage = RepositoryItemNotFoundError.baseMessage();
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
    return 'A source record could not be found';
  }
}
