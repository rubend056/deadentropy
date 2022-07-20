import * as fs from "fs"
import webpack from "webpack"
import config from "./webpack.config"

webpack(
  {
    ...config({}, { mode: "development" }),
    mode: "development",
    watch: process.argv.includes("--watch"),
  },
  (err, stats) => {
    if (err) console.error(err)
    else {
      console.log(stats.toString({ assets: true }))
      fs.writeFileSync(
        "./dist/version.json",
        JSON.stringify({ version_time: Date.now() })
      )
    }
  }
)
