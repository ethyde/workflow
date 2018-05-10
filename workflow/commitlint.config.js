'use strict'

const path = require('path')
const pkg = require(path.join(__dirname, '../package.json'))

const commitlintConfig = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'references-empty': [1, 'never'],
    'scope-empty': [1, 'never']
  },
  parserPreset: {
    parserOpts: {
      issuePrefixes: pkg.issuesPrefix
    }
  }
}

module.exports = commitlintConfig
