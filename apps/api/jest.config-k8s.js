module.exports = {
  displayName: 'api-steps',
  collectCoverage: false,
  preset: '../../jest.preset.js',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  testEnvironment: 'node',
  testEnvironmentOptions: {
    '--require': 'dotenv/config',
  },
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test|ext-spec|k8s-spec).[jt]s?(x)',
  ],
};
