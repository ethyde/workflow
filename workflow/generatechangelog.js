const { Plugin } = require('release-it')
const semver = require('semver')
const conventionalChangelog = require('conventional-changelog')
const conventionalRecommendedBump = require('conventional-recommended-bump')
const fs = require('fs')
const path = require('path')

class CustomChangelog extends Plugin {
  static disablePlugin () {
    return 'version'
  }

  getIncrementedVersion ({
    latestVersion, increment, isPreRelease, preReleaseId
  }) {
    this.debug({ latestVersion, increment, isPreRelease, preReleaseId })
    return new Promise((resolve, reject) => {
      conventionalRecommendedBump(this.options, (err, result) => {
        this.debug({ err, result })
        if (err) return reject(err)
        let { releaseType } = result
        if (increment) {
          this.log.warn(
            `Recommended bump is "${releaseType}", but is overridden with "${increment}".`
          )
          releaseType = increment
        }
        if (increment && semver.valid(increment)) {
          resolve(increment)
        } else if (releaseType) {
          const type = isPreRelease ? `pre${releaseType}` : releaseType
          resolve(semver.inc(latestVersion, type, preReleaseId))
        } else {
          resolve(null)
        }
      })
    })
  }

  getChangelogStream (options = {}) {
    const contextOpts = require('./changelog/contextchangelog')
    const config = require('./changelog/configchangelog')

    const gitRawCommitsOpts = Object.assign({}, config.gitRawCommitsOpts)

    const templateContext = contextOpts

    options = Object.assign(options, {
      config: config
    })

    return conventionalChangelog(
      options,
      templateContext,
      gitRawCommitsOpts,
      config.parserOpts,
      config.writerOpts
    )
  }

  generateChangelog (options) {
    return new Promise((resolve, reject) => {
      const generateHeader = require('./changelog/headerchangelog')
      const { infile } = this.options
      const changelogStream = this.getChangelogStream(options)

      const changelogFileIn = path.resolve(__dirname, infile)
      const changelogFileOut = changelogFileIn

      changelogStream
        .pipe(fs.createWriteStream(changelogFileIn))
        .on('finish', () => {
          resolve(generateHeader(changelogFileOut))
        })
      changelogStream.on('error', reject)
    })
  }

  async beforeRelease () {
    const { infile } = this.options
    const { isDryRun } = this.config.isDryRun
    const changelog = await this.generateChangelog({ releaseCount: 0 })
    this.debug({ changelog })
    this.config.setContext({ changelog })

    this.log.exec(`Writing changelog to ${infile}`, isDryRun)
  }
}

module.exports = CustomChangelog
