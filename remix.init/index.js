const { execSync } = require('child_process')
const crypto = require('crypto')
const fs = require('fs/promises')
const path = require('path')

const toml = require('@iarna/toml')
const sort = require('sort-package-json')

function escapeRegExp(string) {
  // $& means the whole matched string
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function getRandomString(length) {
  return crypto.randomBytes(length).toString('hex')
}

async function main({ rootDirectory }) {
  const README_PATH = path.join(rootDirectory, 'README.md')
  const WRANGLER_TOML_PATH = path.join(rootDirectory, 'wrangler.toml')
  const EXAMPLE_ENV_PATH = path.join(rootDirectory, '.env.example')
  const ENV_PATH = path.join(rootDirectory, '.env')
  const PACKAGE_JSON_PATH = path.join(rootDirectory, 'package.json')

  const REPLACER = 'ar1-remix-boilerplate'

  const DIR_NAME = path.basename(rootDirectory)
  const APP_NAME = DIR_NAME

  const [prodContent, readme, env, packageJson] = await Promise.all([
    fs.readFile(WRANGLER_TOML_PATH, 'utf-8'),
    fs.readFile(README_PATH, 'utf-8'),
    fs.readFile(EXAMPLE_ENV_PATH, 'utf-8'),
    fs.readFile(PACKAGE_JSON_PATH, 'utf-8'),
  ])

  const newEnv = env.replace(
    /^SESSION_SECRET=.*$/m,
    `SESSION_SECRET="${getRandomString(16)}"`,
  )

  const prodToml = toml.parse(prodContent)
  prodToml.name = prodToml.name.replace(REPLACER, APP_NAME)

  const newReadme = readme.replace(
    new RegExp(escapeRegExp(REPLACER), 'g'),
    APP_NAME,
  )

  const newPackageJson =
    JSON.stringify(
      sort({ ...JSON.parse(packageJson), name: APP_NAME }),
      null,
      2,
    ) + '\n'

  await Promise.all([
    fs.writeFile(WRANGLER_TOML_PATH, toml.stringify(prodToml)),
    fs.writeFile(README_PATH, newReadme),
    fs.writeFile(ENV_PATH, newEnv),
    fs.writeFile(PACKAGE_JSON_PATH, newPackageJson),
  ])

  console.log(`✅  Project is ready! Start development with "npm run dev"`)
}

module.exports = main
