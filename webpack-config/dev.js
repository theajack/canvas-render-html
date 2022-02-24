const path = require('path');
const {commonRules, resolve} = require('./rules');

module.exports = {
    mode: 'development',
    entry: path.resolve('./', 'public/main.ts'),
    output: {
        path: path.resolve('./', 'public'),
        filename: 'bundle.js'
    },
    node: {
        fs: 'empty',
    },
    resolve,
    devtool: 'eval-source-map',
    devServer: {
        contentBase: path.resolve('./', 'public'),
        historyApiFallback: true,
        inline: true,
        host: 'localhost',
        disableHostCheck: true,
        port: 8080,
        proxy: {
        },
    },
    module: {
        rules: commonRules
    }
};