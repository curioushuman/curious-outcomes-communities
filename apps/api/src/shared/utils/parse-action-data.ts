import { LoggerService } from '@nestjs/common';
import * as E from 'fp-ts/lib/Either';
import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/function';

import { logParse } from './log-parse';
import { AllowedErrorTypeName } from '../domain/errors/validation.error-factory';

/**
 * Standardized way to parse data, and bring it into a TE flow.
 *
 * Full credit to VincentJouanne
 * - https://github.com/VincentJouanne/nest-clean-architecture
 *
 * TODO
 * - [ ] accept array of parsers as well as a single parser
 */

export const parseActionData =
  <InputLike, OutputLike, ErrorLike extends Error>(
    parser: (data: InputLike) => OutputLike,
    logger: LoggerService,
    asErrorType?: AllowedErrorTypeName
  ) =>
  (data: InputLike): TE.TaskEither<ErrorLike, OutputLike> => {
    // Our current validation methods throw exceptions, so we need to handle them
    const tryParse = E.tryCatch<ErrorLike, OutputLike>(
      () => {
        return parser(data);
      },
      (error: ErrorLike) => error as ErrorLike
    );
    return pipe(tryParse, TE.fromEither, logParse(logger, asErrorType));
  };
