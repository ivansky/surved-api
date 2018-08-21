const path = require('path');
const fs = require('fs');
const nodeModules = {};

fs.readdirSync('node_modules')
    .filter(function(x) {
        return ['.bin', '.cache', '@types'].indexOf(x) === -1;
    })
    .forEach(function(mod) {
        nodeModules[mod] = 'commonjs ' + mod;
    });

module.exports = {
    mode: 'development',
    devtool: 'source-map',
    entry: path.resolve(__dirname, 'src', 'server.ts'),
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'server.js',
    },
    resolve: {
        extensions: [
            '.ts'
        ],
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'ts-loader',
            },
        ],
    },
    target: 'node',
    externals: nodeModules,
};
