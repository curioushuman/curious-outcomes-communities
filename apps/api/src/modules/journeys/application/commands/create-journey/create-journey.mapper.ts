import { CreateJourneyDto } from './create-journey.dto';
import { AnyCreateJourneyRequestDto } from '../../../infra/dto/create-journey.request.dto';
import { createSlug } from '../../../domain/value-objects/slug';
import { Journey } from '../../../domain/entities/journey';
import { JourneySource } from '../../../domain/entities/journey-source';

/**
 * TODO
 * - create base abstract class for mappers
 */
export class CreateJourneyMapper {
  public static fromRequestDto(
    dto: AnyCreateJourneyRequestDto
  ): CreateJourneyDto {
    const slug = dto.name ? createSlug(dto.name) : undefined;
    // NOTE: we DO NOT check the DTO here
    // This is handled in the command itself
    return {
      name: dto.name || undefined,
      slug,
      externalId: dto.externalId || undefined,
    } as CreateJourneyDto;
  }

  public static fromSource(journeySource: JourneySource): CreateJourneyDto {
    // NOTE: we DO NOT check the DTO here
    // This is handled in the command itself
    return {
      name: journeySource.name,
      slug: createSlug(journeySource.name),
      externalId: journeySource.id,
    } as CreateJourneyDto;
  }

  public static toDomain(dto: CreateJourneyDto): Journey {
    return Journey.check({
      name: dto.name,
      slug: dto.slug,
      externalId: dto.externalId || undefined,
    });
  }
}
