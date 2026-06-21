import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  {
    ignores: [
      '**/dist/**',
      '**/scripts/**',
      '**/src/data/promptsIndex.js',
      '**/src/data/prompts/**',
      '**/swarm_agents/**',
      '**/src/lib/generated_utils/**',
      '**/anydesk-clone/**',
      '**/cattle-sale-app/**',
      '**/agent_ui/**',
      '**/node_modules/**',
      '**/generated/**',
      'package/**',
      'background.js',
      'content.js',
      'inject.js',
      'popup.js'
    ]
  },
  {
    files: ['**/*.{js,jsx}'],
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
]
