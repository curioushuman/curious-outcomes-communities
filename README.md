# Pok-e-dentifier

For those embarrassing pokemon moments..

## Built with

- Nx
- Quasar
- Nest.js
- K8s
- Skaffold

## Status

Not quite production ready, outstanding:

- App
  - Connection to API
  - Auth
  - Further tidying
  - Testing
- API
  - Connection to Poke-API
  - Auth
- CI/CD
  - More info available in [poke-k8s](https://github.com/curioushuman/poke-k8s) repo

# Setup

## Install K8s

- Clone the [poke-k8s repo](https://github.com/curioushuman/poke-k8s) to the same directory as this repo
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

- [http://poke-web.dev](http://poke-web.dev)

If you are presented with an HTTPS error, type `thisisunsafe` to resolve locally.

To access API:

- [http://poke-api.dev](http://poke-api.dev)

You can run some basic manual tests via the `~/apps/api/requests.http` file so long as you have the [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) extension installed.

# Testing

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

## TODO

### Value Objects being more OO

At the moment they piggyback on runtypes (which I love) but are not super Type safe nor OO. For now they do the job (well) but in the future this needs revisiting.

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
