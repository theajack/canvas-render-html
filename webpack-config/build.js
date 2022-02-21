const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const {commonRules, resolve} = require('./rules');

module.exports = () => {
    return {
        mode: 'production',
        entry: path.resolve('./', 'src/index.ts'),
        output: {
            path: path.resolve('./', 'npm'),
            filename: 'ebuild-cli.min.js',
            library: 'ebuildTest',
            libraryTarget: 'umd',
            libraryExport: 'default',
            globalObject: 'this',
        },
        resolve,
        externals: {},
        module: {
            rules: commonRules
        },
        plugins: [
            new CopyWebpackPlugin({
                patterns: [
                    {from: 'src/index.d.ts', to: 'ebuild-cli.min.d.ts'},
                    {from: 'src/type.d.ts'},
                    {from: 'README.cn.md'},
                    {from: 'README.md'},
                    {from: 'LICENSE'}
                ]
            })
        ]
    };
};