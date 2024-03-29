const CopyWebpackPlugin = require("copy-webpack-plugin");
const WasmPackPlugin = require("@wasm-tool/wasm-pack-plugin");
const path = require('path');

module.exports = {
  entry: "./bootstrap.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bootstrap.js",
  },
  mode: "development",
  plugins: [
    new CopyWebpackPlugin({
      patterns: ['index.html']
    }),
    new WasmPackPlugin({
      crateDirectory: path.resolve(__dirname, "../"),
      outDir: path.resolve(__dirname, "./pkg"),
      extraArgs: '--target bundler',
      outName: "wasm_astar",
    }),
  ],
  experiments: {
    asyncWebAssembly: true
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.wasm']
  }
};
