import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';

import { Bootstrap } from '../../../bootstrap/bootstrap';
import { AppModule } from '../../../app/app.module';
import { ContactBuilder } from './data-builders/contact.builder';
import { GetContactRequestDtoBuilder } from './data-builders/contact-request.builder';
import { Contact } from '../domain/entities/contact';

/**
 * E2E testing might look similar to more localised integration tests
 * However it should also include aspects such as:
 * - authentication/authorisation/access
 *
 * * NOTE: these often fail due to timeout the first time you run skaffold dev
 * * If you make an additional minor change they'll run again and pass (grrr)
 */

jest.setTimeout(10000);

describe('[E2E] ContactsModule', () => {
  let app: INestApplication;
  // disabling no-explicit-any for testing purposes
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let httpServer: any;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    Bootstrap.useGlobalSettings(app);
    await app.init();
    httpServer = app.getHttpServer();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Given a specific Contact is being requested', () => {
    let response: request.Response;
    let contact: Contact;

    describe('When that Contact exists, and the request is valid', () => {
      describe('Pikachu definitely exists, and everyone knows how to spell it', () => {
        beforeAll(async () => {
          contact = ContactBuilder().build();
          response = await request(httpServer).get(
            `/api/contacts/${contact.slug}`
          );
        });
        test('Then response status should be 200', () => {
          expect(response.status).toBe(200);
        });

        test('And Pikachu is returned', () => {
          expect(response.body.name).toEqual(contact.slug);
        });

        test.todo('And the request/response is logged');
      });
      describe("Farfetch'd is a bit tricky, but savvy ppl remove the apostrophe", () => {
        beforeAll(async () => {
          contact = ContactBuilder().withApostrophe().build();
          response = await request(httpServer).get(
            `/api/contacts/${contact.slug}`
          );
        });
        test('Then response status should be 200', () => {
          expect(response.status).toBe(200);
        });
      });
    });

    describe('When that Contact does not exist e.g. Furfligarbabard', () => {
      beforeAll(async () => {
        const dto = GetContactRequestDtoBuilder().doesntExist().build();
        response = await request(httpServer).get(`/api/contacts/${dto.slug}`);
      });
      test('Then response status should be 404 (not found)', () => {
        expect(response.status).toBe(404);
      });

      test.todo('And the request/response is logged');
    });

    describe('When that Contact exists, but the request is invalid', () => {
      describe("Farfetch'd, but they forgot to remove the apostrophe", () => {
        beforeAll(async () => {
          contact = ContactBuilder().withApostrophe().build();
          const dto = GetContactRequestDtoBuilder().withApostrophe().build();
          response = await request(httpServer).get(`/api/contacts/${dto.slug}`);
        });
        test('Then response status should STILL BE 200 (as we tidy the slug for them)', () => {
          expect(response.status).toBe(200);
        });
        test("And Farfetch'd is returned", () => {
          expect(response.body.name).toEqual(contact.slug);
        });
        test.todo('And the request/response is logged');
      });
    });
  });
});
