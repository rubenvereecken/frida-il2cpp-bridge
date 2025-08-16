// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import fileExtensionInImportTs from 'eslint-plugin-file-extension-in-import-ts';

export default tseslint.config(
    {
        ignores: ['dist/**/*', 'node_modules/**/*'],
    },
    // eslint.configs.recommended,
    tseslint.configs.recommended,
    // tseslint.configs.stylistic,
    {
        files: ['src/**/*.{ts,js,mjs}'],
        plugins: {
            'file-extension-in-import-ts': fileExtensionInImportTs,
        },
        rules: {
            'file-extension-in-import-ts/file-extension-in-import-ts': 'error',
        },
    }
);
