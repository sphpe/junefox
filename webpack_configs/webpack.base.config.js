import webpack from 'webpack';
import Config from 'webpack-config';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import autoprefixer from 'autoprefixer';
import precss from 'precss';
import path from 'path';

var entries = {}
var plugins = []
function addHtml(filename,template) {
  plugins.push(
    new HtmlWebpackPlugin({
      filename: filename,
      template: template,
      inject: false
    })
  )
}
function addScript(dist,src) {
  entries[dist] = src
}

addScript("assets/index", "./src/index.js")
addHtml("index.html", "./src/index.html")

// plugins.push(
//   new webpack.LoaderOptionsPlugin({ options: { postcss: [precss, autoprefixer] } })
// )

export default new Config().merge({
  entry: entries,
  plugins: plugins,
  output: {
    path: __dirname + '/../dist',
    publicPath: '/'
  },
  resolve: {
    alias: {
      'src':  path.resolve(__dirname + '/../src'),
      'store':  path.resolve(__dirname + '/../src/store'),
      'assets':  path.resolve(__dirname + '/../src/assets')
    }
  },    
  watchOptions: {
    poll: true
  },  
  module: {
    rules: [
      {
        test: /.jsx?$/,
        // use: 'babel-loader',
        exclude: /node_modules/,
        query: {
        //   presets: ['es2015', 'react', 'stage-2']
          presets: [
            "babel-preset-es2015", 
            "babel-preset-es2016",
            "babel-preset-es2017",
            'babel-preset-react',
            'babel-preset-stage-3'
          ].map(require.resolve),
          plugins: [
            "transform-class-properties",            
            "transform-object-rest-spread",
            "react-html-attrs",
          ]
        },
        loader: 'babel-loader',        
      }, {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: [
          {
            loader: 'file-loader',
            query: {
              hash: "sha512",
              digest: "hex",
              name: "assets/images/[name].[ext]"
            }
          }
        ]
      }, {
        test: /\.(mp4|ogg|mp3|m4a)$/i,
        loaders: [
          {
            loader: 'file-loader',
            query: {
              hash: "sha512",
              digest: "hex",
              name: "assets/sounds/[name].[ext]"
            }
          }
        ]
      }, {
        test: /\.(ico)$/i,
        loaders: [
          {
            loader: 'file-loader',
            query: {
              hash: "sha512",
              digest: "hex",
              name: "assets/images/[name].[ext]"
            }
          }
        ]
      }, {
        test: /\.(eot|otf|ttf|woff|woff2)$/i,
        loaders: [
          {
            loader: 'file-loader',
            query: {
              hash: "sha512",
              digest: "hex",
              name: "assets/fonts/[name].[ext]"
            }
          }
        ]
      }                    
    ]
  }
});