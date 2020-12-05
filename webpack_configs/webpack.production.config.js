import webpack from 'webpack';
import Config from 'webpack-config';

export default new Config().extend('webpack_configs/webpack.base.config.js').merge({
  mode: "production",
  devtool: 'source-map',
  module: {
    rules: [{
      test: /\.css$/,
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            // modules: true,
            importLoaders: 1,
            localIdentName: "[hash:base64:10]",
            minimize: true
          }
        },
        // { loader: 'postcss-loader' },
      ]
    }, {
      test: /\.scss$/,
      use: [
        "style-loader", // creates style nodes from JS strings
        "css-loader", // translates CSS into CommonJS
        "sass-loader" // compiles Sass to CSS, using Node Sass by default
      ]      
    }]
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production"),
        API_LOCAL: process.env.API_LOCAL || "0"
      }
    }),
  ]
});