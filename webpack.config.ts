import { Configuration, DefinePlugin } from "webpack";
import CopyWebpackPlugin from "copy-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import dotenv from "dotenv";
import { clone, mapKeys, pick, merge, cloneDeep, map, flatMap } from "lodash";
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

  const _to_define = {
    ...pick(process.env, ["APP_PATH", "SERVER_URL_PREFIX"]),
    ...{
      APP_DEBUG: development,
      VERSION: version,
    },
  };
  const to_define = Object.fromEntries(Object.entries(clone(_to_define)).map(([k,v]) => ["process.env." + k, JSON.stringify(v)]));
  console.log("Definitions:\n", JSON.stringify(to_define, undefined,2))
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
      alias: [
        { alias: resolve(__dirname), name: "@root" },
        { alias: resolve(__dirname, 'webapp'), name: "@webapp" },
        { alias: resolve(__dirname, 'server'), name: "@server" },
      ],
    },
  };
  const client: Configuration = {
    target: "web",
    entry: () => ({
      webapp: {
        import: find("webapp/src", /index[0-9]?.[jt]sx?$/),
        filename: join(_to_define.APP_PATH, "index.js"),
      },
    }),
    plugins: [
      new DefinePlugin(to_define),
      new HtmlWebpackPlugin({
        template: "webapp/public/index.html",
        filename: join(_to_define.APP_PATH, "index.html"),
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: "webapp/public",
            to: _to_define.APP_PATH,
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
      new DefinePlugin(to_define),
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
