module.exports = {
  entry: [
    'webpack-dev-server/client?http://0.0.0.0:3333', // WebpackDevServer host and port
    './main.js',
  ],
  output: {
    path: './',
    filename: 'index.js'
  },
  devServer: {
    inline: true,
    port: 3333
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015', 'stage-0', 'react']
        }
      }
    ]
  }
}
