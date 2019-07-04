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

    let templateContext = contextOpts

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

      let changelogFileIn = path.resolve(__dirname, infile)
      let changelogFileOut = changelogFileIn

      changelogStream
        .pipe(fs.createWriteStream(changelogFileIn))
        .on('finish', () => {
          resolve(generateHeader(changelogFileOut))
        })
      changelogStream.on('error', reject)
      // resolve(changelogStream)
    })
  }

  // async writeChangelog () {
  //   const generateHeader = require('./changelog/headerchangelog')
  //   const { infile } = this.options
  //   let { changelog } = this.config.getContext()
  //   let changelogFileOut = path.resolve(__dirname, infile)

  //   let hasInfile = false;
  //   try {
  //     fs.accessSync(infile);
  //     hasInfile = true;
  //   } catch (err) {
  //     this.debug(err);
  //   }

  //   if (!hasInfile) {
  //     changelog = await this.getChangelog()
  //     // changelog = await this.getChangelog({ releaseCount: 0 })
  //     this.debug({ changelog });
  //   }

  //   // await new Promise((resolve, reject) => {
  //   //   // prependFile(infile, changelog + EOL + EOL, err => {
  //   //   //   if (err) return reject(err);
  //   //   //   resolve();
  //   //   // })
  //   //   // changelog.on('finish', () => {
  //   //   //   console.log('>>> Write Changelog', changelogFileOut)
  //   //   //   resolve(generateHeader(changelogFileOut))
  //   //   // })
  //   //   // resolve(generateHeader(changelog))
  //   //   // changelog.on('finish', () => {
  //   //   //   console.log('>>> Finish')
  //   //   // })
  //   // })

  //   if (!hasInfile) {
  //     await this.exec(`git add ${infile}`);
  //   }
  // }

  async beforeRelease () {
    const { infile } = this.options
    const { isDryRun } = this.global
    const changelog = await this.generateChangelog({ releaseCount: 0 })
    // console.log('>>> await changelog :', changelog)
    this.debug({ changelog })
    this.config.setContext({ changelog })

    this.log.exec(`Writing changelog to ${infile}`, isDryRun)

    // if (infile && !isDryRun) {
    //   await this.writeChangelog()
    // }
  }
}

module.exports = CustomChangelog
