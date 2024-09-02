# syntax=docker/dockerfile:1.9.0-labs
FROM node:latest AS base

RUN mkdir /app
COPY --parents package.json yarn.lock .yarnrc.yml .yarn/ */package.json */yarn.lock /app/

FROM node:latest AS frontend-build

WORKDIR /app
COPY --from=base /app /app

RUN yarn workspace frontend install --immutable

COPY . /app

RUN NEXT_PUBLIC_ENVIRONMENT=prod yarn workspace frontend build

FROM nginx:alpine AS frontend

COPY --from=frontend-build /app/frontend/out /usr/share/nginx/html