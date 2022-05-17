import { BadRequestException, Controller, Get, Param } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/function';
import * as E from 'fp-ts/lib/Either';

import { LoggableLogger } from '@curioushuman/loggable';

import { GetPokemonQuery } from '../application/queries/get-pokemon/get-pokemon.query';
import { executeTask } from '../../shared/utils/execute-task';
import { GetPokemonRequestDto } from '../infra/dto/get-pokemon.request.dto';
import { GetPokemonMapper } from '../application/queries/get-pokemon/get-pokemon.mapper';
import { PokemonResponseDto } from '../infra/dto/pokemon.response.dto';
import { GetPokemonQueryDto } from '../application/queries/get-pokemon/get-pokemon.query.dto';

@Controller('pokemon')
export class PokemonController {
  constructor(
    private logger: LoggableLogger,
    private readonly queryBus: QueryBus
  ) {
    this.logger.setContext('PokemonController');
  }

  @Get(':slug')
  async getOne(
    @Param() params: GetPokemonRequestDto
  ): Promise<PokemonResponseDto> {
    const task = pipe(
      params,
      this.checkRequest,
      TE.fromEither,
      TE.chain((queryDto) =>
        TE.tryCatch(
          async () => {
            const query = new GetPokemonQuery(queryDto);
            return await this.queryBus.execute<GetPokemonQuery>(query);
          },
          (error: Error) => error as Error
        )
      ),
      TE.chain((pokemon) => TE.right(GetPokemonMapper.toResponseDto(pokemon)))
    );

    return executeTask(task);
  }

  checkRequest(
    params: GetPokemonRequestDto
  ): E.Either<Error, GetPokemonQueryDto> {
    return E.tryCatch(
      () => {
        return pipe(
          params,
          GetPokemonRequestDto.check,
          GetPokemonMapper.toQueryDto
        );
      },
      (error: Error) => new BadRequestException(error.toString())
    );
  }
}
