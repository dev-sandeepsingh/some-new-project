
# Node Typescript Boilerplate


## Table of Contents

1. [About](#about)  
    1. [Technologies](#technologies)  
    1. [Basic requirements](#basic-requirements)  
    1. [Hosting](#hosting)
    1. [Environments](#environments)
    1. [Managing Credentials](#managing-credentials)
1. [Workflow](#workflow)  
    1. [Git workflow](#git-workflow)
    1. [Committing your changes](#committing-your-changes)
    1. [CI and deployment](#ci-and-deployment)
1. [Working with code](#working-with-code)
    1. [Running application](#running-application)
    1. [Running tests](#running-tests)
    1. [Accessing databases](#accessing-databases)
    1. [Project structure](#project-structure)
    1. [Quality](#quality)
        1. [Expected code quality](#expected-code-quality)
        1. [Tests](#tests)
        1. [Code Review](#code-review)
1. [Tools](#tools)  
    1. [Error handling](#error-handling)
    1. [Performance monitoring](#performance-monitoring)  
    1. [Log monitoring](#log-monitoring)  
    1. [Backups](#backups)  

## About

### Technologies

- Language: <img src="https://img.shields.io/badge/TypeScript-4.x.x-blue" >
- Databases: <img src="https://img.shields.io/badge/PostgreSQL-12.x.x-blue" > <img src="https://img.shields.io/badge/Redis-6.x.x-blue" >
- HTTP framework: <img src="https://img.shields.io/badge/express-4.17.x-blue" >
- ORM: <img src="https://img.shields.io/badge/typeorm-0.2.x-blue" >
- Testing tools: <img src="https://img.shields.io/badge/mocha-8.x.x-blue" > <img src="https://img.shields.io/badge/supertest-6.x.x-blue" > <img src="https://img.shields.io/badge/sinon-9.x.x-blue" >

### Basic requirements

1. NodeJS 16.x.x
1. NPM 8.x.x
1. Docker & docker-compose

### Hosting

We're using Heroku as hosting solution, for it's the right balance between simplicity and flexibility of it's features.

Following buildpack are required:
- heroku/nodejs - basic NodeJS Heroku buildpack
- [db-back-s3](https://github.com/svikramjeet/db-back-s3) - integrates automates backups on AWS S3

To support proper messaging on CI (commit hashes, authors etc.) also [dyno-metadata](https://devcenter.heroku.com/articles/dyno-metadata) should be enabled.

### Environments

There are two environments for each app:

- UAT: for manual testing and presentation
- production

### Managing Credentials

All required credentials for external tools should be available in 1Password.
In-app credentials are managed by environment variables - please check `.env.sample` file for more details.

## Workflow

### Git workflow

We're using trunk-based development as our git workflow. https://github.com/founderandlightning/coding-guidelines/blob/master/General/README.md#trunk-based-development-policy

### Commiting your changes

1. Make sure, that you installed project dependencies so githooks can do their job
2. Write proper commit message:
   - for commits fixing rejected Reviewee commits use format `fixed sha ...`
   - for other commits use format:

      ```md
      <message>

      <trello link>
      ```

      e.g.:

      ```md
      git hook checking commit message
      - script checking commit message format
      - README.md update

      https://trello.com/c/auMAOQdz/429-add-git-hook-with-commit-message-check
      ```

3. Git hooks check:
      - pre-commit:
        - ESLint errors
        - commit message format
      - pre-push:
        - unit tests

      If any git hook return error, please fix issue and try committing again.

### CI and deployment

Application is using CicleCI as CI. Detailed CI pipeline is described there: https://docs.google.com/drawings/d/1TrXIdR_OuVtzobuC7wjTwkSVqYKQRKEb5fmRlZ4h3ls/edit

## Working with code

### Running application

1. Setup database connection using docker-compose
    - run `docker-compose up -d`
1. Setup environment variables
    - run `cp .env.example .env`
    - open `.env` and set all env values marked with `<REPLACE:` placeholder. You can copy values from Heroku UAT environment setup.
1. Run `npm i`
1. Run `npm run db:update`
1. Run `npm start` (or `npm run watch` for  automatic code reloading)

### Running tests

1. Setup database connection using docker-compose
    - run `docker-compose up -d`
1. Setup environment variables
    - run `cp test/.env.test.example test/.env.test`
    - make sure, that you also set up `.env` file properly, according to previous ([Running application](#running-application)) section.
1. Run `npm db:update:test`. This step has do be done after every DB structure change.
1. Run `npm test`

### Accessing databases

Use following instruction when using docker-compose with default values - in other case access method depends on your custom setup.

#### Accessing PostgreSQL

1. run `docker-compose up -d`
1. open `http://localhost:5050`, login with:
    - email: `admin@pgadmin.com`
    - password: `admin@pgadmin.com`
1. Add dev database connection:
    - host: `postgres-dev`
    - port: `5432`
    - user: `admin`
    - password: `postgres`
1. Add test database connection:
    - host: `postgres-test`
    - port: `5432`
    - user: `admin`
    - password: `postgres`

### Project structure

Important directories:

- `./src`: contains source code
  - `./src/database`: database-related files (entities, migrations, etc.)
  - `./src/definition`: global static values
  - `./src/routes`: API routes, divided in subdirectories by domains
  - `./src/service`: business logic, divided in subdirectories by domains
  - `./src/utils`: utility modules
  - `./src/worker`: modules run as worker jobs

### Quality

#### Expected code quality

1. Follow directory structure described in [Project structure](###Project-structure)
1. Follow ESLint recommendations
1. Follow basic programming practices as DRY, KISS, SRP
1. Use `.env` file and environment variables for any environment-related values. Remember to update `.env.sample` file when adding new env variable.
1. Use `src/service/logger` module for all log messages. Make sure, that your logs allows to identify issues when error occurs.
1. Make sure that you're not breaking API backward compatibility. Use API versioning when introducing breaking API changes.
1. Write tests - at least integration tests with `supertest` covering API and additional unit tests to cover more specific cases.
1. Follow BDD when writing test descriptions
1. Document important architecture decisions using ADR's (check `./adr/0001-record-architecture-decisions`)
1. Keep `README.md` file updated - specially when basic requirements are changed or there are some changes in [Server-server communication endpoints](###Server-server-communication-endpoints)

#### Tests

To achieve good balance between code coverage and development time we're following "The Testing Diamond" - there's more integration than unit tests. When writing code you should cover all cases with tests, which would make you sure that API is working fine without testing it manually.
Different test kinds in use:

1. Integration/API tests
   - should cover basic API use cases
   - uses `supertest`
   - should use `sinon` for mocking more complex modules (covered with unit tests)

1. Unit tests
   - should cover more complex logic, which can't be easily covered with basic Integration/API tests

1. Performance tests
   - should cover critical path of functionality
   - should make performance expectations, enforcing good response times under heavy load

#### Code review

Code review is done per commit @ Reviewee. If possible, review within TestedMe team is preferred.
Code review guidelines: https://docs.google.com/document/d/1g9XzBdtqc68NcEbHuiqu2PO7EBAj1dttfUAcINUES3E/edit#

## Tools

### Error handling

- [Rollbar](https://rollbar.com/) (as Heroku add-on)

### Performance monitoring

- [NewRelic](https://newrelic.com/)

### Log monitoring

- [Papertrail](https://www.papertrail.com/)  (as Heroku add-on)

### Backups

Automatic backup are setup on daily basis for env variable and database via buildpack (https://github.com/svikramjeet/db-back-s3), saved in dedicated S3 bucket.
