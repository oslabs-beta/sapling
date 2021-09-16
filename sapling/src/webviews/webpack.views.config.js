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
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  // devtool: 'nosources-source-map',
  // externals: {
  //   vscode: 'commonjs vscode' // the vscode-module is created on-the-fly and must be excluded. Add other modules that cannot be webpack'ed, 📖 -> https://webpack.js.org/configuration/externals/
  //   // modules added here also need to be added in the .vsceignore file
  // },
  output: {
    filename: 'sidebar.js',
    path: path.resolve(__dirname, '../../dist'),
    // libraryTarget: 'commonjs2'
  },
};