const execute = require("../execute.js");
const path = require("path");

async function checkDeleted(src = "") {
  try {
    let deletedFiles = await execute("git diff --name-only --diff-filter=m");
    let listDeletedFiles = deletedFiles.split("\n");
    listDeletedFiles = listDeletedFiles.filter(
      (p) => p.startsWith(src) && path.join(process.cwd(), p) != process.cwd()
    );
    return listDeletedFiles;
  } catch (err) {}
}

module.exports = checkDeleted;
