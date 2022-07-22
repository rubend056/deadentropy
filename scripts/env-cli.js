#!/usr/bin/env node
const shell = require("shelljs");

let args = process.argv.slice(2);
let mode;
if (args[0] && args[0][0] === "-") {
  mode = args[0].slice(1);
  args = args.slice(1);
}

require("./env")(mode);
const result = shell.exec(args.join(" "));
process.exit(result && result.code);
