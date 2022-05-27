import { Record, Static, String, Unknown } from 'runtypes';

export const SalesforceApiResponseAuth = Record({
  access_token: String,
});

export type SalesforceApiResponseAuth = Static<
  typeof SalesforceApiResponseAuth
>;

export const SalesforceApiResponseRecord = Record({
  attributes: Unknown,
});

export type SalesforceApiResponseRecord = Static<
  typeof SalesforceApiResponseRecord
>;