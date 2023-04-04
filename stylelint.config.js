module.exports = {
  extends: ['stylelint-config-standard-scss'],
  ignoreFiles: [
    'app/javascript/styles/mastodon/reset.scss',
    'app/javascript/flavours/glitch/styles/reset.scss',
    'app/javascript/styles/win95.scss',
    'node_modules/**/*',
    'vendor/**/*',
    'public/packs/**/*',
    'public/packs-test/**/*',
    'public/assets/**/*',
    'coverage/**/*',
  ],
  rules: {
    'at-rule-empty-line-before': null,
    'color-function-notation': null,
    'color-hex-length': null,
    'declaration-block-no-redundant-longhand-properties': null,
    'no-descending-specificity': null,
    'no-duplicate-selectors': null,
    'number-max-precision': 8,
    'property-no-unknown': null,
    'property-no-vendor-prefix': null,
    'selector-class-pattern': null,
    'selector-id-pattern': null,
    'value-keyword-case': null,
    'value-no-vendor-prefix': null,

    'scss/dollar-variable-empty-line-before': null,
    'scss/no-global-function-names': null,
  },
  overrides: [
    {
      files: [
        'app/javascript/styles/fairy-floss/diff.scss',
        'app/javascript/flavours/glitch/styles/fairy-floss/diff.scss',
      ],
      rules: {
        'selector-no-vendor-prefix': null,
      },
    },
    {
      files: ['app/javascript/flavours/glitch/styles/**/*.scss'],
      rules: {
        'scss/at-extend-no-missing-placeholder': null,
      },
    },
    {
      files: ['app/javascript/flavours/glitch/styles/accessibility.scss'],
      rules: {
        'font-family-no-missing-generic-family-keyword': null,
      },
    },
  ],
};
