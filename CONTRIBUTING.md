
# Project Guidelines &middot; [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://<url-where-make-pr-for-this-project>)
> While developing a new project is like rolling on a green field for you, maintaining it is a potential dark twisted nightmare for someone else.
Here's a list of guidelines we've found, written and gathered that (we think) works really well with most JavaScript projects here at [brand](http://www.brand-url.com).
- [Git](#git)
    - [Some Git rules](#some-git-rules)
    - [Git workflow](#git-workflow)
    - [Writing good commit messages](#writing-good-commit-messages)
- [Documentation](#documentation)
- [Environments](#environments)
    - [Consistent dev environments](#consistent-dev-environments)
    - [Consistent dependencies](#consistent-dependencies)
- [Dependencies](#dependencies)
- [Testing](#testing)
- [Structure and Naming](#structure-and-naming)
- [Code style](#code-style)
    - [Some code style guidelines](#code-style-check)
    - [Enforcing code style standards](#enforcing-code-style-standards)
- [Logging](#logging)

<a name="git"></a>
## 1. Git

![Git](/images/branching.png)

<a name="some-git-rules"></a>
### 1.1 Some Git rules

There are a set of rules to keep in mind:
* Perform work in a feature branch.

    _Why:_
    >Because this way all work is done in isolation on a dedicated branch rather than the main branch. It allows you to submit multiple pull requests without confusion. You can iterate without polluting the master branch with potentially unstable, unfinished code. [read more...](https://www.atlassian.com/git/tutorials/comparing-workflows#feature-branch-workflow)

* Branch out from `develop`

    _Why:_
    >This way, you can make sure that code in master will almost always build without problems, and can be mostly used directly for releases (this might be overkill for some projects).

* Never push into `develop` or `master` branch. Make a Pull Request.

    _Why:_
    > It notifies team members that they have completed a feature. It also enables easy peer-review of the code and dedicates forum for discussing the proposed feature.

* [Commit Often, Perfect Later, Publish Once](https://sethrobertson.github.io/GitBestPractices/)

* Update your local `develop` branch and do an interactive rebase before pushing your feature and making a Pull Request.

    _Why:_
    > Rebasing will merge in the requested branch (`master` or `develop`) and apply the commits that you have made locally to the top of the history without creating a merge commit (assuming there were no conflicts). Resulting in a nice and clean history. [read more ...](https://www.atlassian.com/git/tutorials/merging-vs-rebasing)

* Resolve potential conflicts while rebasing and before making a Pull Request.

* Delete local and remote feature branches after merging.

    _Why:_
    > It will clutter up your list of branches with dead branches. It ensures you only ever merge the branch back into (`master` or `develop`) once. Feature branches should only exist while the work is still in progress.

* Before making a Pull Request, make sure your feature branch builds successfully and passes all tests (including code style checks).

    _Why:_
    > You are about to add your code to a stable branch. If your feature-branch tests fail, there is a high chance that your destination branch build will fail too. Additionally, you need to apply code style check before making a Pull Request. It aids readability and reduces the chance of formatting fixes being mingled in with actual changes.

* Use [this](./.gitignore) `.gitignore` file.

    _Why:_
    > It already has a list of system files that should not be sent with your code into a remote repository. In addition, it excludes setting folders and files for most used editors, as well as most common dependency folders.

* Protect your `develop` and `master` branch.

    _Why:_
    > It protects your production-ready branches from receiving unexpected and irreversible changes. read more... [Github](https://help.github.com/articles/about-protected-branches/), [Bitbucket](https://confluence.atlassian.com/bitbucketserver/using-branch-permissions-776639807.html) and [GitLab](https://docs.gitlab.com/ee/user/project/protected_branches.html)

<a name="git-workflow"></a>
### 1.2 Git workflow

Because of most of the reasons above, we use [Feature-branch-workflow](https://www.atlassian.com/git/tutorials/comparing-workflows#feature-branch-workflow) with [Interactive Rebasing](https://www.atlassian.com/git/tutorials/merging-vs-rebasing#the-golden-rule-of-rebasing) and some elements of [Gitflow](https://www.atlassian.com/git/tutorials/comparing-workflows#gitflow-workflow) (naming and having a develop branch). The main steps are as follows:

* For a new project, initialize a git repository in the project directory. __For subsequent features/changes this step should be ignored__.

   ```sh
   cd <project directory>
   git init
   ```

* Checkout a new feature/bug-fix branch.

    ```sh
    git checkout -b <branchname>
    ```

* Make Changes.

    ```sh
    git add
    git commit -a
    ```

    _Why:_
    > `git commit -a` will start an editor which lets you separate the subject from the body. Read more about it in *section 1.3*.

* Sync with remote to get changes you’ve missed.

    ```sh
    git checkout develop
    git pull
    ```

    _Why:_
    > This will give you a chance to deal with conflicts on your machine while rebasing (later) rather than creating a Pull Request that contains conflicts.
    
* Update your feature branch with latest changes from develop by interactive rebase.

    ```sh
    git checkout <branchname>
    git rebase -i --autosquash develop
    ```

    _Why:_
    > You can use --autosquash to squash all your commits to a single commit. Nobody wants many commits for a single feature in develop branch. [read more...](https://robots.thoughtbot.com/autosquashing-git-commits)

* If you don’t have conflicts, skip this step. If you have conflicts, [resolve them](https://help.github.com/articles/resolving-a-merge-conflict-using-the-command-line/)  and continue rebase.

    ```sh
    git add <file1> <file2> ...
    git rebase --continue
    ```

* Push your branch. Rebase will change history, so you'll have to use `-f` to force changes into the remote branch. If someone else is working on your branch, use the less destructive `--force-with-lease`.

    ```sh
    git push -f
    ```

    _Why:_
    > When you do a rebase, you are changing the history on your feature branch. As a result, Git will reject normal `git push`. Instead, you'll need to use the -f or --force flag. [read more...](https://developer.atlassian.com/blog/2015/04/force-with-lease/)

* Make a Pull Request.
* Pull request will be accepted, merged and close by a reviewer.
* Remove your local feature branch if you're done.

    ```sh
    git branch -d <branchname>
    ```
    to remove all branches which are no longer on remote
    ```sh
    git fetch -p && for branch in `git branch -vv --no-color | grep ': gone]' | awk '{print $1}'`; do git branch -D $branch; done
    ```

<a name="writing-good-commit-messages"></a>
### 1.3 Writing good commit messages

Having a good guideline for creating commits and sticking to it makes working with Git and collaborating with others a lot easier. Here are some rules of thumb ([source](https://chris.beams.io/posts/git-commit/#seven-rules)):

 * Separate the subject from the body with a newline between the two.

    _Why:_
    > Git is smart enough to distinguish the first line of your commit message as your summary. In fact, if you try git shortlog, instead of git log, you will see a long list of commit messages, consisting of the id of the commit, and the summary only.

 * Limit the subject line to 50 characters and Wrap the body at 72 characters.

    _why_
    > Commits should be as fine-grained and focused as possible, it is not the place to be verbose. [read more...](https://medium.com/@preslavrachev/what-s-with-the-50-72-rule-8a906f61f09c)

 * Capitalize the subject line.
 * Do not end the subject line with a period.
 * Use [imperative mood](https://en.wikipedia.org/wiki/Imperative_mood) in the subject line.

    _Why:_
    > Rather than writing messages that say what a committer has done. It's better to consider these messages as the instructions for what is going to be done after the commit is applied on the repository. [read more...](https://news.ycombinator.com/item?id=2079612)

 * Use the body to explain **what** and **why** as opposed to **how**.

 <a name="documentation"></a>
## 2. Documentation

![Documentation](/images/documentation.png)

* Keep `README.md` updated as a project evolves.
* Comment your code. Try to make it as clear as possible what you are intending with each major section.
* Follow [ESDoc](https://esdoc.org/) or [JSDoc](http://usejsdoc.org/) comments conventions
* If there is an open discussion on github or stackoverflow about the code or approach you're using, include the link in your comment. 
* Don't use comments as an excuse for a bad code. Keep your code clean.
* Don't use clean code as an excuse to not comment at all.
* Keep comments relevant as your code evolves.

<a name="environments"></a>
## 3. Environments

![Environments](/images/laptop.png)

* Define separate `development`, `test` and `production` environments if needed.

    _Why:_
    > Different data, tokens, APIs, ports etc... might be needed in different environments. You may want an isolated `development` mode that calls fake API which returns predictable data, making both automated and manual testing much easier. Or you may want to enable Google Analytics only on `production` and so on. [read more...](https://stackoverflow.com/questions/8332333/node-js-setting-up-environment-specific-configs-to-be-used-with-everyauth)

* Load your deployment specific configurations from environment variables and never add them to the codebase as constants.

    _Why:_
    > You have tokens, passwords and other valuable information in there. Your config should be correctly separated from the app internals as if the codebase could be made public at any moment.

    _How:_
    >`.env` files to store your variables and add them to `.gitignore` to be excluded. Instead, commit a `.env.example`  which serves as a guide for developers. For production, you should still set your environment variables in the standard way. [read more](https://medium.com/@rafaelvidaurre/managing-environment-variables-in-node-js-2cb45a55195f)

* It’s recommended to validate environment variables before your app starts. [Look at this sample](./configWithTest.sample.js) using `joi` to validate provided values.

    _Why:_
    > It may save others from hours of troubleshooting.

<a name="consistent-dev-environments"></a>
### 3.1 Consistent dev environments:

* Set your node version in `engines` in `package.json`.

    _Why:_
    > It lets others know the version of node the project works on. [read more...](https://docs.npmjs.com/files/package.json#engines)

* Additionally, use `nvm` and create a  `.nvmrc`  in your project root. Don't forget to mention it in the documentation.

    _Why:_
    > Any one who uses `nvm` can simply use `nvm use` to switch to the suitable node version. [read more...](https://github.com/creationix/nvm)

* It's a good idea to setup a `preinstall` script that checks node and npm versions.

    _Why:_
    > Some dependencies may fail when installed by newer versions of npm.

* Use local modules instead of using globally installed modules.

    _Why:_
    > Lets you share your tooling with your colleague instead of expecting them to have it globally on their systems.

<a name="consistent-dependencies"></a>
### 3.2 Consistent dependencies:

* Make sure your team members get the exact same dependencies as you.

    _Why:_
    > Because you want the code to behave as expected and identical in any development machine [read more...](https://medium.com/@kentcdodds/why-semver-ranges-are-literally-the-worst-817cdcb09277)

    _how:_
    > Use `package-lock.json` on `npm@5` or higher

    _I don't have npm@5:_
    > Alternatively you can use `Yarn` and make sure to mention it in `README.md`. Your lock file and `package.json` should have the same versions after each dependency update. [read more...](https://yarnpkg.com/en/)

    _I don't like the name `Yarn`:_
    > Too bad. For older versions of `npm`, use `—save --save-exact` when installing a new dependency and create `npm-shrinkwrap.json` before publishing. [read more...](https://docs.npmjs.com/files/package-locks)

<a name="dependencies"></a>
## 4. Dependencies

![Github](/images/modules.png)

* Keep track of your currently available packages: e.g., `npm ls --depth=0`. [read more...](https://docs.npmjs.com/cli/ls)
* See if any of your packages have become unused or irrelevant: `depcheck`. [read more...](https://www.npmjs.com/package/depcheck)

    _Why:_
    > You may include an unused library in your code and increase the production bundle size. Find unused dependencies and get rid of them.

* Before using a dependency, check its download statistics to see if it is heavily used by the community: `npm-stat`. [read more...](https://npm-stat.com/)

    _Why:_
    > More usage mostly means more contributors, which usually means better maintenance, and all of these result in quickly discovered bugs and quickly developed fixes.

* Before using a dependency, check to see if it has a good, mature version release frequency with a large number of maintainers: e.g., `npm view async`. [read more...](https://docs.npmjs.com/cli/view)

    _Why:_
    > Having loads of contributors won't be as effective if maintainers don't merge fixes and patches quickly enough.

* If a less known dependency is needed, discuss it with the team before using it.
* Always make sure your app works with the latest version of its dependencies without breaking: `npm outdated`. [read more...](https://docs.npmjs.com/cli/outdated)

    _Why:_
    > Dependency updates sometimes contain breaking changes. Always check their release notes when updates show up. Update your dependencies one by one, that makes troubleshooting easier if anything goes wrong. Use a cool tool such as [npm-check-updates](https://github.com/tjunnone/npm-check-updates).

* Check to see if the package has known security vulnerabilities with, e.g., [Snyk](https://snyk.io/test?utm_source=risingstack_blog).

<a name="testing"></a>
## 5. Testing

![Testing](/images/testing.png)

* Have a `test` mode environment if needed.

    _Why:_
    > While sometimes end to end testing in `production` mode might seem enough, there are some exceptions: One example is you may not want to enable analytical information on a 'production' mode and pollute someone's dashboard with test data. The other example is that your API may have rate limits in `production` and blocks your test calls after a certain amount of requests. 

* Place your test files next to the tested modules using `*.test.js` or `*.spec.js` naming convention, like `moduleName.spec.js`.

    _Why:_
    > You don't want to dig through a folder structure to find a unit test. [read more...](https://hackernoon.com/structure-your-javascript-code-for-testability-9bc93d9c72dc)
    

* Put your additional test files into a separate test folder to avoid confusion.

    _Why:_
    > Some test files don't particularly relate to any specific implementation file. You have to put it in a folder that is most likely to be found by other developers: `__test__` folder. This name: `__test__`  is also standard now and gets picked up by most JavaScript testing frameworks.

* Write testable code, avoid side effects, extract side effects, write pure functions

    _Why:_
    > You want to test a business logic as separate units. You have to "minimize the impact of randomness and nondeterministic processes on the reliability of your code". [read more...](https://medium.com/javascript-scene/tdd-the-rite-way-53c9b46f45e3)

    > A pure function is a function that always returns the same output for the same input. Conversely, an impure function is one that may have side effects or depends on conditions from the outside to produce a value. That makes it less predictable. [read more...](https://hackernoon.com/structure-your-javascript-code-for-testability-9bc93d9c72dc)

* Use a static type checker 

    _Why:_
    > Sometimes you may need a Static type checker. It brings a certain level of reliability to your code. [read more...](https://medium.freecodecamp.org/why-use-static-types-in-javascript-part-1-8382da1e0adb)


* Run tests locally before making any pull requests to `develop`.

    _Why:_
    > You don't want to be the one who caused production-ready branch build to fail. Run your tests after your `rebase` and before pushing your feature-branch to a remote repository.

* Document your tests including instructions in the relevant section of your `README.md` file.

    _Why:_
    > It's a handy note you leave behind for other developers or DevOps experts or QA or anyone who gets lucky enough to work on your code.

<a name="structure-and-naming"></a>
## 6. Structure and Naming

![Structure and Naming](/images/folder-tree.png)

* Organize your files around product features / pages / components, not roles. Also, place your test files next to their implementation.

    **Bad**

    ```
    .
    ├── controllers
    |   ├── product.js
    |   └── user.js
    ├── models
    |   ├── product.js
    |   └── user.js
    ```

    **Good**

    ```
    .
    ├── product
    |   ├── index.js
    |   ├── product.js
    |   └── product.test.js
    ├── user
    |   ├── index.js
    |   ├── user.js
    |   └── user.test.js
    ```

    _Why:_
    > Instead of a long list of files, you will create small modules that encapsulate one responsibility including its test and so on. It gets much easier to navigate through and things can be found at a glance.

* Put your additional test files to a separate test folder to avoid confusion.

    _Why:_
    > It is a time saver for other developers or DevOps experts in your team.

* Use a `./config` folder and don't make different config files for different environments.

    _Why:_
    >When you break down a config file for different purposes (database, API and so on); putting them in a folder with a very recognizable name such as `config` makes sense. Just remember not to make different config files for different environments. It doesn't scale cleanly, as more deploys of the app are created, new environment names are necessary.
    Values to be used in config files should be provided by environment variables. [read more...](https://medium.com/@fedorHK/no-config-b3f1171eecd5)

* Put your workflow scripts in a `./workflow` folder. This includes `bash` and `node` scripts. Related to generate `CHANGELOG.md`, release process, Git/NPM hooks, PULL_REQUEST and ISSUE templates, etc.

    _Why:_
    >It can be `./scripts` if you prefer. But make sure that keep it consistent with your team. It's very likely you may end up with more than one script, production build, development build, database feeders, database synchronization and so on.

* Place your build output in a `./dist` folder. Add `dist/` to `.gitignore`.

    _Why:_
    >Name it what you like, `build` is also cool. But make sure that keep it consistent with your team. What gets in there is most likely generated  (bundled, compiled, transpiled) or moved there. What you can generate, your teammates should be able to generate too, so there is no point committing them into your remote repository. Unless you specifically want to. 

<a name="code-style"></a>
## 7. Code style

![Code style](/images/code-style.png)

<a name="code-style-check"></a>
### 7.1 Some code style guidelines

* Use stage-2 and higher JavaScript (modern) syntax for new projects. For old project stay consistent with existing syntax unless you intend to modernise the project.

    _Why:_
    > This is all up to you. We use transpilers to use advantages of new syntax. stage-2 is more likely to eventually become part of the spec with only minor revisions. 

* Include code style check in your build process.

    _Why:_
    > Breaking your build is one way of enforcing code style to your code. It prevents you from taking it less seriously. Do it for both client and server-side code. [read more...](https://www.robinwieruch.de/react-eslint-webpack-babel/)

* Use [Stylelint](https://stylelint.io/) to enforce CSS code style

* Use [ESLint - Pluggable JavaScript linter](http://eslint.org/) to enforce JS code style.

    _Why:_
    > We simply prefer `eslint`, you don't have to. It has more rules supported, the ability to configure the rules, and ability to add custom rules.

* We use [JavaScript Standard Style](https://standardjs.com/) for JavaScript, [Read more](https://www.gitbook.com/book/duk/airbnb-javascript-guidelines/details). Use the javascript style guide required by the project or your team.

* We use [Flow type style check rules for ESLint](https://github.com/gajus/eslint-plugin-flowtype) when using [FlowType](https://flow.org/).

    _Why:_
    > Flow introduces few syntaxes that also need to follow certain code style and be checked.

* Use `.eslintignore` to exclude files or folders from code style checks.

    _Why:_
    > You don't have to pollute your code with `eslint-disable` comments whenever you need to exclude a couple of files from style checking.

* Remove any of your `eslint` disable comments before making a Pull Request.

    _Why:_
    > It's normal to disable style check while working on a code block to focus more on the logic. Just remember to remove those `eslint-disable` comments and follow the rules.

* Depending on the size of the task use `//TODO:` comments or open a ticket.

    _Why:_
    > So then you can remind yourself and others about a small task (like refactoring a function or updating a comment). For larger tasks use `//TODO(#3456)` which is enforced by a lint rule and the number is an open ticket.

* Always comment and keep them relevant as code changes. Remove commented blocks of code.

    _Why:_
    > Your code should be as readable as possible, you should get rid of anything distracting. If you refactored a function, don't just comment out the old one, remove it.

* Avoid irrelevant or funny comments, logs or naming.

    _Why:_
    > While your build process may(should) get rid of them, sometimes your source code may get handed over to another company/client and they may not share the same banter.

* Make your names search-able with meaningful distinctions avoid shortened names. For functions use long, descriptive names. A function name should be a verb or a verb phrase, and it needs to communicate its intention.

    _Why:_
    > It makes it more natural to read the source code.

* Organize your functions in a file according to the step-down rule. Higher level functions should be on top and lower levels below.

    _Why:_
    > It makes it more natural to read the source code.

<a name="enforcing-code-style-standards"></a>
### 7.2 Enforcing code style standards

* Use a [.editorconfig](http://editorconfig.org/) file which helps developers define and maintain consistent coding styles between different editors and IDEs on the project.

    _Why:_
    > The EditorConfig project consists of a file format for defining coding styles and a collection of text editor plugins that enable editors to read the file format and adhere to defined styles. EditorConfig files are easily readable and they work nicely with version control systems.

* Have your editor notify you about JS code style errors. Use [eslint-plugin-prettier](https://github.com/prettier/eslint-plugin-prettier) and [eslint-config-prettier](https://github.com/prettier/eslint-config-prettier) with your existing ESLint configuration. [read more...](https://github.com/prettier/eslint-config-prettier#installation)

* You also have [prettier-stylelint](https://github.com/hugomrdias/prettier-stylelint) to warn about your CSS code style errors

* Consider using Git hooks.

    _Why:_
    > Git hooks greatly increase a developer's productivity. Make changes, commit and push to staging or production environments without the fear of breaking builds. [read more...](http://githooks.com/)

* Use Prettier with a precommit hook.

    _Why:_
    > While `prettier` itself can be very powerful, it's not very productive to run it simply as an npm task alone each time to format code. This is where `lint-staged` (and `husky`) come into play. Read more on configuring `lint-staged` [here](https://github.com/okonet/lint-staged#configuration) and on configuring `husky` [here](https://github.com/typicode/husky).

<a name="logging"></a>
## 8. Logging

![Logging](/images/logging.png)

* Avoid client-side console logs in production

    _Why:_
    > Even though your build process can (should) get rid of them, make sure that your code style checker warns you about leftover console logs.

* Produce readable production logging. Ideally use logging libraries to be used in production mode (such as [winston](https://github.com/winstonjs/winston) or
[node-bunyan](https://github.com/trentm/node-bunyan)).

    _Why:_
    > It makes your troubleshooting less unpleasant with colorization, timestamps, log to a file in addition to the console or even logging to a file that rotates daily. [read more...](https://blog.risingstack.com/node-js-logging-tutorial/)

---
Sources:  
[Project Guidelines](https://github.com/elsewhencode/project-guidelines),  
[Contributing to Atom](https://github.com/atom/atom/blob/master/CONTRIBUTING.md),  
[Contributor Covenant](https://www.contributor-covenant.org/),  
[RisingStack Engineering](https://blog.risingstack.com/),  
[Mozilla Developer Network](https://developer.mozilla.org/),  
[Heroku Dev Center](https://devcenter.heroku.com),  
[Airbnb/javascript](https://github.com/airbnb/javascript),  
[Atlassian Git tutorials](https://www.atlassian.com/git/tutorials),  
[Commit Often, Perfect Later, Publish Once: Git Best Practices](https://sethrobertson.github.io/GitBestPractices/)

[Keep a CHANGELOG](https://keepachangelog.com/fr/1.0.0/)  
[Angular CHANGELOG Guideline](https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/edit#)  
[Conventional Changelog](https://github.com/marionebl/commitlint/tree/master/@commitlint/config-conventional)

README & CONTRIBUTING from [Project Guidelines](https://github.com/elsewhencode/project-guidelines),  
ISSUE_TEMPLATE & PULL_REQUEST_TEMPLATE from [Open Source Templates](https://github.com/TalAter/open-source-templates)  

Others Ressources :

[ShieldsIO](https://shields.io/) Get Badges for your project