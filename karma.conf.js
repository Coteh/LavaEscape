process.env.CHROME_BIN = require('puppeteer').executablePath();

module.exports = function (config) {
    config.set({
        frameworks: ['mocha', 'karma-typescript'],
        files: ['test/**/*.spec.ts', 'test/scenes/*.ts', 'src/**/*.ts'],
        exclude: ['src/game.ts'],
        preprocessors: {
            '**/*.ts': ['karma-typescript'],
        },
        reporters: ['spec', 'junit', 'karma-typescript'],
        browsers: [
            process.env.TEST_TYPE === 'view' ? 'Chrome' : 'ChromeHeadless',
        ],
        junitReporter: {
            outputDir: process.env.JUNIT_REPORT_PATH,
            outputFile: process.env.JUNIT_REPORT_NAME,
            useBrowserName: false,
        },
        client: {
            mocha: {
                timeout: 10000,
            },
        },
        karmaTypescriptConfig: {
            tsconfig: './tsconfig.json',
        },
    });
};
