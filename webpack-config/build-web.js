const path = require('path');
const {commonRules, cssRules, resolve} = require('./rules');

module.exports = () => {
    return {
        mode: 'production',
        entry: path.resolve('./', 'public/main.ts'),
        output: {
            path: path.resolve('./', 'public'),
            filename: 'index.min.js',
        },
        resolve,
        externals: {},
        module: {
            rules: commonRules.concat(cssRules)
        }
    };
};