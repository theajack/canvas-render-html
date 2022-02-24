const path = require('path');
const fs = require('fs');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const {commonRules, resolve} = require('./rules');

const pkg = require('../package.json');

function genePackageJson () {
    const newPackage = {};

    [
        'name', 'version', 'description', 'main', 'unpkg', 'jsdelivr',
        'typings', 'author', 'repository', 'keywords', 'license',
        'dependencies'
    ].forEach(key => {
        newPackage[key] = pkg[key];
    });

    fs.writeFileSync(
        path.resolve('./npm/package.json'),
        JSON.stringify(newPackage, null, 4),
        {
            encoding: 'utf-8'
        }
    );
}
module.exports = () => {
    genePackageJson();
    return {
        mode: 'production',
        entry: path.resolve('./', 'src/index.ts'),
        output: {
            path: path.resolve('./', 'npm'),
            filename: 'index.min.js',
            library: 'RenderHTML',
            libraryTarget: 'umd',
            libraryExport: 'default',
            globalObject: 'this',
        },
        node: {
            fs: 'empty',
        },
        resolve,
        externals: {
            'css': 'css',
            'htmlparser2': 'htmlparser2',
            'pixi.js': 'pixi.js',
            'tc-event': 'tc-event',
        },
        module: {
            rules: commonRules
        },
        plugins: [
            new CopyWebpackPlugin({
                patterns: [
                    {from: 'src/types', to: 'types'},
                    {from: 'README.md'},
                    {from: 'LICENSE'}
                ]
            })
        ]
    };
};