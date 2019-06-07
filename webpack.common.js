const path = require('path')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: {
    main: './js/setup.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        options: { presets: ['@babel/env'] }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  resolve: { extensions: ['*', '.js', '.jsx'] },
  output: {
    path: path.resolve(__dirname, 'dist/'),
    publicPath: 'https://xugaoyang.com',
    filename: '[name]-[hash].js',
    chunkFilename: '[name]-[hash].js'
  },
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
    redux: 'Redux',
    'react-redux': 'ReactRedux',
    'react-router': 'ReactRouter',
    'react-router-dom': 'ReactRouterDOM',
    antd: 'antd',
    parse: 'Parse',
    ramda: 'R',
    'react-markdown': 'ReactMarkdown',
    'prop-types': 'PropTypes'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new CopyWebpackPlugin([
      // {
      //   from: './public/index.html',
      //   to: './'
      // },
      {
        from: './public/token.html',
        to: './'
      },
      {
        from: './public/post.html',
        to: './'
      }
    ])
  ]
}
