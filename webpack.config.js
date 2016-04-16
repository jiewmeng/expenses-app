'use strict';

const precss = require('precss');
const autoprefixer = require('autoprefixer');

module.exports = {
  context: `${__dirname}/src/public`,
  entry: `./react/index.jsx`,
  output: {
    path: `${__dirname}/public/js`,
    filename: `index.js`
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /(node_modules|bower_components)/,
        query: {
          presets: ['react', 'es2015']
        }
      },
      {
        test: /(\.css|\/css)$/,
        loader: 'style-loader!css-loader!postcss-loader'
      },
      {
        test: /\.scss$/,
        loaders: ['style', 'css', 'sass']
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        loader: 'url-loader?limit=100000'
      }
    ]
  },
  postcss() {
    return [precss, autoprefixer];
  }
}
