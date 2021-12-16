## DevLand Api

In this repo lives the DevLand main API.


> By now it is just a proof of concept

## Local Setup

In order to run this project on dev or production mode you first need to do some pre installations and configurations:

**Node and NPM**:

This project uses node 16+ and 7+, please make sure that your node version matches the right minimal version. If it doesn't, please install nvm to manage your node installations.

You can find nvm for [windows](https://github.com/coreybutler/nvm-windows) and [linux](https://github.com/nvm-sh/nvm).

**MongoDB**:

You may install mongo in order to work locally, in production mode, mongo cluster is a dedicated service and if you want to test a production or staging environment you must first edit the next file: `src>storage>database.js@11:78` and change `mongodb://` to `mongodb+srv://` (**REMEMBER TO CHANGE IT AGAIN IF YOUR WORKING LOCALLY OR MAKING A PR**). If your working just locally you don't need to do nothing with this line.

To make mongo work you need to place in your .env file the `DB_HOST` that you can set to `localhost` or any remote host, the `DB_NAME` which is usually `devland` and the `DB_USER` `DB_PASS` which you may create trough your mongo console and the user must have permission to perform CRUD operations on the database.

You can find documentation about how to create users with mongo shell in [this link](https://docs.mongodb.com/manual/reference/method/db.createUser/).

**Stellar, TESTNET & PUBLIC NET**

In dev mode you must use TESTNET, this is very important since to perform operations over the stellar network we don't need to create real transactions over the main ledger.

> By now we don't use the stellar SDK to perform operations over the network, just to create keypairs ans sign txs, so this is WIP until we work on the platform economics.

To generate a server secret key (placed inside your .env file as `SERVER_SECRET_KEY`) we're working on and offScript in the cli, but by now you can [create a valid keypair at the stellar laboratory](https://laboratory.stellar.org/#account-creator?network=test) and use it as your server secret (**PLEASE DON'T USE YOUR MAIN STELLAR ACCOUNT AS SERVER SECRET**).

**JWT and GCP**

Some configurations are needed with JWT, please place in your .env file a `JWT_SECRET` this can be anything you want, and the duration of the JWT session, normally is 15d but you may specify the amount of time in the following format: 

- d: Days
- m: minutes
- s: Seconds 

> Example: 15s

For Object Storage we're using a Google Cloud Platform's bucket as main service, this probably is going to change to a S3 bucket but by now if you want to work with the media API you must request a service account with the main developers at the devland official channels on discord or telegram, this service account will be restricted and all data generated will be automatically deleted every day.

Once you have your service account you must place your `serviceAccountKey.json` file inside the storage utility folder ( `src > storage` ).

## 📖 Usage:

Make a request to the available endpoints:

[See available endpoints](/endpoints.md).

> Payload documentation is WIP

## 🛠️ Development

1. Install all the dependencies
```sh
$ npm install
```

2. Set the required variables inside the .env file:

>Please expect this variables to change in the future

```env
DB_HOST=XXXXXXXXXXXXX
DB_USER=XXXXXXXXXXXXX
DB_PASS=XXXXXXXXXXXXX
DB_NAME=XXXXXXXXXXXXX
JWT_SECRET=XXXXXXXXXX
SERVER_SECRET_KEY=XXX
REFRESH_DURATION=15d
```

> serviceAccountKey.json is a file with the credentials for the GCP service account to access the storage bucket (see [here](https://cloud.google.com/storage/docs/authentication)).

3. Start the project in dev mode. This command will start a development server.
```sh
$ npm run dev
```

## 🎎 Contributing

- **Make your own fork**

    Make a fork of this repo and start contributing on your own branch.

- **Always keep up to date with the latest changes**

- **Always commit your changes and include them in the changelog**

    The changelog format is: date as heading and list of changes, always use the same format.

- **Before committing on git**

    * Get all your linting error (with ESlint)
    ```sh
    $ npm run lint
    ```

    * Fix all your linting error automatically (with ESlint)
    ```sh
    $ npm run lint:fix
    ```

    > No linted files won't be merged

- **Git**

    Make the commit and push it to the remote, then if everything is fine, make a PR.

## 🧦 Tests

To run the tests, run:
```shell
$ npm test
```

## 💾 Production

1. Install all the dependencies
```sh
$ npm install
```

2. Start the project in production mode.
```sh
$ npm run start
```

## Create super user from the command line

```sh
$ node --harmony ./createSuperUser.js [options]
```

```
Options:
  
  - `-u`: username (required)
  - `-p`: publicKe (required)
  - `-n`: firstName
  - `-l`: lastName
``` 

## Contributors 🤠
Miguel Rangel [Github](https://github.com/denyncrawford)