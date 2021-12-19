const { promisify } = require("util");
const exec = promisify(require("child_process").exec);

async function execute(command, options = {}) {
  const { err, stdout, stderr } = await exec(command, { ...options });
  if (err || stderr) {
    console.log(err || stderr);
  } else {
  }
  return stdout;
}

module.exports = execute;
