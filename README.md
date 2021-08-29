## DevLand Api

In this repo lives the DevLand main API.


> By now it is just a proof of concept


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

3. Start the project in dev mode. This command will start a development server.
```sh
$ npm run dev
```

## 🎎 Contributing
#### Before committing on git

* Get all your linting error (with ESlint)
```sh
$ npm run lint
```

* Fix all your linting error automatically (with ESlint)
```sh
$ npm run lint:fix
```

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

## Contributors 🤠
Miguel Rangel [Github](https://github.com/denyncrawford)