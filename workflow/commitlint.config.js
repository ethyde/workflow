'use strict'

const commitlintConfig = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'references-empty': [1, 'never'],
    'scope-empty': [1, 'never']
  },
  parserPreset: {
    parserOpts: {
      issuePrefixes: [
        `DFP-`,
        `TRANS-`,
        `TELOIS-`,
        `FAC-`,
        `FACV-`,
        `NEON-`,
        `VOI-`,
        `GAL-`,
        `CAM-`,
        `CAC-`,
        `CAP-`,
        `BEA-`,
        `PTC-`,
        `CTV-`,
        `JIRA-`
      ]
    }
  }
}

module.exports = commitlintConfig
