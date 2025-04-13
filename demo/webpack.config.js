const path = require('path')
const AutoLiveReloadPlugin = require('auto-live-reload-webpack-plugin')

const autoLiveReloadPlugin = new AutoLiveReloadPlugin()

module.exports = [
  {
    entry: ['./src/index.js', autoLiveReloadPlugin.clientEntryFile()],
    plugins: [autoLiveReloadPlugin],
    output: {
      filename: 'index.js',
      path: path.resolve(__dirname, 'dist'),
    },
  },
]
