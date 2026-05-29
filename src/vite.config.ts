import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';

import { libInjectCss } from 'vite-plugin-lib-inject-css';
import pkg from './package.json';
import { fileURLToPath } from 'node:url';
import { copyFileSync } from 'node:fs';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

type ExportConfig = { import: string };

function isExportConfig(value: unknown): value is ExportConfig {
  return typeof value === 'object' && value !== null && 'import' in value;
}

function exportConfig(exportName: string) {
  const value = pkg.exports[exportName as keyof typeof pkg.exports];
  if (!isExportConfig(value)) {
    throw new Error(`Missing import path for package export "${exportName}"`);
  }

  return value;
}

function entryNameFromExport(exportName: string) {
  if (exportName === '.') {
    return 'index';
  }

  const importPath = exportConfig(exportName).import;
  return importPath.replace(/^\.(\/dist\/)?/, '').replace(/\.js$/, '');
}

function sourceFromExport(exportName: string) {
  const importPath = exportConfig(exportName).import;
  return resolve(__dirname, importPath.replace(/^\.(\/dist\/)?/, 'lib/').replace(/\.js$/, '.ts'));
}

const entries = Object.fromEntries(
  Object.keys(pkg.exports)
    .filter((exportName) => exportName === '.' || exportName.startsWith('./add/'))
    .map((exportName) => [entryNameFromExport(exportName), sourceFromExport(exportName)]),
);

const externalPackages = [
  pkg.name,
  ...Object.keys(pkg.peerDependencies),
  ...Object.keys(pkg.devDependencies),
];

function isExternal(id: string) {
  return externalPackages.some((name) => id === name || id.startsWith(`${name}/`));
}

const lib = defineConfig({
  plugins: [
    react(),
    libInjectCss(),
    dts({
      include: ['lib'],
      pathsToAliases: true,
      tsconfigPath: resolve(__dirname, './tsconfig.lib.json'),
      outDirs: [resolve(__dirname, './dist/types')],
    }),
  ],
  resolve: {
    alias: {
      '@webinex/antik': resolve(__dirname, 'lib'),
    },
  },
  build: {
    copyPublicDir: false,
    minify: false,
    sourcemap: true,
    rolldownOptions: {
      external: isExternal,
      output: {
        entryFileNames: '[name].js',
        preserveModules: true,
        preserveModulesRoot: resolve(__dirname, 'lib'),
      },
    },
    lib: {
      entry: entries,
      formats: ['es'],
      fileName: (_format, entryName) => `${entryName}.js`,
    },
  },
});

const ghPages = defineConfig({
  base: '/dynamic-form',
  plugins: [
    react(),
    {
      name: 'copy-index-to-404',
      closeBundle() {
        const distDir = resolve(__dirname, '.gh-pages');
        copyFileSync(resolve(distDir, 'index.html'), resolve(distDir, '404.html'));
      },
    },
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'lib'),
    },
  },
  build: {
    copyPublicDir: false,
    minify: false,
    sourcemap: true,
    outDir: resolve(__dirname, '.gh-pages'),
  },
});

export default process.argv.includes('--gh-pages') ? ghPages : lib;
