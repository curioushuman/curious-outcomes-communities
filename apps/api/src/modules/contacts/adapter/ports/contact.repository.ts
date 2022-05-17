import { TaskEither } from 'fp-ts/lib/TaskEither';

import { Contact } from '../../domain/entities/contact';

export abstract class ContactRepository {
  abstract findOne(slug: string): TaskEither<Error, Contact>;
}
