const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  watch: true,
  entry: {
    main: './src/client/js/main.js',
    videoPlayer: './src/client/js/videoPlayer.js',
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/style.css',
    }),
  ],
  mode: 'none',
  output: {
    filename: 'js/[name].js',
    path: path.resolve(__dirname, 'assets'),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [['@babel/preset-env', { targets: 'defaults' }]],
          },
        },
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
    ],
  },
};