module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/*.test.ts'],
    modulePaths: ['<rootDir>/src'],
    setupFiles: ['<rootDir>/tests/setup.ts'],
};