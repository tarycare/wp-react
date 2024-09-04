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
      {
        test: /\.(woff(2)?|eot|ttf|otf|svg)$/,
        type: "asset/resource",
        generator: {
          filename: "[name][ext]", // Output without hashes
          publicPath: "/wp-content/plugins/wp-react/dist/fonts/", // Correct path for production
          outputPath: "fonts", // Ensures fonts are placed in dist/fonts
        },
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
    historyApiFallback: true,
    allowedHosts: "all",
    static: {
      directory: path.join(__dirname),
      watch: true,
    },
    hot: true,
    port: 3000,
    proxy: [
      {
        context: ["/wp-json", "/wp-admin"],
        target: "https://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
    ],
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
  mode: "development",

  // Add stats to get detailed error information
  stats: {
    errorDetails: true,
  },
};
