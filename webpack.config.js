var path = require('path');

module.exports = {
  entry: "./src/index.js",
  output: {
    path: __dirname + '/dist',
    filename: "bundle.js"
  },
  devServer: {
    contentBase: './dist',
    hot: true,
  },
};
