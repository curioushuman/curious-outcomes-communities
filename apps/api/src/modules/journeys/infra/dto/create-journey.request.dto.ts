import { Optional, Record, Static, String } from 'runtypes';

/**
 * This is the form of data we expect as input into our API/Request
 */

export const CreateJourneyRequestDto = Record({
  name: String,
  description: Optional(String),
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
