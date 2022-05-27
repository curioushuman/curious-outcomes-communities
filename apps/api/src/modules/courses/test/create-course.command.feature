Feature: Create Course

Scenario: Successfully creating a course
  Given the request is valid
  When I attempt to create a course
  Then a new record should have been created
  And a positive response received

Scenario: Fail; Invalid request
  Given the request contains invalid data
  When I attempt to create a course
  Then I should receive a RequestInvalidError/BadRequestException

Scenario: Fail; Source not found for ID provided
  Given the request is valid
  And no record exists that matches our request
  When I attempt to create a course
  Then I should receive a RepositoryItemNotFoundError/NotFoundException

Scenario: Fail; Source does not translate into a valid Course
  Given the request is valid
  And a matching record is found at the source
  And the returned source does not populate a valid Course
  When I attempt to create a course
  Then I should receive a CourseInvalidError/BadRequestException

Scenario: Fail; Source already exists in our DB
  Given the request is valid
  And a matching record is found at the source
  And the returned source populates a valid course
  And the source DOES already exist in our DB
  When I attempt to create a course
  Then I should receive a CourseConflictError/ConflictException
