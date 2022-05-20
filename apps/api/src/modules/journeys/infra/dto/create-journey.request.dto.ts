import { Optional, Record, Static, String } from 'runtypes';

/**
 * This is the form of data we expect as input into our API/Request
 */

/**
 * TODO
 * - [ ] Remove externalId from the non-From-DTO
 *       This is a temp. fix for mapper.fromRequestDto
 */
export const CreateJourneyRequestDto = Record({
  name: String,
  description: Optional(String),
  externalId: Optional(String),
});

export type CreateJourneyRequestDto = Static<typeof CreateJourneyRequestDto>;

/**
 * This type extends from the base
 * But allows acceptance of whatever values are included
 * and allows the omission of any
 * based on the fact it NOW requires an externalId
 * which will be used to fill in the omissions
 * from a third party
 */
const fromRequestDto = Record({
  externalId: String,
});
export const CreateJourneyFromRequestDto = fromRequestDto.And(
  CreateJourneyRequestDto.asPartial()
);

export type CreateJourneyFromRequestDto = Static<
  typeof CreateJourneyFromRequestDto
>;

export type AnyCreateJourneyRequestDto =
  | CreateJourneyRequestDto
  | CreateJourneyFromRequestDto;
