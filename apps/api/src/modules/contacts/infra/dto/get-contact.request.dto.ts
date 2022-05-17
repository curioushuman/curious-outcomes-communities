import { Record, Static, String } from 'runtypes';

/**
 * This is the form of data we expect as input into our API/Request
 */

export const GetContactRequestDto = Record({
  slug: String,
});

export type GetContactRequestDto = Static<typeof GetContactRequestDto>;
