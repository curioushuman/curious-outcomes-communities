# ! This Dockerfile will only run successfully as part of a Kubernetes cluster
# See associated k8s repo for helm charts, and skaffold.dev for dev setup

# ------
# Build
# ------
FROM node:18-alpine AS build

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
FROM node:18-alpine AS build-development

RUN apk add --no-cache libc6-compat

WORKDIR /usr/src/app
COPY --from=build /usr/src/app ./

# Grab the project/ts files
# ! If we move to a shared UI lib this will need to change
COPY ./apps/web ./

RUN chmod +x entrypoint.sh

# ------
# Dev stage
# ------
FROM node:18-alpine AS development

RUN apk add --no-cache libc6-compat

WORKDIR /usr/src/app
COPY --from=build-development /usr/src/app ./

# Setting NODE_ENV helps Skaffold know this is a node app
ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

# TODO - prevent the need for this extra install
# Error 'quasar not found' via npm script
RUN npm install

CMD [ "sh", "entrypoint.sh" ]

# ------
# Test stage, used for local e2e tests
# ------
FROM node:18-alpine AS test

RUN apk add --no-cache libc6-compat

WORKDIR /usr/src/app
COPY --from=build-development /usr/src/app ./

# We do our e2e tests in k8s
COPY ./apps/api/tsconfig.spec-k8s.json ./tsconfig.spec.json

ARG NODE_ENV=test
ENV NODE_ENV=${NODE_ENV}

RUN npm install

CMD [ "sh", "entrypoint.sh" ]

# ------
# Build for production
# ------
FROM node:18-alpine AS build-production

RUN apk add --no-cache libc6-compat

WORKDIR /usr/src/app
COPY --from=build /usr/src/app ./

# Grab the project/ts files for final build
# ! As above we'll need to alter this later
COPY ./apps/web ./

RUN npm install

# Build to ./dist
RUN npm run build

# ------
# Production stage
# ------
FROM nginx AS production

WORKDIR /usr/src/app
COPY --from=build-production /usr/src/app/dist/spa /usr/share/nginx/html
