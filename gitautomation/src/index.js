#!/usr/bin/env node
require("dotenv").config();

const argv = require("minimist")(process.argv.slice(2));
const updateRepo = require("./utils/checkUpdateRepo.js");

(async () => {
  let firstArgs = argv._[0];
  if (firstArgs === "update") {
    let updateCheck = await updateRepo("baseProject", "targetProject");
    process.exit();
  } else {
    console.log("Please Enter A Correct Command");
  }
})();
