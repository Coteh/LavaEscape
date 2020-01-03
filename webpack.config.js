var path = require('path');
var pathToPhaser = path.join(__dirname, '/node_modules/phaser/');
var phaser = path.join(pathToPhaser, 'dist/phaser.js');
var webpack = require("webpack");

module.exports = env => {
    var isDebug = (env && env.NODE_ENV === "dev");

    return {
        entry: './src/game.ts',
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'bundle.js',
        },
        module: {
            rules: [
                { test: /\.ts$/, loader: 'ts-loader', exclude: '/node_modules/' }
            ]
        },
        devServer: {
            contentBase: path.resolve(__dirname, './'),
            publicPath: '/dist/',
            host: '127.0.0.1',
            port: 8080,
            open: true
        },
        resolve: {
            extensions: ['.ts', '.js'],
            alias: {
                phaser: phaser
            }
        },
        plugins: [
            new webpack.DefinePlugin({
                'process.env.IS_DEBUG': JSON.stringify(isDebug)
            })
        ],
    };
}
