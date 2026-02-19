module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json"
  },
  plugins: ["@typescript-eslint", "import"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/typescript"
  ],
  rules: {
    // 🚫 No any
    "@typescript-eslint/no-explicit-any": "error",

    // 🚫 No floating promise
    "@typescript-eslint/no-floating-promises": "error",

    // 🚫 No unused vars
    "@typescript-eslint/no-unused-vars": ["error"],

    // 🚫 No require()
    "@typescript-eslint/no-var-requires": "error",

    // 🚫 No console in production logic
    "no-console": ["warn", { allow: ["warn", "error"] }],

    // 🚫 Prevent circular dependency
    "import/no-cycle": "error",

    // 🚫 Layer violation guard
    "import/no-restricted-paths": [
      "error",
      {
        zones: [
          {
            target: "./src/canonical",
            from: "./src/fsm"
          },
          {
            target: "./src/canonical",
            from: "./src/alert"
          },
          {
            target: "./src/feature",
            from: "./src/fsm/cluster"
          },
          {
            target: "./src/canonical",
            from: "./src/storage"
          }
        ]
      }
    ]
  }
};
