import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { LoggableModule } from '@curioushuman/loggable';

import { ContactsController } from '../infra/contacts.controller';
import { GetContactHandler } from '../application/queries/get-contact/get-contact.query';
import { ContactRepository } from '../adapter/ports/contact.repository';
import { FakeContactRepository } from '../adapter/implementations/fake/fake.contact.repository';

const queryHandlers = [GetContactHandler];

const repositories = [
  {
    provide: ContactRepository,
    useClass: FakeContactRepository,
  },
];

@Module({
  imports: [CqrsModule, LoggableModule],
  controllers: [ContactsController],
  providers: [...queryHandlers, ...repositories],
  exports: [],
})
export class ContactsModule {}
