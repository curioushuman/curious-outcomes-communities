import { Optional, Record, Static, String } from 'runtypes';

/**
 * TODO
 * - [ ] description
 */

export const SalesforceApiCourseSource = Record({
  Id: String,
  Summary_quick_year__c: String,
  Slug__c: String,
  Date_start__c: Optional(String),
  Date_end__c: Optional(String),
});

export const salesforceApiCourseSourceFields = [
  'Id',
  'Summary_quick_year__c',
  'Slug__c',
  'Date_start__c',
  'Date_end__c',
];

export type SalesforceApiCourseSource = Static<
  typeof SalesforceApiCourseSource
>;
