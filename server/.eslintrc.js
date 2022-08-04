module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es2021": true
    },
    "extends": "eslint:recommended",
    "parserOptions": { "ecmaVersion": "latest" },
    "rules": {
        "indent": [2, 4, { "SwitchCase": 1 }],
        "semi": ["error", "always"]
    }
};
