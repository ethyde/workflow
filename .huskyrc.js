module.exports = {
  "hooks": {
    "pre-commit": "npm run lint",
    "prepare-commit-msg": "node ./workflow/commit-msg-hook.js -- $HUSKY_GIT_PARAMS",
    "commit-msg":
      "./node_modules/.bin/commitlint --config ./workflow/commitlint.config.js --edit $HUSKY_GIT_PARAMS"
  }
};
