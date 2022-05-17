import { Number, Record, Static, String } from 'runtypes';

/**
 * This is the form of the data we expect (and process) from the Salesforce API
 * The full API can be found within Salesforce docs
 * We can use this runtype to check the data we get from the API
 *
 * TODO
 * - Move the error types to a shared library
 *   - Or at least create a base class/interface
 */

export const SalesforceApiContactDto = Record({
  name: String,
});

export type SalesforceApiContactDto = Static<typeof SalesforceApiContactDto>;

export const SalesforceApiContactErrorResponseDto = Record({
  status: Number,
  statusText: String,
});
export type SalesforceApiContactErrorResponseDto = Static<
  typeof SalesforceApiContactErrorResponseDto
>;

export const SalesforceApiContactErrorDto = Record({
  response: SalesforceApiContactErrorResponseDto,
});
export type SalesforceApiContactErrorDto = Static<
  typeof SalesforceApiContactErrorDto
>;
