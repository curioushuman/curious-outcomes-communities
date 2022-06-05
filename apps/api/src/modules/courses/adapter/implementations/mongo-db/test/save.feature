Feature: Find One Course

Scenario: Successfully creating a course
  Given I am authorised to access the repository
  And a matching record does not already exist in our DB
  When I attempt to create a course
  Then a new record should have been created
  And no result is returned

# Scenario: Fail; Unable to authenticate with course repository
# TODO - Handled in authenticate.feature

# UP TO HERE
# See what kind of errors come back from MongoDb repo
# update the mongdob errorfactory to deal with the format
# update the save spec to deal with these two scenarios

Scenario: Fail; Course could not be created
  Given I am authorised to access the repository
  And an error occurred during record creation
  When I attempt to create a course
  Then I should receive an Error
  And no result is returned
