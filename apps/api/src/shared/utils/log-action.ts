import { LoggerService } from '@nestjs/common';
import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/function';

/**
 * Standardized way to log an action; good or bad.
 *
 * Full credit to VincentJouanne
 * - https://github.com/VincentJouanne/nest-clean-architecture
 */

export const logAction =
  <ErrorLike extends Error, DataLike>(
    logger: LoggerService,
    successMessage: string,
    warningMessage: string
  ) =>
  (
    task: TE.TaskEither<ErrorLike, DataLike>
  ): TE.TaskEither<ErrorLike, DataLike> => {
    return pipe(
      task,
      TE.mapLeft((error: ErrorLike) => {
        logger.warn(warningMessage);
        logger.warn(error.constructor.name);
        logger.debug ? logger.debug(error) : logger.error(error);
        return error;
      }),
      TE.map((data: DataLike) => {
        logger.debug
          ? logger.debug(successMessage)
          : logger.log(successMessage);
        logger.verbose ? logger.verbose(data) : logger.log(data);
        return data;
      })
    );
  };
