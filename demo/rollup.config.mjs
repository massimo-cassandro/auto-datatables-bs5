import node_resolve from '@rollup/plugin-node-resolve';
// import { terser } from '@rollup/plugin-terser';
// import commonjs from '@rollup/plugin-commonjs'; // per importazione file umd


// const terserOptions = {
//   compress: {
//     passes: 2
//   }
// };

export default [
  {
    input: './demo/demo.js',
    plugins: [
      node_resolve(),
      // terser(terserOptions)
      // commonjs(),
    ],
    output: [
      {

        file: './demo/demo-min.js',
        format: 'iife',
        sourcemap: true
      }
    ]
  },

];
