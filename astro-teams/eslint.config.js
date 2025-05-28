import eslintPluginAstro from 'eslint-plugin-astro';
import typescriptParser from '@typescript-eslint/parser';
import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import a11yPlugin from 'eslint-plugin-jsx-a11y';

export default [
  // Astro component linting
  ...eslintPluginAstro.configs.recommended,
  
  // TypeScript configuration for .ts files
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json'
      }
    },
    plugins: {
      '@typescript-eslint': typescriptPlugin
    },
    rules: {
      // TypeScript specific rules
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn'
    }
  },
  
  // Astro component configuration
  {
    files: ['**/*.astro'],
    languageOptions: {
      parser: eslintPluginAstro.parser,
      parserOptions: {
        parser: typescriptParser,
        extraFileExtensions: ['.astro'],
        sourceType: 'module'
      }
    },
    rules: {
      // Astro specific rules
      'astro/no-conflict-set-directives': 'error',
      'astro/no-unused-define-vars-in-style': 'error',
      'astro/semi': ['error', 'always'],
      
      // Design token enforcement in Astro components
      'no-restricted-syntax': [
        'error',
        {
          selector: 'Literal[value=/^#[0-9a-fA-F]{3,6}$/]',
          message: 'Hardcoded hex colors are not allowed. Use design tokens from design-system.css'
        },
        {
          selector: 'Literal[value=/^rgb\\(/]',
          message: 'Hardcoded rgb() colors are not allowed. Use design tokens from design-system.css'
        },
        {
          selector: 'Literal[value=/^rgba\\(/]',
          message: 'Hardcoded rgba() colors are not allowed. Use design tokens from design-system.css'
        }
      ]
    }
  },
  
  // General JavaScript/TypeScript rules
  {
    files: ['**/*.js', '**/*.ts', '**/*.astro'],
    plugins: {
      'jsx-a11y': a11yPlugin
    },
    rules: {
      // Code quality rules
      'no-console': 'warn',
      'no-debugger': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
      
      // Accessibility rules for Astro components
      'jsx-a11y/alt-text': 'error',
      'jsx-a11y/aria-props': 'error',
      'jsx-a11y/aria-proptypes': 'error',
      'jsx-a11y/aria-unsupported-elements': 'error',
      'jsx-a11y/role-has-required-aria-props': 'error',
      'jsx-a11y/role-supports-aria-props': 'error'
    }
  },
  
  // Ignore patterns
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
      '.astro/**'
    ]
  }
];