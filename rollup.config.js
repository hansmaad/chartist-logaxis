import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json';
import { terser } from "rollup-plugin-terser";
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
    input: 'src/index.ts', // our source file
    output: [
        {
            file: pkg.main,
            format: 'umd',
            name: 'ChartistLogAxis'
        }
    ],
    external: [
        ...Object.keys(pkg.peerDependencies || {})
    ],
    plugins: [
        nodeResolve(),
        commonjs(),
        typescript({
            typescript: require('typescript'),
        }),
        //   terser() // minifies generated bundles
    ]
};