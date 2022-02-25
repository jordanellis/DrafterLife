const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require('path');

module.exports = {
  entry: "./src/index.tsx",
  output: {
    path: path.join(__dirname, 'dist'),
    filename: "[name].js"
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html", 
      filename: "./index.html",
      favicon: "./public/favicon.ico"
    })
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.(png|jpe?g|ico)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.jsx', '.ts', '.js'],
  }
};