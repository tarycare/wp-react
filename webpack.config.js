const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    publicPath: "/dist/", // Ensure this matches the folder where your assets are served
  },
  module: {
    rules: [
      {
        test: /\.js$/,
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
  plugins: [
    new MiniCssExtractPlugin({
      filename: "style.css",
    }),
  ],
  resolve: {
    extensions: [".js", ".jsx"],
  },
  devServer: {
    static: {
      directory: path.join(__dirname), // Serve content from the root of your project
      watch: true, // Enable watching of static files
    },
    hot: true, // Enable hot reloading
    port: 8080, // The port where your dev server will run
    proxy: [
      {
        context: ["/wp-json", "/wp-admin"], // Define the contexts to proxy
        target: "http://localhost:8000", // Proxy to your local WordPress installation
        changeOrigin: true,
        secure: false,
      },
    ],
    headers: {
      "Access-Control-Allow-Origin": "*", // To avoid CORS issues
    },
  },
  mode: "development",
};
