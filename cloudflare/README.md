# 👷 `Cloudflare worker`

With this worker the media api can serve cached files delivered by cloudflare.

[`index.js`]: the content of the Workers script.

#### Wrangler

Publish this project using wrangler and the server account api key [wrangler](https://github.com/cloudflare/wrangler)

First, insert the api token (please request one from the server account api key page)

```
wrangler config 
```
> here you can see the api token

Then publish the project

```
wrangler publish
```

Further documentation for Wrangler can be found [here](https://developers.cloudflare.com/workers/tooling/wrangler).
