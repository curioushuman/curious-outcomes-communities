# Name: Create Learning Journey
## 1. Details
- **Subdomain**: Learning design
- **Aggregate root**: Learning journeys

## 2. Data
### Input data:
- External Id

### Dependencies (from other services/sources)
- Requires data from external source

### Output (results, events, errors)
#### Success (singular + event)
- FacCourse created successfully created (201)
Event: FacCourse created

### Failure (1+):
Error contacting SF
Authentication
Network
Other
Case not found
Case invalid data
Case missing required information
Error saving Fac. course
DB error

## 3. Behaviour
Triggered by:
Case record saved in SF
Saved by admin

Side-effects:
Fac. course created
Case record updated
SF Notification sent
Email sent

## 4. Decisions
- External record info not updatable from custom admin
- NO extra data administer-able from our admin
  - Only aspects such as groups etc
- If they don't have their own external system they can pay for our separate one
  - Create fac. course micro service

## 5. Questions

- How to best handle facilitated courses? Vs other learning journeys?

UP TO
- if the fac course can be external, or I host it
- what does it connect to?

I think I need to look at my other stuff, queries etc. When will I need these things?
- Will I need to list them?
- What data will I need?
- How will I get it?

e.g. fac course can be self hosted or internally hosted maybe?
- then the DTO will either accept ID and ext. hosted OR int. hosted and ALLLL the info
