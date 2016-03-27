module.exports = {
  context: `${__dirname}/src/public`,
  entry: `./react/index.jsx`,
  output: {
    path: `${__dirname}/build/js`,
    filename: `index.js`
  },
  module: {
    loaders: [
      {
        test: /\.jsx$/,
        loader: 'babel-loader',
        exclude: /(node_modules|bower_components)/,
        query: {
          presets: ['react', 'es2015']
        }
      }
    ]
  }
}