const path = require('path');
const webpack = require('webpack');
const package = require('./package.json');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (env) => {
    const isDev = env.NODE_ENV === 'dev';
    const isTest = env.NODE_ENV === 'test';

    return {
        entry: isTest ? './test/test.ts' : './src/game.ts',
        mode: isDev ? 'development' : 'production',
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'bundle.js',
        },
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    use: [
                        {
                            loader: 'ts-loader',
                        },
                    ],
                    exclude: /node_modules/,
                },
            ],
        },
        devServer: {
            static: {
                directory: path.resolve(__dirname, './dist'),
            },
            host: '0.0.0.0',
            port: 8080,
            open: true,
        },
        resolve: {
            extensions: ['.ts', '.js'],
            alias: {
                phaser: path.resolve(
                    __dirname,
                    'node_modules/phaser/dist/phaser.js'
                ),
            },
        },
        plugins: [
            new webpack.DefinePlugin({
                IS_DEBUG: JSON.stringify(isDev),
                GAME_VERSION: JSON.stringify(package.version),
                TEST_SCENE: `\"${env.TEST_SCENE}\"`, // TODO: only define this in test
            }),
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: 'assets/img/**',
                        to: '.',
                        globOptions: {
                            ignore: ['**/*.xcf', '**/*.inkscape.svg'],
                        },
                    },
                    { from: 'index.html', to: '.' },
                ],
            }),
        ],
    };
};
