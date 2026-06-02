import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import prettierConfig from 'eslint-config-prettier'
import { defineConfig, globalIgnores } from 'eslint/config'
import { baseIgnores, baseRules } from '../eslint.config.base.js'

export default defineConfig([
  globalIgnores(baseIgnores),
  {
    files: ['**/*.ts'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      prettierConfig,
    ],
    rules: {
      ...baseRules,
    },
  },
])
