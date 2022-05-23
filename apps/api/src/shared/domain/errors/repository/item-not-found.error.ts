import { NotFoundException } from '@nestjs/common';
import { pipe } from 'fp-ts/lib/function';
import * as O from 'fp-ts/lib/Option';

/**
 * Error manifested as exception
 */
export class RepositoryItemNotFoundError extends NotFoundException {
  constructor(reason?: string) {
    super(RepositoryItemNotFoundError.initMessage(reason));
  }

  public static initMessage(reason: string): string {
    const baseMessage = RepositoryItemNotFoundError.baseMessage();
    return pipe(
      reason,
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
