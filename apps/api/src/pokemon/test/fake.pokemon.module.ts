import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { LoggableModule } from '@curioushuman/loggable';

import { PokemonController } from '../infra/pokemon.controller';
import { GetPokemonHandler } from '../application/queries/get-pokemon/get-pokemon.query';
import { PokemonRepository } from '../adapter/ports/pokemon.repository';
import { FakePokemonRepository } from '../adapter/implementations/fake/fake.pokemon.repository';

const queryHandlers = [GetPokemonHandler];

const repositories = [
  {
    provide: PokemonRepository,
    useClass: FakePokemonRepository,
  },
];

@Module({
  imports: [CqrsModule, LoggableModule],
  controllers: [PokemonController],
  providers: [...queryHandlers, ...repositories],
  exports: [],
})
export class PokemonModule {}
