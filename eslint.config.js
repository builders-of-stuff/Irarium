import prettier from 'eslint-config-prettier';
import js from '@eslint/js';
import { includeIgnoreFile } from '@eslint/compat';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import { fileURLToPath } from 'node:url';
import ts from 'typescript-eslint';
const gitignorePath = fileURLToPath(new URL('./.gitignore', import.meta.url));

export default ts.config(
  includeIgnoreFile(gitignorePath),
  js.configs.recommended,
  ...ts.configs.recommended,
  ...svelte.configs['flat/recommended'],
  prettier,
  ...svelte.configs['flat/prettier'],
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      'svelte/no-navigation-without-resolve': 'warn',
      'svelte/require-each-key': 'warn',
      'svelte/no-at-html-tags': 'warn',
      'svelte/prefer-svelte-reactivity': 'off',
      '@typescript-eslint/triple-slash-reference': 'off',
      'no-undef': 'off'
    }
  },
  {
    files: ['**/*.svelte'],

    languageOptions: {
      parserOptions: {
        parser: ts.parser
      }
    }
  },
  {
    files: ['**/*.svelte.ts'],
    languageOptions: {
      parser: ts.parser
    }
  }
);
