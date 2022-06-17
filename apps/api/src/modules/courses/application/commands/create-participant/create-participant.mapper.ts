import { CreateParticipantRequestDto } from '../../../infra/dto/create-participant.request.dto';
// import { FindParticipantSourceDto } from '../../queries/find-participant-source/find-participant-source.dto';
import { ParticipantSource } from '../../../domain/entities/participant-source';
import { Participant } from '../../../domain/entities/participant';
import { createSlug } from '../../../../../shared/domain/value-objects/slug';
// import { FindParticipantDto } from '../../queries/find-participant/find-participant.dto';
import { createParticipantId } from '../../../domain/value-objects/participant-id';
import { CreateParticipantDto } from './create-participant.dto';

/**
 * TODO
 * - create base abstract class for mappers
 */
export class CreateParticipantMapper {
  public static fromRequestDto(
    dto: CreateParticipantRequestDto
  ): CreateParticipantDto {
    return CreateParticipantDto.check({
      externalId: dto.externalId,
    });
  }

  // public static toFindParticipantSourceDto(
  //   dto: CreateParticipantDto
  // ): FindParticipantSourceDto {
  //   return FindParticipantSourceDto.check({
  //     id: dto.externalId,
  //   });
  // }

  // /**
  //  * TODO
  //  * - [ ] move this to a better home
  //  */
  // public static fromSourceToParticipant(source: ParticipantSource): Participant {
  //   const id = source.participantId ? source.participantId : createParticipantId();
  //   const slug = source.slug ? source.slug : createSlug(source.name);
  //   return Participant.check({
  //     externalId: source.id,
  //     name: source.name,
  //     slug,
  //     id,
  //   });
  // }

  // public static fromSourceToFindParticipantDto(source: ParticipantSource): FindParticipantDto {
  //   return FindParticipantDto.check({
  //     externalId: source.id,
  //   });
  // }
}
