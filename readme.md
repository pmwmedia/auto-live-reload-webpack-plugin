# Auto Live Reload Webpack Plugin

[![npm](https://img.shields.io/npm/v/auto-live-reload-webpack-plugin.svg)](https://npmjs.com/package/auto-live-reload-webpack-plugin)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Build](https://github.com/pmwmedia/auto-live-reload-webpack-plugin/actions/workflows/build.yaml/badge.svg)](https://github.com/pmwmedia/auto-live-reload-webpack-plugin/actions/workflows/build.yaml)

This Webpack plugin can be used to reload the web page automatically when Webpack recompiled any bundle like HTML pages, JavaScript, or stylesheets. It works even on any custom server. DevServer is not required. The plugin is especially helpful when running Webpack in watch mode.

## Install

```bash
npm i --save-dev auto-live-reload-webpack-plugin
```

```bash
yarn add --dev auto-live-reload-webpack-plugin
```

## Options

| Option    | Values                            | Default     |
|-----------|-----------------------------------|-------------|
| `host`    | host name or IP address as string | `localhost` |
| `port`    | any number between 0 - 65,535     | `0`         |
| `enabled` | `true` or `false`                 | `true`      |

### Host

The host can be any legal host name or IP address. If you run your server and client on the same machine, you can keep the default value `localhost`.

### Port

The port can be any legal port number between 0 - 65,535. If set `0` as port, a random available port will be used.

### Enabled

By default, live reloading is enabled. If `enabled` is explicitly set to `false`, the plugin creates live reload files with a no-op. This means that the live reload files are present, but will not trigger any reloads. This can be helpful if you don't need live reloads, but your server requires that the files are present and contain valid JavaScript.

## Getting Started

1. Install the plugin:

```bash
npm i --save-dev auto-live-reload-webpack-plugin
```

```bash
yarn add --dev auto-live-reload-webpack-plugin
```

2. Add the plugin to your entry point in `webpack.config.js` or `webpack.config.ts`:

```javascript
const path = require('path');
const AutoLiveReloadPlugin = require('auto-live-reload-webpack-plugin');

const autoAutoLiveReloadPlugin = new AutoLiveReloadPlugin({ /* place your options here */ });

module.exports = {
  entry: './src/index.js',
  plugins: [autoAutoLiveReloadPlugin],
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
```

3. Add an entry point for the live reload bundles, which can be served by your custom server:

```javascript
const path = require('path');
const AutoLiveReloadPlugin = require('auto-live-reload-webpack-plugin');

const autoAutoLiveReloadPlugin = new AutoLiveReloadPlugin();

module.exports = [
  {
    entry: './src/index.js',
    plugins: [autoAutoLiveReloadPlugin],
    output: {
      filename: 'main.js',
      path: path.resolve(__dirname, 'dist'),
    },
  },
  {
    entry: autoAutoLiveReloadPlugin.clientEntryFile(),
    output: {
      filename: 'main-livereload.js',
      path: path.resolve(__dirname, 'dist'),
    },
  }
];
```

4. Add both `main.js` and `main-livereload.js` to your server. Both bundles have to inserted into your HTML page. `main.js` contains all your business logic and `main-livereload.js` contains only a few lines for the live reload logic.

For each bundle that should support live reload, a separate instance of `AutoLiveReloadPlugin` and a separate entry point for `autoAutoLiveReloadPlugin.clientEntryFile()` are required.

## Credits

Inspired by the awesome [zsimo/handmade-livereload-webpack-plugin](https://github.com/zsimo/handmade-livereload-webpack-plugin), enhanced and redeveloped in Typescript by [Martin Winandy](https://github.com/pmwmedia).
