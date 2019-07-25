// This library allows us to combine paths easily
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");

module.exports = {
  entry: path.resolve(__dirname, 'js', 'GraphNode.js'),
  output: {
    path: path.resolve(__dirname, 'distribution', "latest"),
    filename: 'GraphNode.js',
    libraryTarget: 'var',
    libraryExport: "default",
    library: 'GraphNode'
  },
  module: {
    rules: [
      {
        test: /\.js/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }
    ],
  },
  externals: {
    'node-fetch': 'fetch',
    'xmldom': 'window',
    'rdflib' : '$rdf'
  },
  devtool: 'source-map'
};