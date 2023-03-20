/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution")

module.exports = {
  root: true,
  env: {
    browser: true
  },
  "extends": [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "@vue/eslint-config-typescript"
  ],
  rules: {
    "no-unreachable": "warn",
    "quotes": ["warn", "double", {allowTemplateLiterals: true}]
  },
  parserOptions: {
    ecmaVersion: "latest"
  }
}
