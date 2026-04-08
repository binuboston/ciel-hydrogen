# Mini Oxygen

## Getting Started

To use with your custom Oxygen app, follow these steps:

Add `@shopify/mini-oxygen` as a dev dependency of your app:

```shell
yarn add --dev @shopify/mini-oxygen
```

or

```shell
npm install --save-dev @shopify/mini-oxygen
```

Generate the config file by following the prompts:

```shell
yarn exec oxygen-gen-config
```

or

```shell
npm exec -c oxygen-gen-config
```

## Configuration

The options available in `mini-oxygen.config.json` are as follows:

- `port`: the TCP port used for the local web server on localhost
- `workerFile`: path to the worker file related to the current dir
- `assetsDir`: path to the built assets directory related to the current dir
- `publicPath`: URL or pathname for public/static assets that prefixes file names
- `proxyServer`: proxy server address and port (<address>:<port>) to proxy requests to
- `buildCommand`: a command to re-build the project
- `watch`: enable or disable rebuild on source file changes
- `buildWatchPaths`: an array of directories to watch for changes
- `autoReload`: enables auto reload of the browser after re-building
- `modules`: enables module syntax in the worker script
- `envPath`: (optional) path to the .env file to be loaded automatically
- `env`: specify environment variables available in the worker script

Example contents of a configuration file is shown here:

```json
{
  "port": 3000,
  "workerFile": "dist/worker/index.js",
  "assetsDir": "dist/client",
  "publicPath": "",
  "proxyServer": "127.0.0.1:8080",
  "buildCommand": "yarn build",
  "watch": true,
  "buildWatchPaths": [
    "./src"
  ],
  "autoReload": true,
  "modules": true,
  "envPath": "./.env",
  "env": {
    "name": "value"
  }
}
```

## Running your project

Run the local dev server from the same directory where your `mini-oxygen.config.json` file is:

```shell
yarn exec oxygen-preview
```

or

```shell
npm exec -c oxygen-preview
```
