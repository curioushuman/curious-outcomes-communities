import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { TaskEither, tryCatch } from 'fp-ts/lib/TaskEither';

import { Contact } from '../../../domain/entities/contact';
import { ContactRepository } from '../../ports/contact.repository';
import { ContactBuilder } from '../../../test/data-builders/contact.builder';

@Injectable()
export class FakeContactRepository implements ContactRepository {
  private contacts: Contact[] = [];

  constructor() {
    this.contacts.push(ContactBuilder().build());
    this.contacts.push(ContactBuilder().withDash().build());
    this.contacts.push(ContactBuilder().withApostrophe().build());
  }

  public findOne(slug: string): TaskEither<Error, Contact> {
    return tryCatch(
      async () => {
        return this.contacts.find((contacts) => contacts.slug === slug);
      },
      (reason: unknown) => new InternalServerErrorException(reason)
    );
  }
}
