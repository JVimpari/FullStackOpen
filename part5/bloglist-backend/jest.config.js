module.exports = {
    testEnvironment: 'node',
    testMatch: [
        '**/*tests*'
    ],
    setupFilesAfterEnv: [
        './tests/setup.js'
    ],
    coverageDirectory: './tests/coverage',
    collectCoverageFrom: [
        '**/controllers/**',
        '**/models/**',
        '**/utils/**',
        '**/app.js',
        '!**/utils/list_helper.js',
        '!**/utils/config.js'
    ]
}