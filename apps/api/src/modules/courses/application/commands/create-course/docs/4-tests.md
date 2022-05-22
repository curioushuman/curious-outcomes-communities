# Feature Workflow: Acceptance tests

## Scenario: successful create

```gherkin
Given an object exists in Source repository
And the request is valid
And I am authorised to access the source repository
And the (returned) source populates a valid course
And the source does not already exist in our DB
When I create a course
Then a new record should have been created in the repository
And no result is returned
```

## Scenario: failed create

### Invalid request

```gherkin
Given an object exists in Source repository
And the request is invalid
When I attempt to create a course
Then I should receive a RequestInvalidError
And no result is returned
```

### Unable to authenticate with source repository

```gherkin
Given an object exists in Source repository
And the request is valid
And I am NOT authorised to access the source repository
When I attempt to create a course
Then I should receive a SourceAuthenticationError
And no result is returned
```

### Source not found for ID provided

```gherkin
Given an object exists in Source repository
And the request is valid
And I am authorised to access the source repository
And no source exists for the ID provided in the request
When I attempt to create a course
Then I should receive a SourceNotFoundError
And no result is returned
```

### Problems accessing source repository

```gherkin
Given an object exists in Source repository
And the request is valid
And I have an issue accessing the source repository
When I attempt to create a course
Then I should receive a SourceServerError
And no result is returned
```

### Source does not translate into a valid Course

```gherkin
Given an object exists in Source repository
And the request is valid
And I have an issue accessing the source repository
And the returned source does not populate a valid Course
When I attempt to create a course
Then I should receive a SourceInvalidError
And no result is returned
```

### Source already exists in our DB

```gherkin
Given an object exists in Source repository
And the request is valid
And I am authorised to access the source repository
And the (returned) source populates a valid course
And the source DOES already exist in our DB
When I create a course
Then I should receive a CourseConflictError
And no result is returned
```
