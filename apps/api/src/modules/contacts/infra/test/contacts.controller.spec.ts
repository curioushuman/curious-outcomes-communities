import { Test, TestingModule } from '@nestjs/testing';
import { CqrsModule, QueryBus } from '@nestjs/cqrs';
import { BadRequestException } from '@nestjs/common';

import { LoggableLogger } from '@curioushuman/loggable';

import { ContactsController } from '../contacts.controller';
import { ContactResponseBuilder } from '../../test/data-builders/contact-response.builder';
import { GetContactRequestDtoBuilder } from '../../test/data-builders/contact-request.builder';

const queryBus = {
  execute: jest.fn().mockResolvedValue(ContactResponseBuilder().build()),
};

describe('[Unit] ContactsController', () => {
  let controller: ContactsController;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule],
      controllers: [ContactsController],
      providers: [LoggableLogger, { provide: QueryBus, useValue: queryBus }],
    }).compile();

    controller = moduleRef.get<ContactsController>(ContactsController);
    jest.clearAllMocks();
  });

  describe('Given /:slug', () => {
    let executeSpy: jest.SpyInstance;

    describe('When the request is valid', () => {
      beforeEach(async () => {
        const params = {
          slug: GetContactRequestDtoBuilder().build().slug,
        };
        executeSpy = jest.spyOn(queryBus, 'execute');
        await controller.getOne(params);
      });

      test('Then it should call the query, via the queryBus', async () => {
        expect(executeSpy).toHaveBeenCalled();
      });
    });

    describe('When the request is invalid', () => {
      describe('i.e. slug exists, but is empty', () => {
        test('Then it should return a 400 (Bad Request) error', async () => {
          const params = {
            slug: '',
          };
          try {
            await controller.getOne(params);
          } catch (e) {
            expect(e instanceof BadRequestException).toBeTruthy();
          }
        });
      });
    });
  });
});
