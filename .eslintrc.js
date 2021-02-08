module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    "plugin:vue/recommended",
    "eslint:recommended",
    "plugin:prettier/recommended",
    "plugin:vue/essential",
    "@vue/prettier",
  ],
  rules: {
    "no-console": "off", // process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": "off", // process.env.NODE_ENV === "production" ? "error" : "off",
    "no-unused-vars": [
      "warn",
      { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
    ],
  },
  parserOptions: {
    parser: "babel-eslint",
  },
  ignorePatterns: ["**/node_modules/**"],
  overrides: [
    {
      files: ["**/__tests__/*.{j,t}s?(x)"],
      env: {
        jest: true,
      },
    },
  ],
}
