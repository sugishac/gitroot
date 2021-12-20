const octokit = require("../lib/initialSetup");

async function getBranch(owner = "", repo = "", exisitng_branch = "") {
  try {
    let branch_check = await octokit.repos.getCommit({
      owner,
      repo,
      ref: `heads/${exisitng_branch}`,
    });
    return branch_check;
  } catch (err) {
    return err;
  }
}

module.exports = getBranch;
