# Curious Outcomes Communities

Using community-supported learning to drive the most necessary outcomes.

## Built with

- Nx
- Quasar
- Nest.js
- K8s
- Skaffold

# Setup

## Install K8s

- Clone the [curious-outcomes-k8s repo](https://github.com/curioushuman/curious-outcomes-k8s) to the same directory as this repo
- Follow the (Simple) setup steps from that repo

## Software

*Apologies:* this is directed towards those on MacOS.

### nx cli

```bash
$ npm i -g nx
```

**Note:** This is optional, but without it you'll need to replace any commands starting with:

```bash
$ nx <do_a_thing>
```

With:

```bash
$ npx nx <do_a_thing>
```

### skaffold cli

```bash
$ brew install skaffold
```

# Working locally

Spin up the local k8s environment:

```bash
# From root
$ skaffold dev
```

Then access web interface via:

- [http://curious-outcomes-web.dev](http://curious-outcomes-web.dev)

If you are presented with an HTTPS error, type `thisisunsafe` to resolve locally.

To access API:

- [http://curious-outcomes-api.dev](http://curious-outcomes-api.dev)

You can run some basic manual tests via the `~/apps/api/requests.http` file so long as you have the [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) extension installed.

# Testing

## Approach to testing

### To complete later

- Need to make a decision RE Integration tests
  - Most of them are independent of third party systems
    - They use fakes
    - This allows for rapid and continued testing
  - Some of them will require integration with third parties
    - As this is the core of what integration is for
  - But I would like to be able to run them independently
    - *.ispec.ts is already my own pattern
    - It feels like creating another one might be a bit much
  - DECISION
    - Anything that mocks/fakes for anything can be considered closer to a unit test

### Quick notes for now

Remember, it all starts with [use cases/features](https://wiki.solidbook.io/13-Features-(use-cases)-are-the-key-193ca4bbb8604c0eada33d1ac86ed517).

**1. Start with failing unit test for complete use case**

- Create your acceptance test using Given, When, Then
- Write a unit level test that mocks/fakes any third party systems
  - supertest for http
  - fake repository
- Focus on the success/failure of this one use case

This is your *outside in test*.

*1.1. Write minimum amount of code to make it pass*

- This can be either
  - False pass
  - Actual code pass

Generally at the use case level you are probably going to start with a false pass. i.e. just return a 200 response so we know the vertical slice is working.

**2. Incrementally add/update code to make the *outside in test* proper pass**

This will be a series of iterations of the Red, Green, Refactor (RGR). i.e.

- Add some code to move towards an **actual** pass of the use case test
  - During this process your *outside in test* will be in a failed state
- Use smaller, internal **RGR** loop(s) to create this code
  - e.g. if you're adding a repository, start with failing tests for the repository
  - Then make these pass
- Until your *outside in test* is also passing with this new/updated code in place

**3. Commit the passing code**

Commit often; every time a test passes essentially. Pick and choose what you commit though, so the repo is always in a passing state.

## All

TBC

## API (only)

### Manual tests

- Install [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client)
- Open [~/apps/api/requests.http](apps/api/requests.http)
- Use the available tests
- OR add your own

### Unit tests

Handled *outside of k8s* via Jest, managed by Nx.

```bash
$ nx run api:test-unit
# To leave it running
$ nx run api:test-unit --watch
```

Matches files using Jest [standard testMatch pattern](https://jestjs.io/docs/configuration#testmatch-arraystring).

### Integration tests

Handled *outside of k8s* via Jest, managed by Nx.

```bash
$ nx run api:test-integration
```

Matches files with the file pattern `*.ispec.ts`.

### Unit + Integration

Handled *outside of k8s* via Jest, managed by Nx.

```bash
$ nx run api:test
```

Matches both of the above patterns.

### E2E tests

Handled **INSIDE of k8s** via Jest, supported by Nx, enabled via Skaffold.

```bash
# Tells skaffold.yaml to use the 'test' stage of Docker container
$ nx run api:pre-test
# Then tests are automatically run and watched within k8s
$ skaffold dev
```

Matches files with the file pattern `*.e2e.ts`.

### Manual testing within Kubernetes

Handled **INSIDE of k8s** via Nest cli, supported by Nx, enabled via Skaffold.

```bash
# Tells skaffold.yaml to use the 'development' stage of Docker container
$ nx run api:pre-dev
# Skaffold will deploy k8s and Nest will start
$ skaffold dev
```

This will spin up the k8s cluster, and start Nest with:

- hot reloading
- watch

**Note:** you only have to run pre-dev if you've previously been running e2e tests.

## App

TBC

# Appendix

## Connecting to third party APIs

### Salesforce

For machine to machine communication you need to use the OAuth 2.0 JWT Bearer Flow. Official (rubbish) docs:

- https://help.salesforce.com/s/articleView?id=sf.remoteaccess_oauth_jwt_flow.htm&type=5

A better instructions can be found at either of the following:

- https://medium.com/@salesforce.notes/salesforce-oauth-jwt-bearer-flow-cc70bfc626c2
- https://gist.github.com/booleangate/30d345ecf0617db0ea19c54c7a44d06f

The above includes all the steps required e.g. setting up a connected app in Salesforce. One of the most important, and easily overlooked steps is to authorise a specific user by visiting the link below. Once there, login using the Salesforce user account you want to use in your code. **NOTE:** this may not be your own personal user.

```
# Template
https://<your_salesforce_url/services/oauth2/authorize?response_type=token&client_id=<consumer key>&redirect_uri=<your_callback>

# Staging example
https://asiapacificforum--sandboxname.lightning.force.com/services/oauth2/authorize?response_type=token&client_id=3MVG9e2-this-sdsdf-is-kjnsdfsdf-not-a-sdsdfsdf-real-key&redirect_uri=sfdc://oauth/jwt/success

# Production example
https://asiapacificforum.lightning.force.com/services/oauth2/authorize?response_type=token&client_id=3MVG9e2-this-sdsdf-is-kjnsdfsdf-not-a-sdsdfsdf-real-key&redirect_uri=sfdc://oauth/jwt/success

```

***Important notes***

- When requesting the access token (within your code) you must use test.salesforce.com / login.salesforce.com rather than your custom URL
- When sending the body it DOES INDEED NEED TO BE stringified

## TODO

### Value Objects being more OO

At the moment they piggyback on runtypes (which I love) but are not super Type safe nor OO. For now they do the job (well) but in the future this needs revisiting.

### Runtypes validation errors returning better messages

Currently they're a little verbose. Just need to trim them down a little bit to make them more readable while still being useful.

## Inspiration

### Domain Driven Development (DDD)

Khalil Stemmler and his fantastic book + supporting repo:

- https://solidbook.io/
- https://github.com/stemmlerjs/ddd-forum

### API

* [VincentJouanne/nest-clean-architecture](https://github.com/VincentJouanne/nest-clean-architecture)
  * Very tidy, very advanced combination of Nest.js & DDD

## Important notes / decisions

### Nx/monorepo

At this stage, we don't employ *all* of the benefits of Nx as a monorepo provider. This is mainly down to:

- K8s for service delivery
- Inconsistent results for Vue (et al) within Nx

Things I would like to work on next:

- Taking full advantage of Nx build and build caching
  - Currently we build within the respective Dockerfiles
    - Which means semi-duplicated package.json files
    - And potential productivity costs
  - When there is time I will play with this further
    - May require some faffing on the Quasar front
- Shared repo for UI elements

### Testing

**#1 We have specifically not included skaffold within Nx**

- It disables Skaffold's natural rollback function upon CTRL+C (as the CTRL C is picked up only by Nx)
- It has no dependencies that Nx can help us with (as Skaffold will rebuild from Dockerfile anyway)
- It disables Skaffold terminal colours

I'm sure there are solutions to some of these, but they're low priority when we already have a working solution.

**#2 *pre-test-e2e* and *pre-dev* do not build the docker containers**

Because Skaffold does.

### Leaner Value Objects (VO) & Domain Objects (DO)

I love the purity of Stemmler's approach to VO, Entities, AggregateRoots but as we enfold his pure DDD into a Nest.js context; where a lot of DDD/CQRS things are already handled; there was always going to be a need to refine/remove aspects. The [RunTypes](https://github.com/pelotom/runtypes) library (introduced by Vincent) is fantastic, at it's core it contributes runtime type checking on top of compile time checking, as well as:

- Data validation
- Value constraint definition / validation
- Type guarding
- Object matching
- And much more...

Links and articles [below](#runtypes) in the [packages](#packageslibraries) section.

## Packages/libraries

### Runtypes

Borrowed from [VincentJouanne](https://github.com/VincentJouanne), they use it to implement very neat encapsulated Value Objects.

* [Runtypes](https://github.com/pelotom/runtypes)
* [A good article about Runtypes](https://blog.logrocket.com/using-typescript-to-stop-unexpected-data-from-breaking-your-app/)
