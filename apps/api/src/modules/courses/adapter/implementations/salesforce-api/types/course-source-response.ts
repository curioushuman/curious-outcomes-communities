import { Array, Record, Static, String } from 'runtypes';
import { SalesforceApiCourseSource } from './course-source';

export const SalesforceApiResponseAuth = Record({
  access_token: String,
});

export type SalesforceApiResponseAuth = Static<
  typeof SalesforceApiResponseAuth
>;

export const SalesforceApiCourseSourceResponse = Record({
  records: Array(SalesforceApiCourseSource),
});

export type SalesforceApiCourseSourceResponse = Static<
  typeof SalesforceApiCourseSourceResponse
>;
