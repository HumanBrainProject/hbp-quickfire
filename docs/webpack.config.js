var webpack = require("webpack");
var path = require('path');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  entry: ["./index.js"],
  output: {
    path: __dirname,
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
  devtool: "source-map",
  devServer: {
    host: "0.0.0.0",
    open: true,
    contentBase: __dirname,
    historyApiFallback: true
  },
  plugins: [
    //new BundleAnalyzerPlugin()
  ]
};
