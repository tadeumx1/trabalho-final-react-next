module.exports = {
  extends: ['next/core-web-vitals', 'prettier'],
  rules: {
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'prettier/prettier': [
      'error',
      {
        quoteProps: 'consistent',
        singleQuote: true,
        tabWidth: 2,
        trailingComma: 'es5',
        endOfLine: 'auto',
        useTabs: false,
      },
    ],
  },
}
