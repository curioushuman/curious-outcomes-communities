import { ConflictException } from '@nestjs/common';
import { pipe } from 'fp-ts/lib/function';
import * as O from 'fp-ts/lib/Option';

/**
 * Common domain error, when item already exists in local repo
 *
 * Error manifested as exception
 * to be caught by Nest and returned
 * as HTTP exception
 */
export class ItemConflictError extends ConflictException {
  constructor(postscript?: string) {
    super(ItemConflictError.initMessage(postscript));
  }

  public static initMessage(postscript: string): string {
    const baseMessage = ItemConflictError.baseMessage();
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
    return 'Item already exists';
  }
}
