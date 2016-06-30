/* jshint node: true */
var path = require('path');

module.exports = {
  context: path.join(__dirname),
  entry: './lib/index.js',

  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'index.js',
    libraryTarget: 'umd',
    library: 'ReactRouterRoleAuthorization'
  },

  externals: [
    {
      react: {
        root: 'React',
        commonjs2: 'react',
        commonjs: 'react',
        amd: 'react'
      }
    }
  ],

  module: {
    loaders: [
      {
        test: /\.(js)$/,
        loader: 'babel',
        exclude: /node_modules/
      }
    ]
  }
};
