Feature: Create Course

Scenario: Successfully creating a course
  # Given an object exists in Source repository
  Given the request is valid
  # And I am authorised to access the source repository
  # And the returned source populates a valid course
  # And the source does not already exist in our DB
  When I create a course
  Then a new record should have been created
  # And no result is returned

Scenario: Fail; Invalid request
  # Given an object exists in Source repository
  Given the request is invalid
  When I attempt to create a course
  # Then I should receive a RequestInvalidError
  Then I should receive a BadRequestException
  # And no result is returned
