const path = require("path");
const fs = require("fs");

const app_dir = fs.realpathSync(process.cwd());
const dotenv_path = path.resolve(app_dir, ".e");

const mode_alias = {
  d: "dev",
  dev: "development",

  p: "prod",
  prod: "production",

  t: "test",
  test: "testing",
};

const mode_map = {
  development: ["d", "dev", "development"].reverse(),
  production: ["p", "prod", "production"].reverse(),
  testing: ["t", "test", "testing"].reverse(),
};

const mode_files = (mode) => [
  `${dotenv_path}.${mode}.local`,
  `${dotenv_path}.${mode}`,
];

module.exports = (mode) => {
  while (Object.hasOwn(mode_alias, mode)) mode = mode_alias[mode];
  
  const files = [
    ...(mode_map[mode] || (mode ? [mode] : [])).map((f) => mode_files(f)),
    // Don't include `.env.local` for `test` environment
    // since normally you expect tests to produce the same
    // results for everyone
    mode !== "testing" && `${dotenv_path}.local`,
    dotenv_path,
  ]
    .flat()
    .filter(Boolean);

  console.log(`Env from: `, files);

  return files.forEach((env_file) => {
    if (fs.existsSync(env_file)) {
      const dotenv = require("dotenv");
      const dotenvExpand = require("dotenv-expand");
      dotenvExpand.expand(
        dotenv.config({
          path: env_file,
        })
      );
    }
  });
};
