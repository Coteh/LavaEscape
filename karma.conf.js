process.env.CHROME_BIN = require('puppeteer').executablePath();

module.exports = function (config) {
    config.set({
        frameworks: ['mocha', 'karma-typescript'],
        files: ['test/**/*.spec.ts', 'test/scenes/*.ts', 'src/**/*.ts'],
        preprocessors: {
            '**/*.ts': ['karma-typescript'],
        },
        reporters: ['spec', 'junit', 'karma-typescript'],
        browsers: ['ChromeHeadless'],
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
