import { Null, Optional, Static, String } from 'runtypes';
import { SalesforceApiResponseRecord } from './sf-api-response';

/**
 * TODO
 * - [ ] description
 */

/**
 * This represents data we expect from Salesforce
 * - some fields may be empty
 * - Salesforce generally loves to return them as Null
 */
export const SalesforceApiCourseSource = SalesforceApiResponseRecord.extend({
  Id: String,
  Summary_quick_year__c: String,
  Slug__c: String,
  Date_start__c: Optional(String.Or(Null)),
  Date_end__c: Optional(String.Or(Null)),
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
