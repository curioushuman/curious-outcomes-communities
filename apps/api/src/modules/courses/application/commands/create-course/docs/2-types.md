# Data types: Create Course

## Notes

Assume everything is AND unless specified by OR and ()

## Types

### externalId
- ExternalId type
- Extends string
- **NOTE**: this could do with better validation; drawn from the specific external source
e.g. Salesforce IDs have specific rules

### Course
- name: Name extends string
  - Unsure of validation rules
  - Maybe max length
- description: Description extends string
  - Similar RE validation
  - Max length
- startDate: date
  - Has to be in the future
- endDate: date
  - Has to be later than startDate
- externalId: ExternalId

### SavedCourse

Extends Course

- RepoIdentifier
  - Dependent on repo

### External Record

Extends Course

- Related Course Id

## Errors

- RequestInvalidError
  - Extends: BadRequestException
  - Message: Invalid request, please review
- RepositoryAuthenticationError
  - Extends: UnauthorizedException
  - Message: Error authenticating with Course source <`ApiRepository.Name`>, please re-authenticate
- RepositoryItemNotFoundError
  - Extends: NotFoundException
  - Message: A source could not be found for ID <`ExternalId`>, please check your Course source for this ID
- RepositoryServerError
  - Extends: InternalServerException
  - RESOLVE THE BELOW, which message? Templated?
  - Message: Error connecting to Course source <`ApiRepository.Name`>, please try again or contact system administrator
  - Message: Error saving new Course for Source with ID <`ExternalId`>, please try again or contact system administrator
- CourseInvalidError
  - Extends: BadRequestException
  - Message: Source with ID <`ExternalId`> contains insufficient or invalid data to create a new Course
- CourseConflictError
  - Extends: ConflictException
  - Message: Source with ID <`ExternalId`> already exists within our DB. No action required.
- NotificationFailedToSendError
  - Extends: InternalServerException
  - Message: Error sending Notification, contact your system administrator
- EventFailedToEmitError
  - Extends: InternalServerException
  - Message: Error emitting event, contact your system administrator

## Events

### CourseCreatedEvent

- createdDatetime: dateTime
- course: SavedCourse

## Notifications

### CourseCreatedNotification

- course: SavedCourse
- subject: Course created <`SavedCourse.name`>
- message: Course <`SavedCourse.name`></br>
| created by <`SavedCourse.name`></br>
| at <`SavedCourse.createdDatetime as time`></br>
| on <`SavedCourse.createdDatetime as date`>

### Email

- Subject: string, no longer than 80 chars
- Message: string, ideally in a template

### Source repository

- Subject: string, no longer than 80 chars
- Message: string, no longer than 150 chars
