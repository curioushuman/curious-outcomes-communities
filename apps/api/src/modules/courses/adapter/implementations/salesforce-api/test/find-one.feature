Feature: Find One Course Source

Scenario: Successfully find one course source
  Given I am authorised to access the source
  And a matching record exists at the source
  When I request the source by ID
  Then a source corresponding to that ID should be returned

Scenario: Fail; Unable to authenticate with source repository
  Given I am NOT authorised to access the source
  And a matching record exists at the source
  When I request the source by ID
  Then I should receive a RepositoryAuthenticationError
  And no result is returned

Scenario: Fail; Source not found for ID provided
  Given I am authorised to access the source
  And a matching record DOES NOT exist at the source
  When I request the source by ID
  Then I should receive a RepositoryItemNotFoundError
  And no result is returned
