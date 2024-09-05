const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { DefinePlugin } = require("webpack");
const dotenv = require("dotenv");
const mode = process.env.NODE_ENV || "production"; // Default to production if not set

// Load environment variables based on the mode
const envFile = `.env.${mode}`;
dotenv.config({ path: envFile }); // Load the correct .env file for production

module.exports = (env, argv) => {
  const isDev = argv.mode === "development";

  return {
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
            filename: "[name][ext]",
            publicPath: isDev
              ? "/dist/fonts/"
              : "/wp-content/plugins/wp-react/dist/fonts/",
            outputPath: "fonts",
          },
        },
      ],
    },
    resolve: {
      extensions: [".js", ".jsx"],
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: "style.css",
      }),
      new DefinePlugin({
        // Inject the environment variables into your JS bundle for client-side access
        "process.env.NODE_ENV": JSON.stringify(argv.mode),
        "process.env.API_URL": JSON.stringify(process.env.API_URL), // Inject API_URL from .env.production
      }),
    ],
    devServer: {
      historyApiFallback: true,
      allowedHosts: "all",
      static: {
        directory: path.resolve(__dirname, "dist"),
      },
      hot: true,
      port: 3000,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods":
          "GET, POST, PUT, DELETE, PATCH, OPTIONS",
        "Access-Control-Allow-Headers":
          "X-Requested-With, content-type, Authorization",
      },
    },
    mode: argv.mode, // Use the mode set via command line (production or development)
    stats: {
      errorDetails: true,
    },
  };
};
