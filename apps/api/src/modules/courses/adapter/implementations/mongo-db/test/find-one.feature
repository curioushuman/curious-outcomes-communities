Feature: Find One Course

Scenario: Successfully find one course
  Given I am authorised to access the repository
  And a matching record exists in the repository
  When I request the course by ID
  Then a course corresponding to that ID should be returned

# Scenario: Fail; Unable to authenticate with course repository
# TODO - Handled in authenticate.feature

# NOTE: we use a RepositoryItemNotFoundError here
# as a specific error is not raised by the MongoDb repository
Scenario: Fail; Course not found for ID provided
  Given I am authorised to access the repository
  And a matching record DOES NOT exist at the repository
  When I request the course by ID
  Then I should receive an RepositoryItemNotFoundError
  And no result is returned
