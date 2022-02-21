
const path = require('path');
module.exports = {
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ],

        alias: {
            '@src': path.resolve('./', 'src/'),
            '@packages': path.resolve('./', 'src/packages/'),
            '@adapter': path.resolve('./', 'src/adapter/'),
            '@types': path.resolve('./', 'src/types/'),
        }
    },
    commonRules: [{
        test: /(.ts)$/,
        use: {
            loader: 'ts-loader'
        }
    }, {
        test: /(.js)$/,
        use: [{
            loader: 'babel-loader',
        }]
    }, {
        test: /(.js)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        exclude: /node_modules/,
        options: {
            configFile: './.eslintrc.js'
        }
    }],
    cssRules: [{
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
    }, {
        test: /\.less$/,
        use: [ 'style-loader', 'css-loader',  'less-loader'],
    }],
};