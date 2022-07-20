import path from "path"
import * as fs from "fs"
import { Configuration, DefinePlugin } from "webpack"
import CopyWebpackPlugin from "copy-webpack-plugin"
import HtmlWebpackPlugin from "html-webpack-plugin"
import dotenv from "dotenv"
import { clone, mapKeys, pick } from "lodash"

const version = "1.0.0." + Date.now()

// Finds files in a folder that match a pattern
const find = (folder: string, pattern: RegExp) =>
  fs
    .readdirSync(folder)
    .filter((v) => v.match(pattern))
    .map((v) => path.resolve(folder, v))

const config = (env, argv): Configuration => {
  const production = argv.mode == "production"
  const development = argv.mode == "development"

  const env_file = `./.env${production ? ".production" : ""}`

  dotenv.config({ path: env_file })
  const to_define = {
    ...pick(process.env, ["WEBAPP_PATH"]),
    ...{
      DEBUG: development,
      VERSION: JSON.stringify(version),
    },
  }
  return {
    context: path.resolve(__dirname),
    entry: () => ({
      webapp: {
        import: find("webapp/src", /index[0-9]?.[jt]sx?$/),
        filename: path.join(to_define.WEBAPP_PATH, "static/index.js"),
      },
      server: {
        import: find("server", /index[0-9]?.[jt]s$/),
        filename: "server.js",
      },
    }),
    output: {
      path: path.resolve(__dirname, "dist"),
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
      new DefinePlugin(mapKeys(clone(to_define), k=>"process.env."+k)),
      new HtmlWebpackPlugin({
        template: "webapp/public/index.html",
        filename: path.join(to_define.WEBAPP_PATH, "index.html"),
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: "webapp/public",
            to: to_define.WEBAPP_PATH,
            filter: (p) => !p.match(/index.html$/i),
          },
          { from: "public" },
          { from: env_file },
        ],
      }),
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
      alias: [{ alias: path.resolve(__dirname, "src"), name: "@root" }],
    },
  }
}

export default config
