import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { HttpModule } from '@nestjs/axios';

import { LoggableModule } from '@curioushuman/loggable';

import { ContactsController } from './infra/contacts.controller';
import { GetContactHandler } from './application/queries/get-contact/get-contact.query';
import { ContactRepository } from './adapter/ports/contact.repository';
import { SalesforceApiContactRepository } from './adapter/implementations/salesforce-api/salesforce-api.contact.repository';

// const commandHandlers = [];
const queryHandlers = [GetContactHandler];

const repositories = [
  {
    provide: ContactRepository,
    useClass: SalesforceApiContactRepository,
  },
];

@Module({
  imports: [CqrsModule, HttpModule, LoggableModule],
  controllers: [ContactsController],
  providers: [...queryHandlers, ...repositories],
  exports: [],
})
export class ContactsModule {}
