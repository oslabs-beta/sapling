const path = require('path');

module.exports = {
  entry: path.resolve(__dirname, './pages/sidebar.tsx'),
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: {
            configFile: 'tsconfig.views.json'
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader"
          }
        ]
      }
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'sidebar.js',
    path: path.resolve(__dirname, '../../dist'),
  },
};