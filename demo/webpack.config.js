const path = require('path');
const LiveReloadPlugin = require('live-reload-webpack-plugin');

const liveReloadPlugin = new LiveReloadPlugin();

module.exports = [
    {
        entry: './src/index.js',
        plugins: [liveReloadPlugin],
        output: {
            filename: 'main.js',
            path: path.resolve(__dirname, 'dist'),
        },
    },
    {
        entry: liveReloadPlugin.clientEntryFile(),
        output: {
            filename: 'main-livereload.js',
            path: path.resolve(__dirname, 'dist'),
        },
    }
];
