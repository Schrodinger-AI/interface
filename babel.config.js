const nextModeBabelPlugin = require('next-babel-conditional-ssg-ssr');

const presets = ['next/babel'];
const plugins = process.env.SKIP_SSR
  ? [nextModeBabelPlugin('ssg'), '@babel/plugin-transform-private-methods']
  : ['@babel/plugin-transform-private-methods']; // or ssg, pull from `process.env.BUILD_MODE`?

module.exports = { presets, plugins };
