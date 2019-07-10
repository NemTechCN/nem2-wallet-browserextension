const mix = require('laravel-mix');
const TerserPlugin = require('terser-webpack-plugin');

mix.js('src/popup.js', 'dist/').sass('src/popup.scss', 'dist/');
mix.js('src/wallet.js', 'dist/').sass('src/wallet.scss', 'dist/');

mix.webpackConfig({
  node: {
    fs: 'empty',
    tls: 'empty',
    net: 'empty',
  },
  devtool: 'inline-source-map',
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          output: {
            comments: false,
          },
        },
      }),
    ],
  },
});
