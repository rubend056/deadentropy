import { Configuration, DefinePlugin } from "webpack";
import CopyWebpackPlugin from "copy-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import dotenv from "dotenv";
import { clone, mapKeys, pick, merge, cloneDeep } from "lodash";
import { readdirSync } from "fs";
import { join, resolve } from "path";

const version = "1.0.0." + Date.now();

// Finds files in a folder that match a pattern
const find = (folder: string, pattern: RegExp) =>
  readdirSync(folder)
    .filter((v) => v.match(pattern))
    .map((v) => resolve(folder, v));

const config = (env, argv) => {
  const production = argv.mode == "production";
  const development = argv.mode == "development";
  const env_file = `.env${production ? ".production" : ""}`;
  dotenv.config({ path: env_file });

  const to_define = {
    ...pick(process.env, ["WEBAPP_PATH"]),
    ...{
      DEBUG: development,
      VERSION: JSON.stringify(version),
    },
  };
  const common: Configuration = {
    context: resolve(__dirname),
    output: {
      path: resolve(__dirname, "dist"),
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: "ts-loader",
        },

        {
          test: /\.(css|s[ca]ss|sty(le)?)$/i,
          exclude: /node_modules/,
          use: (r) => [
            {
              loader: "style-loader",
              options: {},
              ident: "style",
            },
            {
              loader: "css-loader",
              options: {
                modules: {
                  auto: /\.((m|mod|module)\.\w+|sty(le)?)$/i,
                },
              },
              ident: "css",
            },
            (r.resource as string).match(/\.css$/i)
              ? undefined
              : {
                  loader: "sass-loader",
                  options: {
                    sassOptions: {
                      indentedSyntax: !(r.resource as string).match(/\.scss$/i),
                    },
                  },
                  ident: "sass",
                },
          ],
        },
      ],
    },
    plugins: [
      new DefinePlugin(mapKeys(clone(to_define), (k) => "process.env." + k)),
    ],
    resolve: {
      extensions: [
        ".js",
        ".jsx",
        ".ts",
        ".tsx",

        // Combination of looking for modules, or individual files
        ...[".module", ".mod", ".m", ""].flatMap((a) =>
          [".css", ".scss", ".sass"].map((b) => a + b)
        ),

        ".json",
      ],
      alias: [{ alias: resolve(__dirname), name: "@root" }],
    },
  };
  const client: Configuration = {
    target: "web",
    entry: () => ({
      webapp: {
        import: find("webapp/src", /index[0-9]?.[jt]sx?$/),
        filename: join(to_define.WEBAPP_PATH, "index.js"),
      },
    }),
    plugins: [
      new HtmlWebpackPlugin({
        template: "webapp/public/index.html",
        filename: join(to_define.WEBAPP_PATH, "index.html"),
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: "webapp/public",
            to: to_define.WEBAPP_PATH,
            filter: (p) => !p.match(/index.html$/i),
          },
        ],
      }),
    ],
  };
  const server: Configuration = {
    target: "node",
    entry: () => ({
      server: {
        import: find("server", /index[0-9]?.[jt]s$/),
        filename: "server.js",
      },
    }),
    plugins: [
      new CopyWebpackPlugin({
        patterns: [
          { from: "public" },
          { from: env_file, to: ".env", toType: "file" },
        ],
      }),
    ],
  };
  return [merge(cloneDeep(common), server), merge(cloneDeep(common), client)];
};

export default config;
