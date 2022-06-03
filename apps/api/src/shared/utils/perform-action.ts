import { LoggerService } from '@nestjs/common';
import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/function';

import { logAction } from './log-action';

/**
 * Standardized way to perform an action and log the result.
 *
 * Full credit to VincentJouanne
 * - https://github.com/VincentJouanne/nest-clean-architecture
 */

export const performAction = <InputLike, OutputLike, ErrorLike extends Error>(
  data: InputLike,
  action: (data: InputLike) => TE.TaskEither<ErrorLike, OutputLike>,
  logger: LoggerService,
  actionDescription: string
): TE.TaskEither<ErrorLike, OutputLike> => {
  return pipe(
    TE.right(data),
    TE.chain(action),
    logAction(
      logger,
      `Successfully managed to ${actionDescription}`,
      `Failed to ${actionDescription}`
    )
  );
};
