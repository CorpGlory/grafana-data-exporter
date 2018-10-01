const path = require('path');


function resolve(p) {
  return path.join(__dirname, '/../', p);
}

module.exports = {
  target: 'node',
  node: {
    __dirname: false,
    __filename: false,
  },
  context: resolve('./src'),
  entry: './index',
  devtool: 'inline-source-map',
  output: {
    filename: "server.js",
    path: resolve('dist')
  },
  resolve: {
    extensions: [".ts", ".js"]
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "ts-loader",
        exclude: /node_modules/
      }
    ]
  }
}
