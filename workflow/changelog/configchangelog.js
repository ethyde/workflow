'use strict'

const fs = require('fs')
const path = require('path')
const pkg = require(path.join(__dirname, '../../package.json'))

const parserOpts = {
  headerPattern: /^(\w*)(?:\((.*)\))?: (.*)$/,
  headerCorrespondence: ['type', 'scope', 'subject'],
  referenceActions: [
    'close',
    'closes',
    'closed',
    'fix',
    'fixes',
    'fixed',
    'resolve',
    'resolves',
    'resolved',
    'recette',
    'production'
  ],
  issuePrefixes: pkg.issuesPrefix,
  noteKeywords: ['BREAKING CHANGE'],
  revertPattern: /^revert:\s([\s\S]*?)\s*This reverts commit (\w*)\./,
  revertCorrespondence: ['header', 'hash']
}

const writerOpts = {
  transform: function (commit, context) {
    // make it false to prevent filter out some Changelogs
    let discard = false

    commit.notes.forEach(function (note) {
      note.title = 'BREAKING CHANGES'
      discard = false
    })

    if (commit.type === 'feat') {
      commit.type = 'Features'
    } else if (commit.type === 'fix') {
      commit.type = 'Bug Fixes'
    } else if (commit.type === 'perf') {
      commit.type = 'Performance Improvements'
    } else if (commit.type === 'revert') {
      commit.type = 'Reverts'
    } else if (discard) {
      return
    } else if (commit.type === 'docs') {
      commit.type = 'Documentation'
    } else if (commit.type === 'style') {
      commit.type = 'Styles'
    } else if (commit.type === 'refactor') {
      commit.type = 'Code Refactoring'
    } else if (commit.type === 'test') {
      commit.type = 'Tests'
    } else if (commit.type === 'build') {
      commit.type = 'Build'
    } else if (commit.type === 'chore') {
      commit.type = 'Chore'
    }

    // If commit type not match regex, filter out
    if (commit.type === null) {
      return
    }

    if (commit.scope === '*') {
      commit.scope = ''
    }

    if (typeof commit.hash === 'string') {
      commit.hash = commit.hash.substring(0, 7)
    }

    if (typeof commit.subject === 'string') {
      // Do some thing with git subjet
      // Source : https://community.atlassian.com/t5/Bitbucket-questions/Regex-pattern-to-match-JIRA-issue-key/qaq-p/233319#M23571
      const jiraMatcher = /((?!([A-Z0-9a-z]{1,10})-?$)[A-Z]{1}[A-Z0-9]+-\d+)/g
      let url = context.issue
        ? context.issue
        : `${context.host}/${context.owner}/${context.repository}`
      if (url) {
        // url = `${url}/issues/`
        // Issue URLs.
        commit.subject = commit.subject.replace(jiraMatcher, (_, issue) => {
          return `[${issue}](${url}/${issue})`
        })
      }
    }

    // remove references that already appear in this commit subject
    // but keep reference for other issues
    if (commit.references.length > 1) {
      commit.references = commit.references.filter(reference => {
        return reference.action !== null
      })
    }

    return commit
  },
  groupBy: 'type',
  commitGroupsSort: 'title',
  commitsSort: ['scope', 'type'],
  noteGroupsSort: 'title',
  mainTemplate: fs.readFileSync(
    path.join(__dirname, './templates/template.hbs'),
    'utf8'
  ),
  headerPartial: fs.readFileSync(
    path.join(__dirname, './templates/header.hbs'),
    'utf8'
  ),
  commitPartial: fs.readFileSync(
    path.join(__dirname, './templates/commit.hbs'),
    'utf8'
  ),
  footerPartial: fs.readFileSync(
    path.join(__dirname, './templates/footer.hbs'),
    'utf8'
  )
}

module.exports = { parserOpts, writerOpts }
