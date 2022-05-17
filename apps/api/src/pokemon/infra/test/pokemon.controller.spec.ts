import { Test, TestingModule } from '@nestjs/testing';
import { CqrsModule, QueryBus } from '@nestjs/cqrs';

import { LoggableLogger } from '@curioushuman/loggable';

import { PokemonController } from '../pokemon.controller';
import { PokemonResponseBuilder } from '../../test/data-builders/pokemon-response.builder';
import { GetPokemonRequestDtoBuilder } from '../../test/data-builders/pokemon-request.builder';
import { BadRequestException } from '@nestjs/common';

const queryBus = {
  execute: jest.fn().mockResolvedValue(PokemonResponseBuilder().build()),
};

describe('[Unit] PokemonController', () => {
  let controller: PokemonController;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule],
      controllers: [PokemonController],
      providers: [LoggableLogger, { provide: QueryBus, useValue: queryBus }],
    }).compile();

    controller = moduleRef.get<PokemonController>(PokemonController);
    jest.clearAllMocks();
  });

  describe('Given /:slug', () => {
    let executeSpy: jest.SpyInstance;

    describe('When the request is valid', () => {
      beforeEach(async () => {
        const params = {
          slug: GetPokemonRequestDtoBuilder().build().slug,
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
