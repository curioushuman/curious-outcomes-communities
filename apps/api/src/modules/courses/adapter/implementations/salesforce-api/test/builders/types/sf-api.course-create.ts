import { Optional, Record, Static, String } from 'runtypes';

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
