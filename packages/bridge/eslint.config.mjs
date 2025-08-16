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
            // Disallow bare globals in *value* position, so as not to confuse with Il2Cpp classes
            'no-restricted-globals': [
                'error',
                { name: 'Array', message: 'Use globalThis.Array' },
                { name: 'Map', message: 'Use globalThis.Map' },
                { name: 'Set', message: 'Use globalThis.Set' },
                { name: 'Object', message: 'Use globalThis.Object' },
                { name: 'Symbol', message: 'Use globalThis.Symbol' },
                { name: 'Number', message: 'Use globalThis.Number' },
                { name: 'String', message: 'Use globalThis.String' },
                { name: 'Boolean', message: 'Use globalThis.Boolean' },
                { name: 'BigInt', message: 'Use globalThis.BigInt' },
            ],
        },
    }
);
