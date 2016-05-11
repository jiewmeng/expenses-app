module.exports = {
  entry: './js/app.jsx',
  output: {
    path: `${__dirname}`,
    filename: './js/bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        loader: 'babel',
        query: {
          presets: ['es2015', 'react']
        }
      }
    ]
  }
}
