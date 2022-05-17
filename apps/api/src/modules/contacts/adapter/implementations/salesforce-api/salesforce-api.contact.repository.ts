import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { TaskEither, tryCatch } from 'fp-ts/lib/TaskEither';

import { Contact } from '../../../domain/entities/contact';
import { ContactRepository } from '../../ports/contact.repository';
import {
  SalesforceApiContactDto,
  SalesforceApiContactErrorDto,
} from './salesforce-api.contact.dto';
import { SalesforceApiContactMapper } from './salesforce-api.contact.mapper';

@Injectable()
export class SalesforceApiContactRepository extends ContactRepository {
  constructor(private httpService: HttpService) {
    super();
  }

  public livenessProbe(): TaskEither<Error, boolean> {
    return tryCatch(
      async () => {
        // TODO: extract this into a httpService wrapper or similar
        const request$ = this.httpService.get(
          `https://pokeapi.co/api/v2/language/en`
        );
        await firstValueFrom(request$);
        // if a value is received, without an error we're good
        return true;
      },
      (error: SalesforceApiContactErrorDto) => {
        // TODO: similarly could we centralise/standardise the error handling
        const { status, statusText } = error.response;
        return new InternalServerErrorException(
          `Error (${status} - ${statusText}) occurred during livenessProbe at SalesforceApi`
        );
      }
    );
  }

  public findOne(slug: string): TaskEither<Error, Contact> {
    return tryCatch(
      async () => {
        // Final empty slug check
        if (!slug) {
          throw new BadRequestException(
            'Empty slug supplied to findOne() in SalesforceApi'
          );
        }
        // TODO: extract this into a httpService wrapper or similar
        const contactsRequest$ = this.httpService.get<SalesforceApiContactDto>(
          `https://pokeapi.co/api/v2/pokemon/${slug}`
        );
        const response = await firstValueFrom(contactsRequest$);
        // maybe this included
        const salesforceApiContactDto = SalesforceApiContactDto.check(
          response.data
        );

        // could this similarly be in a serialisation decorator?
        return SalesforceApiContactMapper.toDomain(salesforceApiContactDto);
      },
      (error: SalesforceApiContactErrorDto) => {
        const { status, statusText } = error.response || {
          status: 0,
          statusText: 'Unknown',
        };
        // TODO: similarly could we centralise/standardise the error handling
        if (status === 404) {
          return new NotFoundException(
            `${slug} could not be found via findOne() in SalesforceApi`
          );
        }
        // TODO: is there a simpler way of just passing up the same error
        // e.g. 404, 400, etc if response.status exists
        return new InternalServerErrorException(
          `Error (${status} - ${statusText}) occurred for findOne(${slug}) in SalesforceApi`
        );
      }
    );
  }
}
