import { resolve } from 'path';
import { readFileSync } from 'fs';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { viteSingleFile } from 'vite-plugin-singlefile';
import simpleHtmlPlugin from 'vite-plugin-simple-html';
import ViteRestart from 'vite-plugin-restart';

let SONDA_REPORT_DATA = '__REPORT_DATA__';

if ( process.env.NODE_ENV !== 'production' ) {
  const sampleDataPath = resolve(
    process.cwd(),
    'sample_data.json'
  );

  SONDA_REPORT_DATA = encodeURIComponent(
    readFileSync( sampleDataPath, 'utf-8' )
  );
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte(),
    tailwindcss(),
    viteSingleFile({
      removeViteModuleLoader: true
    }),
    simpleHtmlPlugin( {
      minify: true,
      inject: {
        data: {
          SONDA_REPORT_DATA
        }
      }
    } ),
    ViteRestart( {
      restart: [
        './sample_data.json'
      ]
    } )
  ],
  build: {
    modulePreload: false,
    emptyOutDir: false,
    outDir: resolve(import.meta.dirname, '../sonda/dist')
  },
});
