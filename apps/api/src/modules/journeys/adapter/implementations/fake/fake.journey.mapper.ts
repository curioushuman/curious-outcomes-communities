import { Journey } from '../../../domain/entities/journey';
import { CreateJourneyDto } from '../../../application/commands/create-journey/create-journey.dto';

/**
 * TODO
 * - create base abstract class for mappers
 */
export class FakeJourneyMapper {
  public static toPersistence(dto: CreateJourneyDto): Journey {
    return Journey.check({
      name: dto.name,
      slug: dto.slug,
    });
  }
}
