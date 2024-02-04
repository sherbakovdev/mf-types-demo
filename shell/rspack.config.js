const path = require("path");
const rspack = require("@rspack/core");
const refreshPlugin = require("@rspack/plugin-react-refresh");
const isDev = process.env.NODE_ENV === "development";
const deps = require("./package.json").dependencies;

const {
  NativeFederationTypeScriptHost,
  NativeFederationTypeScriptRemote,
} = require("@module-federation/native-federation-typescript/rspack");

const federationConfig = {
  name: "shell",
  filename: "remoteEntry.js",
  remotes: {
    remote: "remote@http://localhost:3001/remoteEntry.js",
  },
  runtimePlugins: [],
  exposes: {
    "./Shell": "./src/AppShell",
  },
  shared: {
    ...deps,
    react: {
      singleton: true,
    },
    "react-dom": {
      singleton: true,
    },
    "react-router-dom": {
      singleton: true,
    },
  },
};

/**
 * @type {import('@rspack/cli').Configuration}
 */
module.exports = {
  context: __dirname,
  entry: {
    main: "./src/index.ts",
  },
  resolve: {
    extensions: ["...", ".ts", ".tsx", ".jsx"],
  },
  devServer: {
    hot: true,
    port: 3000,
    historyApiFallback: true,
    liveReload: true,
    static: {
      directory: path.join(__dirname, "dist"),
    },
  },
  module: {
    rules: [
      {
        test: /\.svg$/,
        type: "asset",
      },
      {
        test: /\.(jsx?|tsx?)$/,
        use: [
          {
            loader: "builtin:swc-loader",
            options: {
              sourceMap: true,
              jsc: {
                parser: {
                  syntax: "typescript",
                  tsx: true,
                },
                transform: {
                  react: {
                    runtime: "automatic",
                    development: isDev,
                    refresh: isDev,
                  },
                },
              },
              env: {
                targets: [
                  "chrome >= 87",
                  "edge >= 88",
                  "firefox >= 78",
                  "safari >= 14",
                ],
              },
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: {},
              },
            },
          },
        ],
        type: "css",
      },
    ],
  },
  plugins: [
    new rspack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
    }),
    new rspack.ProgressPlugin({}),
    new rspack.container.ModuleFederationPlugin(federationConfig),
    NativeFederationTypeScriptRemote({
      moduleFederationConfig: federationConfig,
    }),
    NativeFederationTypeScriptHost({
      moduleFederationConfig: federationConfig,
    }),
    new rspack.HtmlRspackPlugin({
      template: "./index.html",
    }),
    isDev ? new refreshPlugin() : null,
  ].filter(Boolean),
};
