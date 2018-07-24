var webpack = require("webpack");
var path = require("path");
var CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  entry: ["./index.js"],
  output: {
    path: path.join(__dirname, process.env.DEST || "build"),
    filename: "./bundle.js"
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: "babel-loader",
        exclude: [path.resolve(__dirname, "node_modules")]
      }
    ]
  },
  resolve: {
    extensions: [".js", ".jsx"],
    alias:{
      "hbp-quickfire": path.resolve("../"),
      "mobx": path.resolve("./node_modules/mobx"),
      "mobx-react": path.resolve("./node_modules/mobx-react"),
      "react": path.resolve("./node_modules/react"),
      "react-bootstrap": path.resolve("./node_modules/react-bootstrap"),
      "lodash": path.resolve("./node_modules/lodash"),
      "react-dom": path.resolve("./node_modules/react-dom"),
      "react-jss": path.resolve("./node_modules/react-jss")
    }
  },
  plugins: [
    new CopyWebpackPlugin([{ from: "assets/**/*", ignore:"index.*" }]),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      //inject: false,
      //env:{}
    }),
    new UglifyJsPlugin()
  ]
};
