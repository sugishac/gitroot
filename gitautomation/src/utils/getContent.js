const octokit = require("../lib/initialSetup");

async function getFileContents(
  owner = "",
  repo = "",
  path = "",
  branch_name = ""
) {
  try {
    let response = await octokit.repos.getContent({
      owner: owner,
      repo: repo,
      path: path,
      ref: branch_name,
    });
    return response;
  } catch (err) {
      return undefined;
  }
}

module.exports = getFileContents;
