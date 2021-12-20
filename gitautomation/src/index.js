#!/usr/bin/env node

const argv = require("minimist")(process.argv.slice(2));
const validate = require("./lib/validate.js");
const updateRepo = require("./utils/checkUpdateRepo.js");

(async () => {
  let validationCheck = validate();
  if (validationCheck) {
    let firstArgs = argv._[0];
    if (firstArgs != undefined) {
      let secondArgs = argv._[1];
      if (firstArgs === "update-exist" && secondArgs === undefined) {
        console.log("Please Enter A Correct Command");
        process.exit();
      } else {
        let updateCheck = await updateRepo(
          "baseProject",
          "targetProject",
          secondArgs
        );
        process.exit();
      }
    } else {
      console.log("Please Enter A Correct Command");
      process.exit();
    }
  } else {
    process.exit();
  }
})();
