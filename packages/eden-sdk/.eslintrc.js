module.exports = {
  ...require('@edenlabs/config/eslint-sdk'),
  parserOptions: {
    root: true,
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.lint.json'],
  },
}
