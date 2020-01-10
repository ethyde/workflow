#!/usr/bin/env node
'use strict'

const spawn = require('child_process').spawn
const fs = require('fs')
const path = require('path')

const pkg = require(path.join(__dirname, '../package.json'))

// Because short commit message are not in `.git/COMMIT_EDITMSG`,
// but in `.git/COMMIT_EDITMSG message`. this not trigger commit parsing
const messageFile = process.env.HUSKY_GIT_PARAMS

/*
  If Branch are not Master or Develop
  If message title:
    * Doesn't start with Merge branch
    * Doesn't start with Merge pull request
  Your Branch name must follow this Branc Naming Template
  type-scope/JIRA-000/subject-separated-by-dash

  Commit Message Template :
  type(scope): [JIRA-XXX] subject
  type according to https://github.com/marionebl/commitlint/tree/master/%40commitlint/config-conventional#type-enum
  (scope) see for more info about scope : https://gist.github.com/stephenparish/9941e89d80e2bc58a153#allowed-scope http://karma-runner.github.io/2.0/dev/git-commit-msg.html https://gist.github.com/Linell/bd8100c4e04348c7966d#file-git-commit-template-txt-L15
  [JIRA-XXX] Jira issue where XXX are a number
  subject same has scope

  Commit subject should become :
  type(scope): [JIRA-000] subject separated by dash
*/

const startsWithMergeBranch = str => str.indexOf('Merge branch') === 0
const startsWithMergePR = str => str.indexOf('Merge pull request') === 0
const areNotMergeOrPullRequestBranch = str =>
  !startsWithMergeBranch(str) && !startsWithMergePR(str)

const tagList = pkg.issuesPrefix

const getSubjectCommitFromBranchName = currentBranchName => {
  const splitBrancName = currentBranchName.split('/')
  const tagListLength = tagList.length
  const typeScope = splitBrancName[0].split('-')

  const type = typeScope[0]
  const scope =
    typeof typeScope[1] !== 'undefined' ? `(${typeScope[1].toLowerCase()})` : ''

  const issue = splitBrancName[1]
  const subject = splitBrancName[2]

  let subjectString = `${type}${scope}:`

  for (let index = 0; index < tagListLength; index++) {
    const brandTag = tagList[index]
    const matched = issue.match(new RegExp(`^${brandTag}\\d+`, 'i'))
    if (matched !== null) {
      subjectString += ` ${matched} `
    }
  }

  subjectString += subject
    .toLowerCase()
    .split('_')
    .join(' ')
    .trim()

  return subjectString
}

if (fs.existsSync(messageFile)) {
  const message = fs.readFileSync(messageFile, 'utf8')
  const messagetpl = fs.readFileSync(
    path.join(__dirname, '/GITMESSAGE_TEMPLATE.txt'),
    'utf8'
  )
  const messageTitle = message.split('\n')[0]

  const branchName = spawn('git', [
    'rev-parse',
    '--abbrev-ref',
    'HEAD'
  ])

  branchName.stdout.on('data', function (data) {
    const branchAreMasterOrDevelop = `${data}`.match(/(master|develop)/)
    const messageLines = message.split('\n')

    if (
      !branchAreMasterOrDevelop &&
      areNotMergeOrPullRequestBranch(messageTitle)
    ) {
      const branchToSubjectName = getSubjectCommitFromBranchName(`${data}`)
      messageLines[0] = `${branchToSubjectName}${messagetpl}`
    } else {
      messageLines[0] = `${messagetpl}`
    }
    fs.writeFileSync(messageFile, messageLines.join('\n'), 'utf8')
  })
}
