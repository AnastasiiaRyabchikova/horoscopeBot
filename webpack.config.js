const webpack = require('webpack');
const path = require('path');
const fs = require('fs');

var nodeModules = {};
fs.readdirSync('node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });

module.exports = {
  entry: './src/index.js',
  target: 'node16.13',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  node: {
    global: false,
    __filename: false,
    __dirname: false,
  },
  externals: nodeModules,
};