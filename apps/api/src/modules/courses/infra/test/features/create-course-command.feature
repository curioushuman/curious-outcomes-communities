Feature: Create Course

# Those lines commented out below are out of scope for the controller
Scenario: Successfully creating a course
  # Given an object exists in Source repository
  Given the request is valid
  # And I am authorised to access the source repository
  # And the returned source populates a valid course
  # And the source does not already exist in our DB
  When I attempt to create a course
  Then a new record should have been created
  # And no result is returned

# Scenario: Fail; Invalid request
Scenario: Fail; Invalid request, invalid data
  # Given an object exists in Source repository
  Given the request contains invalid data
  When I attempt to create a course
  # Then I should receive a RequestInvalidError
  Then I should receive a BadRequestException
  # And no result is returned

Scenario: Fail; Invalid request, missing data
  # Given an object exists in Source repository
  Given the request contains missing data
  When I attempt to create a course
  # Then I should receive a RequestInvalidError
  Then I should receive a BadRequestException
  # And no result is returned
