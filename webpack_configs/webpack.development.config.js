import webpack from 'webpack';
import Config from 'webpack-config';

export default new Config().extend('webpack_configs/webpack.base.config.js').merge({
  mode: "development",
  devtool: 'inline-source-map',
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
            localIdentName: "[local]__[hash:base64:5]",
            minimize: false
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
    }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("development"),
        API_LOCAL: process.env.API_LOCAL || "0"
      }
    })
  ]
});