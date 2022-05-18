import { QueryHandler, IQueryHandler, IQuery } from '@nestjs/cqrs';
import { InternalServerErrorException } from '@nestjs/common';
import { tryCatch } from 'fp-ts/lib/TaskEither';
import { ValidationError } from 'runtypes';

import { ContactRepository } from '../../../adapter/ports/contact.repository';
import { executeTask } from '../../../../../shared/utils/execute-task';
import { GetContactQueryDto } from './get-contact.query.dto';
import { Contact } from '../../../domain/entities/contact';
import { Slug } from '../../../domain/value-objects/slug';

export class GetContactQuery implements IQuery {
  constructor(public readonly getContactQueryDto: GetContactQueryDto) {}
}

@QueryHandler(GetContactQuery)
export class GetContactHandler implements IQueryHandler<GetContactQuery> {
  constructor(private readonly contactRepository: ContactRepository) {}

  async execute(query: GetContactQuery): Promise<Contact> {
    const { getContactQueryDto } = query;

    // TODO: it is here you _might_ interpret different inputs
    // in the query DTO e.g. slug vs id

    const findOne = tryCatch(
      async () => {
        const slug = Slug.check(getContactQueryDto.slug);
        return await executeTask(this.contactRepository.findOne(slug));
      },
      (error: Error) => {
        if (error instanceof ValidationError) {
          return new InternalServerErrorException(
            `Invalid slug "${getContactQueryDto.slug})" supplied in GetContactHandler`
          );
        }
        return error as Error;
      }
    );
    return executeTask(findOne);
  }
}
