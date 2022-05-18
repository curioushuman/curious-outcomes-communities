import { BadRequestException, Controller, Get, Param } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/function';
import * as E from 'fp-ts/lib/Either';

import { LoggableLogger } from '@curioushuman/loggable';

import { GetContactQuery } from '../application/queries/get-contact/get-contact.query';
import { executeTask } from '../../../shared/utils/execute-task';
import { GetContactRequestDto } from './dto/get-contact.request.dto';
import { GetContactMapper } from '../application/queries/get-contact/get-contact.mapper';
import { ContactResponseDto } from './dto/contact.response.dto';
import { GetContactQueryDto } from '../application/queries/get-contact/get-contact.query.dto';

@Controller('contacts')
export class ContactsController {
  constructor(
    private logger: LoggableLogger,
    private readonly queryBus: QueryBus
  ) {
    this.logger.setContext('ContactsController');
  }

  @Get(':slug')
  async getOne(
    @Param() params: GetContactRequestDto
  ): Promise<ContactResponseDto> {
    const task = pipe(
      params,
      this.checkRequest,
      TE.fromEither,
      TE.chain((queryDto) =>
        TE.tryCatch(
          async () => {
            const query = new GetContactQuery(queryDto);
            return await this.queryBus.execute<GetContactQuery>(query);
          },
          (error: Error) => error as Error
        )
      ),
      TE.chain((contact) => TE.right(GetContactMapper.toResponseDto(contact)))
    );

    return executeTask(task);
  }

  checkRequest(
    params: GetContactRequestDto
  ): E.Either<Error, GetContactQueryDto> {
    return E.tryCatch(
      () => {
        return pipe(
          params,
          GetContactRequestDto.check,
          GetContactMapper.toQueryDto
        );
      },
      (error: Error) => new BadRequestException(error.toString())
    );
  }
}
