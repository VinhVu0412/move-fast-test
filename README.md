# move-fast-test
This is for the entrance test from MoveFast
Requirements:
- BE: https://gist.github.com/binary-koan/17707ac079a95b2868233c30bef2b0af
- FE https://gist.github.com/binary-koan/662d46a941b1b55c9a048cf05d9574e7

----

## Assessment

### Frontend
- This app is online at [https://vinh--move-fast.herokuapp.com/](https://vinh--move-fast.herokuapp.com/)
- Source code is at [Index](pages/index.js) and [components](components)
- [Unit Tests](__test__)
- [E2E Tests](cypress/integration)

### Backend
- The APIs is online at [https://vinh--move-fast.herokuapp.com/api](https://vinh--move-fast.herokuapp.com/api)
- Source code is at [Index](pages/api) and [components](components)
- DB schema and migrations are in the [prisma](prisma) folder
- [Unit Tests](__test__/api)

----

## Technical stack

This is based on the Next.js framework with:
- Global CSS, CSS Modules.
- PostgreSQL + [Prisma](https://www.prisma.io/) (a Node.js ORM)
- Unit test using [Jest](https://jestjs.io/) + [React Testing Library](https://testing-library.com/)
- E2E test using [cypress](https://www.cypress.io/)

----

## Develop

### Prerequisites
- Node 12 or higher
- Docker installed (for local DB)
- Heroku CI (for manual deployment)

### Start local dev server
- Run `yarn install`
- Run `yarn dev`

### Run Tests
Recommended to run all tests at once with `yarn test:all`, but you are till able to run:
- unit tests with `yarn test`
- e2e test with `yarn e2e:headless`

----

## Deployment
- Please make sure these 2 env have been set in your Heroku environment and in your local `.env` file
  - DATABASE_URL: PostgreSQL connection URL. Your can create one with [Heroku Postgres](https://elements.heroku.com/addons/heroku-postgresql).
  - IRON_PASSWORD: an random key which is longer than 32 characters
- Make sure the Heroku remote has been added with `git remote add heroku [your-heroku-git-repo]`
- Migrate DB with `yarn prisma db push`
- Deploy current branch with `git push heroku HEAD:main`
