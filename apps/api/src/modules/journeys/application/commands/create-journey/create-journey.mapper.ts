import { CreateJourneyDto } from './create-journey.dto';
import { CreateJourneyRequestDto } from '../../../infra/dto/create-journey.request.dto';
import { createSlug } from '../../../domain/value-objects/slug';
import { Journey } from '../../../domain/entities/journey';

/**
 * TODO
 * - create base abstract class for mappers
 */
export class CreateJourneyMapper {
  public static toCommandDto(dto: CreateJourneyRequestDto): CreateJourneyDto {
    return CreateJourneyDto.check({
      name: dto.name,
      slug: createSlug(dto.name),
    });
  }

  public static toDomain(dto: CreateJourneyDto): Journey {
    return Journey.check({
      name: dto.name,
      slug: dto.slug,
    });
  }
}
