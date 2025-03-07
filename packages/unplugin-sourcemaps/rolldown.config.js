import { rm } from 'fs/promises';
import { builtinModules } from 'module';
import { defineConfig } from 'rolldown';
import pkg from './package.json' with { type: 'json' };

// Remove old build folder
await rm( 'dist', { recursive: true, force: true } );

const sharedOptions = defineConfig( {
	input: 'src/index.ts',
	external: [
		...builtinModules,
		...Object.keys( pkg.dependencies ),
	],
	platform: 'node',
	resolve: {
		extensionAlias: {
			'.js': [ '.ts', '.js' ],
		}
	}
} );

export default defineConfig( [
	{
		output: {
			dir: 'dist',
			format: 'esm',
			sourcemap: true,
			entryFileNames: '[name].mjs',
			chunkFileNames: '[name].mjs',
		},
		...sharedOptions
	},
	{
		output: {
			dir: 'dist',
			format: 'cjs',
			sourcemap: true,
			entryFileNames: '[name].cjs',
			chunkFileNames: '[name].cjs',
		},
		...sharedOptions
	}
] );
