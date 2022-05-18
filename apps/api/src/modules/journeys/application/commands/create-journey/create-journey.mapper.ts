import { CreateJourneyDto } from './create-journey.dto';
import { CreateJourneyRequestDto } from '../../../infra/dto/create-journey.request.dto';
import { createSlug } from '../../../domain/value-objects/slug';

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
}
