const path = require('path')
const AutoLiveReloadPlugin = require('auto-live-reload-webpack-plugin')

const autoLiveReloadPlugin = new AutoLiveReloadPlugin()

module.exports = [
  {
    entry: './src/index.js',
    plugins: [autoLiveReloadPlugin],
    output: {
      filename: 'main.js',
      path: path.resolve(__dirname, 'dist'),
    },
  },
  {
    entry: autoLiveReloadPlugin.clientEntryFile(),
    output: {
      filename: 'main-livereload.js',
      path: path.resolve(__dirname, 'dist'),
    },
  },
]
