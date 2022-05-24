Feature: Create Course

Scenario: Successful connection to repository
Given the repository is live
  When I attempt attempt to check live status
  Then I should receive a positive result

# Scenario: Fail; Unable to authenticate with source repository
# Given the request is valid
#   And I am NOT authorised to access the source repository
#   When I attempt to create a course
#   Then I should receive a SourceAuthenticationError
#   And no result is returned
