module.exports = {
  "extends": "standard",

  "parserOptions": {
    "ecmaVersion": 6,
    "ecmaFeatures": {
      "impliedStrict": true,
      "experimentalObjectRestSpread": true,
      "jsx": true
    },
    "sourceType": "module"
  },

  "env": {
    "browser": true,
    "node": true,
    "jest": true
  },

  "globals": {
    "document": true,
    "navigator": true,
    "window": true
  }
}
