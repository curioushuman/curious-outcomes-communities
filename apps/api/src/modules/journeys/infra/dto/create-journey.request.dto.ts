import { Record, Static, String } from 'runtypes';

/**
 * This is the form of data we expect as input into our API/Request
 */

export const CreateJourneyRequestDto = Record({
  name: String,
});

export type CreateJourneyRequestDto = Static<typeof CreateJourneyRequestDto>;
