module.exports = {
  extends: ['@remix-run/eslint-config'],
  parserOptions: {
    // eslint-disable-next-line
    tsconfigRootDir: __dirname,
    project: './tsconfig.json',
  },
  rules: {},
}
