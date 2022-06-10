import { Array, Null, Optional, Record, Static, String } from 'runtypes';
import { ExternalId } from '../../../../domain/value-objects/external-id';
import { SalesforceApiResponseRecord } from './sf-api.response';

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
  Id: ExternalId,
  Summary_quick_year__c: String,
  Slug__c: String,
  CO_course_ID__c: Optional(String.Or(Null)),
  Date_start__c: Optional(String.Or(Null)),
  Date_end__c: Optional(String.Or(Null)),
});

/**
 * We use this list in our queries and requests
 * TODO: make this dynamic, from the above
 */
export const salesforceApiCourseSourceFields = [
  'Id',
  'Summary_quick_year__c',
  'Slug__c',
  'CO_course_ID__c',
  'Date_start__c',
  'Date_end__c',
];

export type SalesforceApiCourseSource = Static<
  typeof SalesforceApiCourseSource
>;

export const SalesforceApiCourseSources = Record({
  records: Array(SalesforceApiCourseSource),
});

export type SalesforceApiCourseSources = Static<
  typeof SalesforceApiCourseSources
>;

/**
 * We use the below for testing only
 * Currently we don't support the creation of new records in Salesforce
 *
 * NOTE: this is the min. num of fields required to create a record
 */
export const SalesforceApiCourseSourceCreate = Record({
  Subject: String,
  Status: String,
  Type: String,
  Type_sub__c: String,
  Case_Year__c: String,
  RecordTypeId: String,
  CO_course_ID__c: Optional(String),
});

export type SalesforceApiCourseSourceCreate = Static<
  typeof SalesforceApiCourseSourceCreate
>;
