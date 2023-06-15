import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';
import { terser } from 'rollup-plugin-terser';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import image from '@rollup/plugin-image';
import postcss from 'rollup-plugin-postcss';
import eslint from '@rollup/plugin-eslint';
import copy from 'rollup-plugin-copy';
import * as fs from 'fs';
import * as path from 'path';

import packageJson from './package.json' assert { type: 'json' };

const adds = fs.readdirSync('./src/add');

/** @type {Array.<import('rollup').RollupOptions>} */
const config = [
  {
    input: 'src/index.ts',
    output: [
      {
        file: packageJson.module,
        format: 'esm',
        sourcemap: true,
      },
      {
        file: packageJson.main,
        format: 'cjs',
        sourcemap: true,
      },
    ],
    plugins: [
      eslint(),
      peerDepsExternal(),
      resolve(),
      commonjs(),
      typescript({ tsconfig: './tsconfig.json', exclude: ['src/add/**'] }),
      postcss(),
      terser(),
      image(),
    ],
  },
  {
    input: './dist/esm/types/index.d.ts',
    output: [{ file: 'dist/index.d.ts', format: 'esm' }],
    plugins: [dts()],

    external: [/\.css$/], // telling rollup anything that is .css aren't part of type exports
  },
  ...adds.flatMap((add) => getAddConfig(add)),
];

/**
 * @param {string} add
 * @returns {Array.<import('rollup').RollupOptions>}
 */
function getAddConfig(add) {
  return [
    {
      input: `src/add/${add}/index.ts`,
      external: ['@webinex/antik'],
      output: [
        {
          file: path.dirname(packageJson.module) + '/add/' + add + '/' + path.basename(packageJson.module),
          format: 'esm',
          sourcemap: true,
          sourcemapPathTransform: (x) =>
            x.replace('/src/add/src/add', '/src/add').replace('\\src\\add\\src\\add', '\\src\\add'),
        },
        {
          file: path.dirname(packageJson.main) + '/add/' + add + '/' + path.basename(packageJson.main),
          format: 'cjs',
          sourcemap: true,
          sourcemapPathTransform: (x) =>
            x.replace('/src/add/src/add', '/src/add').replace('\\src\\add\\src\\add', '\\src\\add'),
        },
      ],
      plugins: [
        eslint(),
        peerDepsExternal(),
        resolve(),
        commonjs(),
        typescript({
          tsconfig: './tsconfig.json',
          include: ['src/add/' + add + '/**'],
          paths: {
            '@webinex/antik': ['dist'],
          },
        }),
        postcss(),
        terser(),
        image(),
        copy({
          targets: [
            {
              src: './package.add.json',
              dest: `add/${add}`,
              rename: () => `package.json`,
              transform: (contents) => contents.toString().replace(/#{name}/g, add),
            },
          ],
        }),
      ],
    },
  ];
}

export default config;
