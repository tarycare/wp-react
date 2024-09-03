const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    publicPath: "/dist/",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx"],
    alias: {
      "@": path.resolve(__dirname, "src"), // Alias for root 'src' directory
    },
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "style.css",
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname),
      watch: true,
    },
    hot: true,
    port: 8080,
    proxy: [
      {
        context: ["/wp-json", "/wp-admin"],
        target: "http://localhost:8000",
        changeOrigin: true,
        secure: false,
      },
    ],
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
  mode: "development",
};
