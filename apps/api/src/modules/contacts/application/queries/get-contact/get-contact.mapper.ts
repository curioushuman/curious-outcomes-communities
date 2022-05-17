import { GetContactQueryDto } from './get-contact.query.dto';
import { GetContactRequestDto } from '../../../infra/dto/get-contact.request.dto';
import { createSlug } from '../../../domain/value-objects/slug';
import { Contact } from '../../../domain/entities/contact';
import { ContactResponseDto } from '../../../infra/dto/contact.response.dto';

/**
 * TODO
 * - create base abstract class for mappers
 */
export class GetContactMapper {
  public static toQueryDto(dto: GetContactRequestDto): GetContactQueryDto {
    return GetContactQueryDto.check({
      slug: createSlug(dto.slug),
    });
  }
  public static toResponseDto(contact: Contact): ContactResponseDto {
    return {
      name: contact.name,
      slug: contact.slug,
    };
  }
}
