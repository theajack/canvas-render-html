const path = require('path');
const {commonRules, resolve} = require('./rules');

module.exports = () => {
    return {
        mode: 'production',
        entry: path.resolve('./', 'src/index.ts'),
        output: {
            path: path.resolve('./', 'npm'),
            filename: 'canvas-render-html.min.js',
            library: 'RenderHTML',
            libraryTarget: 'umd',
            libraryExport: 'default',
            globalObject: 'this',
        },
        node: {
            fs: 'empty',
        },
        resolve,
        externals: {},
        module: {
            rules: commonRules
        }
    };
};