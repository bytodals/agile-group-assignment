// Shared ESLint rules — imported by each workspace's eslint.config.js.
// No npm imports: workspaces supply their own plugins/parsers.

/** @type {string[]} */
export const baseIgnores = ['dist/', 'node_modules/', 'coverage/']

/** @type {import('eslint').Linter.RulesRecord} */
export const baseRules = {
  '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
  '@typescript-eslint/no-explicit-any': 'warn',
  '@typescript-eslint/explicit-function-return-type': 'off',
  'no-console': 'off',
}
