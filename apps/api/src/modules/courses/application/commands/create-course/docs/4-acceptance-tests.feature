Feature: Create Course

Scenario: Successfully creating a course
  Given the request is valid
  And I am authorised to access the source
  And a matching record is found at the source
  And the returned source populates a valid course
  And the source does not already exist in our DB
  When I create a course
  Then a new record should have been created in the repository
  And no result is returned

Scenario: Fail; Invalid request
  Given the request contains invalid data
  When I attempt to create a course
  Then I should receive a RequestInvalidError
  And no result is returned

Scenario: Fail; Unable to authenticate with source repository
Given the request is valid
  And I am NOT authorised to access the source repository
  When I attempt to create a course
  Then I should receive a RepositoryAuthenticationError
  And no result is returned

Scenario: Fail; Source not found for ID provided
  Given the request is valid
  And I am authorised to access the source
  And no record exists that matches our request
  When I attempt to create a course
  Then I should receive a RepositoryItemNotFoundError
  And no result is returned

Scenario: Fail; Problems accessing source repository
  Given the request is valid
  And I am authorised to access the source
  And I have an issue accessing the source repository
  When I attempt to create a course
  Then I should receive a RepositoryServerError
  And no result is returned

Scenario: Fail; Source does not translate into a valid Course
  Given the request is valid
  And I am authorised to access the source
  And a matching record is found at the source
  And the returned source does not populate a valid Course
  When I attempt to create a course
  Then I should receive a CourseInvalidError
  And no result is returned

Scenario: Fail; Source already exists in our DB
  Given the request is valid
  And I am authorised to access the source
  And a matching record is found at the source
  And the returned source populates a valid course
  And the source DOES already exist in our DB
  When I create a course
  Then I should receive a CourseConflictError
  And no result is returned
