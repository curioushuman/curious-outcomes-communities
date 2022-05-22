Feature: Create Course

Scenario: Successfully creating a course
  Given an object exists in Source repository
  And the request is valid
  And I am authorised to access the source repository
  And the returned source populates a valid course
  And the source does not already exist in our DB
  When I attempt to create a course
  Then a new record should have been created in the repository
  And no result is returned

# Handled in controller
# Scenario: Fail; Invalid request
