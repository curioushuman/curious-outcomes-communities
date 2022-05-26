import { Array, Record, Static, String, Unknown } from 'runtypes';
import { SalesforceApiCourseSource } from './course-source';

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

export const SalesforceApiCourseSourceResponse = Record({
  records: Array(SalesforceApiCourseSource),
});

export type SalesforceApiCourseSourceResponse = Static<
  typeof SalesforceApiCourseSourceResponse
>;
