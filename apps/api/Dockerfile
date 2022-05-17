# ! This Dockerfile will only run successfully as part of a Kubernetes cluster
# See associated k8s repo for helm charts, and skaffold.dev for dev setup

# ------
# Build
# ------
FROM node:16-alpine AS build

# https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine
RUN apk add --no-cache libc6-compat

# install python to support some dependencies
RUN apk add --no-cache python3 make g++

WORKDIR /usr/src/app

# Copy package.json and package-lock.json to /usr/src/app
# ! Don't yet have a solution for the package-lock file
COPY ./apps/api/package.json ./

# Install ALL dependencies to /usr/src/app/node_modules
RUN npm install

# ------
# Build for dev
# ------
FROM node:16-alpine AS build-development

RUN apk add --no-cache libc6-compat

WORKDIR /usr/src/app
COPY --from=build /usr/src/app ./

# Grab the project/ts files
# Nest/Jest will use them during dev/test stages
COPY ./apps/api ./apps/api
COPY ./libs ./libs

COPY [ \
  "./webpack-hmr.config.js", \
  "./tsconfig.base.json", \
  "./jest.preset.js", \
  "./apps/api/entrypoint.sh", \
  "./apps/api/nest-cli.json", \
  "./apps/api/jest.config-e2e.js", \
  "./" \
  ]

# entrypoint needs to be executable
RUN chmod +x entrypoint.sh

# ------
# Dev stage
# ------
FROM node:16-alpine AS development

RUN apk add --no-cache libc6-compat

WORKDIR /usr/src/app
COPY --from=build-development /usr/src/app ./

# Setting NODE_ENV helps Skaffold know this is a node app
ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

CMD [ "sh", "entrypoint.sh" ]

# ------
# Test stage, used for local e2e tests
# ------
FROM node:16-alpine AS test

RUN apk add --no-cache libc6-compat

WORKDIR /usr/src/app
COPY --from=build-development /usr/src/app ./

COPY ./apps/api/tsconfig.spec-e2e.json ./tsconfig.spec.json

ARG NODE_ENV=test
ENV NODE_ENV=${NODE_ENV}

CMD [ "sh", "entrypoint.sh" ]

# ------
# Build for production
# ------
FROM node:16-alpine AS build-production

RUN apk add --no-cache libc6-compat

WORKDIR /usr/src/app
COPY --from=build /usr/src/app ./

# Grab the project/ts files for final build
COPY ./apps/api ./apps/api
COPY ./libs ./libs

COPY [ \
  "./tsconfig.base.json", \
  "./apps/api/nest-cli.json", \
  "./" \
  ]

# Build to ./dist
RUN npx @nestjs/cli build --path apps/api/tsconfig.build.json

# ------
# Production stage
# ------
FROM node:16-alpine AS production

RUN apk add --no-cache libc6-compat

WORKDIR /usr/src/app
COPY --from=build-production /usr/src/app/dist ./dist
COPY --from=build-development /usr/src/app/entrypoint.sh ./entrypoint.sh

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

CMD [ "sh", "entrypoint.sh" ]
