'use strict'

const conventionalChangelog = require('conventional-changelog')
const fs = require('fs')
const path = require('path')
const process = require('child_process')

const contextOpts = require('./contextchangelog')
const config = require('./configchangelog')
const generateHeader = require('./headerchangelog')

const gitRawCommitsOpts = Object.assign({}, config.gitRawCommitsOpts)

let changelogFileIn = path.resolve(__dirname, '../CHANGELOG.md')
let changelogFileOut = changelogFileIn

let templateContext = contextOpts
let options = {
  releaseCount: 0,
  config: config
}

let changelogStream = conventionalChangelog(
  options,
  templateContext,
  gitRawCommitsOpts,
  config.parserOpts,
  config.writerOpts
).on('error', err => {
  if (err) throw err
  process.exit(1)
})

changelogStream
  .pipe(fs.createWriteStream(changelogFileOut))
  .on('finish', () => {
    generateHeader(changelogFileOut)
  })
