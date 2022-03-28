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
