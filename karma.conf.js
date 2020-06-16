process.env.CHROME_BIN = require('puppeteer').executablePath();

function getSpecs(specList) {
    if (specList) {
        return specList.split(',');
    }
    return ['test/*.spec.ts'];
}

module.exports = function (config) {
    config.set({
        frameworks: ['mocha', 'karma-typescript'],
        files: ['test/lib/*.ts', 'test/scenes/*.ts', 'src/**/*.ts'].concat(
            getSpecs(process.env.SPEC_LIST)
        ),
        exclude: ['src/game.ts', 'test/test.ts'],
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
