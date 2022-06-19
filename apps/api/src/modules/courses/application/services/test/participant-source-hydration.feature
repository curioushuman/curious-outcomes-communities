Feature: Hydrate Participant Source

Scenario: Successfully hydrate a Participant Source
  Given I have a valid Participant Source
  And a course exists that relates to the externalCourseId
  When I attempt to hydrate
  Then a hydrated Participant Source should be returned
  And it should include a courseId related to externalCourseId
