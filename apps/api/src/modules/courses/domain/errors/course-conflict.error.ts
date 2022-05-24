import { ConflictException } from '@nestjs/common';
import { pipe } from 'fp-ts/lib/function';
import * as O from 'fp-ts/lib/Option';

/**
 * Course domain error
 * Occurs when course returned from source already exists in our DB
 * Error manifested as exception
 * to be caught by Nest and returned
 * as HTTP exception
 */
export class CourseConflictError extends ConflictException {
  constructor(postscript?: string) {
    super(CourseConflictError.initMessage(postscript));
  }

  public static initMessage(postscript: string): string {
    const baseMessage = CourseConflictError.baseMessage();
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
    return 'Course already exists';
  }
}
