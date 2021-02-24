module.exports = {
    "extends": ["react-app", "airbnb-base"],
    "rules":{
        "import/extensions": [
            "error",
            "ignorePackages",
            {
              "js": "never",
              "jsx": "never",
              "ts": "never",
              "tsx": "never"
            }
        ],
        'indent': ['error', 4],
        "camelcase": "error",
        "no-array-constructor": "off",
        "no-empty-function": "off",
        "no-shadow": "off",
        "no-unused-vars": "off",
        "no-use-before-define": "off",
        "no-var": "error",
        "prefer-const": "error",
        "prefer-rest-params": "error",
        "prefer-spread": "error",
        "prefer-destructuring": "warn",
        "no-undef": "off",
        "class-methods-use-this": "error",
        "max-len": ["warn", {"code": 120, "ignoreStrings": true}],
    },
}