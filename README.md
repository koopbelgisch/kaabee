# KaaBee

## Installation

1. Install [NodeJS](https://nodejs.org/)
2. Install [Yarn](https://classic.yarnpkg.com/en/docs/install)
3. Run `yarn install`

## Development

To start developing, run `yarn dev`. This will start a development server on [localhost:3000](http://localhost:3000) which automatically recompiles and restarts the server when you change any code files in `src/`.

The database will be a empty when you start, you can fill it with some randomly generated data with `yarn run db:seed`.
It is also possible to fill the database with already existing stores. In order to do this, you will need to place the
exported .csv file containing the stores in the `data` folder and name it `data.csv`. Then, run `yarn run db:import`.
