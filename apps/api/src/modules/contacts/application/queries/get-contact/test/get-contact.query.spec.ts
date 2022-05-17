import { Test, TestingModule } from '@nestjs/testing';

import { GetContactQuery, GetContactHandler } from '../get-contact.query';
import { ContactRepository } from '../../../../adapter/ports/contact.repository';
import { FakeContactRepository } from '../../../../adapter/implementations/fake/fake.contact.repository';
import { ContactBuilder } from '../../../../test/data-builders/contact.builder';

/**
 * Use Case tests
 *
 * Notes
 * - it is here, you might test other things that occur _around_ each query or command
 *   - e.g. after post-command events are fired
 * - use mocks/spies to focus just on the subject under test (SUT)
 *   - e.g. you can mock/spy on other commands just to make sure they receive the event
 */

describe('[Unit] Get Contact Query', () => {
  let handler: GetContactHandler;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        GetContactHandler,
        { provide: ContactRepository, useClass: FakeContactRepository },
      ],
    }).compile();

    handler = moduleRef.get<GetContactHandler>(GetContactHandler);
  });

  describe('When ALL input is valid', () => {
    test('Then it should return a contact', async () => {
      const contact = ContactBuilder().withDash().build();
      const getContactQueryDto = {
        slug: contact.slug,
      };

      const result = await handler.execute(
        new GetContactQuery(getContactQueryDto)
      );

      expect(result).toStrictEqual(contact);
    });
  });

  describe('When input is INVALID', () => {
    test('Then it should throw 500 error', async () => {
      try {
        const getContactQueryDto = {
          slug: '',
        };
        // Turning off type checking so we make sure we test what would happen
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const getContactQuery = new GetContactQuery(getContactQueryDto);
        await handler.execute(getContactQuery);
      } catch (err) {
        expect(err).toBeDefined();
        expect(err.status).toBe(500);
      }
    });
  });
});
