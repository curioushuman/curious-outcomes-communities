Feature: Find One Participant

Scenario: Successfully creating a participant
  Given I am authorised to access the repository
  And a matching record does not already exist in our DB
  When I attempt to create a participant
  Then a new record should have been created
  And no result is returned

# Scenario: Fail; Unable to authenticate with participant repository
# TODO - Handled in authenticate.feature

Scenario: Fail; Participant could not be created
  Given I am authorised to access the repository
  And an error occurred during record creation
  When I attempt to create a participant
  Then I should receive an Error
  And no result is returned
