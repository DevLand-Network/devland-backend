## DevLand Api

In this repo lives the DevLand main API.


> By now it is just a proof of concept


## 📖 Usage:

| Method | Endpoint | Description |
| ------------- | ------------- | ----- |
| GET  | / | Get API information |
| GET  | /posts | Get the whole list of posts |
| GET  | /posts/:postID | Get post by its id |
| POST | /posts | Create a new post |
| PUT | /posts/:postID | Update Post by its id |
| DELETE | /posts/:postID | Delete Post by its id |

> Payload documentation is WIP

## 🛠️ Development

1. Install all the dependencies
```sh
$ npm install
```

2. Start the project in dev mode. This command will start a development server.
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