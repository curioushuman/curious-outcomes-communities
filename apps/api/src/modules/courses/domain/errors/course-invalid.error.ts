import { BadRequestException } from '@nestjs/common';
import { pipe } from 'fp-ts/lib/function';
import * as O from 'fp-ts/lib/Option';

/**
 * Course domain error
 * Occurs when course returned from source is invalid
 * Error manifested as exception
 * to be caught by Nest and returned
 * as HTTP exception
 */
export class CourseInvalidError extends BadRequestException {
  constructor(reason?: string) {
    super(CourseInvalidError.initMessage(reason));
  }

  public static initMessage(reason: string): string {
    const baseMessage = CourseInvalidError.baseMessage();
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
    return 'Course is invalid';
  }
}
