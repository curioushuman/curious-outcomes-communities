// import { BadRequestException } from '@nestjs/common';
// import * as TE from 'fp-ts/lib/TaskEither';
import * as O from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/function';

import { CreateJourneyDto } from './create-journey.dto';
import {
  AnyCreateJourneyRequestDto,
  CreateJourneyFromRequestDto,
  CreateJourneyRequestDto,
} from '../../../infra/dto/create-journey.request.dto';
import { createSlug } from '../../../domain/value-objects/slug';
import { Journey } from '../../../domain/entities/journey';
import { JourneySource } from '../../../domain/entities/journey-source';
// import { Id } from '../../../domain/value-objects/Id';
import { FindJourneySourceDto } from '../../queries/find-journey-source/find-journey-source.dto';

/**
 * TODO
 * - create base abstract class for mappers
 */
export class CreateJourneyMapper {
  /**
   * TODO - split this into two functions
   * - Validate/check & map using their unique DTOs
   */
  public static fromRequestDtoNoCheck(
    dto: AnyCreateJourneyRequestDto
  ): CreateJourneyDto {
    const slug = dto.name ? createSlug(dto.name) : undefined;
    return {
      name: dto.name || undefined,
      slug,
      externalId: dto.externalId || undefined,
    } as CreateJourneyDto;
  }

  public static fromRequestDto(dto: CreateJourneyRequestDto): CreateJourneyDto {
    return CreateJourneyDto.check(
      CreateJourneyMapper.fromRequestDtoNoCheck(dto)
    );
  }

  public static fromFromRequestDto(
    dto: CreateJourneyFromRequestDto
  ): CreateJourneyDto {
    const createJourneyDto = CreateJourneyMapper.fromRequestDtoNoCheck(dto);
    // it is here we should check for externalId
    // BUT this should really be handled as part of the DTO, not here
    // AND it actually is reliant on what the find-journey-source.dto will accept
    // SO, let's wait until we've properly done our stories and acceptance tests
    return createJourneyDto;
  }

  public static fromSource(journeySource: JourneySource): CreateJourneyDto {
    return CreateJourneyDto.check({
      name: journeySource.name,
      slug: createSlug(journeySource.name),
      externalId: journeySource.id,
    });
  }

  public static toDomain(dto: CreateJourneyDto): Journey {
    return Journey.check({
      name: dto.name,
      slug: dto.slug,
      externalId: dto.externalId || undefined,
    });
  }

  /**
   * UP TO HERE
   * Are you over engineering?
   * Shall we stop here and wait until we've gone back to first principles?
   */
  // public static toFindSource(dto: CreateJourneyDto): FindJourneySourceDto {
  //   return Journey.check({
  //     name: dto.name,
  //     slug: dto.slug,
  //     externalId: dto.externalId || undefined,
  //   });
  // }

  /**
   * UPTO
   * I think even this you might have to wait
   * I'm conflicted...
   * - Is it attempting to do too much?
   * - does it break the convention of the other methods of this class?
   */
  // public static toFindSourceDtoAsTE(
  //   dto: CreateJourneyDto
  // ): TE.TaskEither<BadRequestException, FindJourneySourceDto> {
  //   return pipe(
  //     dto,
  //     O.fromNullable,
  //     O.map(({ externalId }) => externalId),
  //     TE.fromOption(() => new BadRequestException('No externalId'))
  //   );
  // }
}
