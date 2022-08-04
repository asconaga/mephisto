module.exports = {
    env: {
        browser: true,
        node: true,
        es6: true,
    },
    extends: ["eslint:recommended", "plugin:react/recommended"],
    settings: {
        react: {
            version: "18.2",
        },
    },
    globals: {
        Atomics: "readonly",
        SharedArrayBuffer: "readonly",
    },
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: "latest",
        sourceType: "module",
    },
    plugins: ["react", "react-hooks"],
    rules: {
        indent: ["error", 4],
        semi: ["error", "always"],
        "object-curly-spacing": ["error", "always"],
        "space-in-parens": ["error", "never"],
        "space-infix-ops": ["error", { int32Hint: false }],
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn",
    },
};
