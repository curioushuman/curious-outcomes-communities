Feature: Find One Participant

Scenario: Successfully find one participant
  Given I am authorised to access the repository
  And a matching record exists in the repository
  When I request the participant by ID
  Then a participant corresponding to that ID should be returned

# Scenario: Fail; Unable to authenticate with participant repository
# TODO - Handled in authenticate.feature

# NOTE: we use a RepositoryItemNotFoundError here
# as a specific error is not raised by the MongoDb repository
Scenario: Fail; Participant not found for ID provided
  Given I am authorised to access the repository
  And a matching record DOES NOT exist at the repository
  When I request the participant by ID
  Then I should receive a RepositoryItemNotFoundError
  And no result is returned
