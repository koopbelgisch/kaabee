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

It would be nice if all commits were free of compiler and linter errors. A nice way to automate this check is to enable a pre-commit hook to check this with `ln -s "$PWD/.hooks/pre-commit" .git/hooks/`. If you really have to, you can skip this check with `git commit -n`.

## Configuration and secrets

We use the [config](https://www.npmjs.com/package/config) package for the configuration of multiple environments: development (default), testing, and production. You will see that `config/production.json` is an unreadable, binary file. That's because it has been encrypted with [git-crypt](https://github.com/AGWA/git-crypt) to ensure our production secrets aren't leaked to the internet.

If someone needs to be added to the trusted group of users who can edit these files, someone who already has acces needs to import and trust that user's GPG key and add them with `git-crypt add-gpg-user <gpg-id>`.

Check [the documentation of the config package](https://github.com/lorenwest/node-config/wiki/Securing-Production-Config-Files) for more info about this secret management.

