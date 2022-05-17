import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';

import { Bootstrap } from '../../../bootstrap/bootstrap';
import { Contact } from '../domain/entities/contact';
import { ContactBuilder } from './data-builders/contact.builder';
import { ContactsModule } from './fake.contacts.module';

/**
 * For local integration tests we just want to make sure
 * - endpoints behave how they should
 *
 * We ignore some of the additional elements such as:
 * - authentication/authorisation/access
 *
 * We use mocks/fakes to focus on the subject under test (SUT)
 *
 * TODO
 * - mimic e2e tests
 */

describe('[Integration] ContactsModule', () => {
  let app: INestApplication;
  // disabling no-explicit-any for testing purposes
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let httpServer: any;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ContactsModule],
    }).compile();

    app = moduleRef.createNestApplication();
    Bootstrap.useGlobalSettings(app);
    await app.init();
    httpServer = app.getHttpServer();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('When a Contact is requested', () => {
    let requestTest: request.Test;
    let contact: Contact;

    beforeAll(() => {
      contact = ContactBuilder().withDash().build();
      requestTest = request(httpServer).get(`/api/contacts/${contact.slug}`);
    });
    test('Then it should return a 200 response status', async () => {
      requestTest.expect(200);
    });

    test('And the correct Contact', async () => {
      requestTest.expect(contact);
    });
  });
});
