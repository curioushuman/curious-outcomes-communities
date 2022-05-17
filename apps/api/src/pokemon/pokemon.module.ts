import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { HttpModule } from '@nestjs/axios';

import { LoggableModule } from '@curioushuman/loggable';

import { PokemonController } from './infra/pokemon.controller';
import { GetPokemonHandler } from './application/queries/get-pokemon/get-pokemon.query';
import { PokemonRepository } from './adapter/ports/pokemon.repository';
import { PokeApiPokemonRepository } from './adapter/implementations/poke-api/poke-api.pokemon.repository';

// const commandHandlers = [];
const queryHandlers = [GetPokemonHandler];

const repositories = [
  {
    provide: PokemonRepository,
    useClass: PokeApiPokemonRepository,
  },
];

@Module({
  imports: [CqrsModule, HttpModule, LoggableModule],
  controllers: [PokemonController],
  providers: [...queryHandlers, ...repositories],
  exports: [],
})
export class PokemonModule {}
