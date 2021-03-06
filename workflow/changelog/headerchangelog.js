'use strict'

const fs = require('fs')
const spawn = require('child_process').spawn

const header = `# Changelog
All notable changes to this project will be documented in this file.

The format of this CHANGELOG are based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
\n`

const getDate = new Date()

const thisYear = getDate.getFullYear()
let thisMonth = getDate.getMonth() + 1
let thisDay = getDate.getDate()

if (thisDay < 10) {
  thisDay = `0${thisDay}`
}
if (thisMonth < 10) {
  thisMonth = `0${thisMonth}`
}

let thereIsUnpsuhed = false

const generateHeader = (stream) => {
  // let changelogFileIn = path.resolve(__dirname, '../../CHANGELOG.md')
  const unpushedfile = spawn('git', [
    'log',
    '--branches',
    '--not',
    'master',
    '--remotes',
    '--graph',
    '--abbrev-commit',
    '--pretty=format:"**%h** -%d %s (%cr) &lt;%an&gt;"'
  ])

  const changelogfile = fs.readFileSync(stream, 'utf8', (err) => {
    if (err) throw err
  })

  const dateUnrealease = `${thisYear}-${thisMonth}-${thisDay}`

  let unpushHeader = `## [Unreleased/Unpushed] (${dateUnrealease})\n`

  unpushedfile.stdout.on('data', function (unpushed) {
    const completChangelog = `${header}${unpushHeader}${unpushed}${changelogfile}`
    fs.writeFileSync(stream, completChangelog, 'utf8', (err) => {
      if (err) throw err
    })
    thereIsUnpsuhed = true
  })

  unpushedfile.on('close', function (code) {
    if (thereIsUnpsuhed !== true) {
      unpushHeader = `## There is no Unpushed/Unreleased work - (${dateUnrealease})`
      const completChangelog = `${header}${unpushHeader}${changelogfile}`
      fs.writeFileSync(stream, completChangelog, 'utf8', (err) => {
        if (err) throw err
      })
    }
  })
}

module.exports = generateHeader
