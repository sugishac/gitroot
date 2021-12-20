const octokit = require("../lib/initialSetup");
const util = require("util");
const fs = require("fs");
const _tempPromise = util.promisify(fs.readFile);
const _tempPath = require("path");
const getFileContents = require("./getContent.js");

async function updateFileContents(
  owner = "",
  repo = "",
  path = "",
  branch_name = "",
  tmpPath = ""
) {
  const response = await getFileContents(owner, repo, path, branch_name);
  console.log("response", response);
  const currentFileSha = response === undefined ? undefined : response.data.sha;
  const updateMessage = currentFileSha
    ? `Updating ${path}`
    : `Creating ${path}`;
  console.log(updateMessage);
  const getPath = _tempPath.join(tmpPath, path);

  try {
    const getContent = await _tempPromise(getPath);
    const updateContents = await octokit.rest.repos.createOrUpdateFileContents({
      owner: owner,
      repo: repo,
      path: path,
      message: updateMessage,
      content: Buffer.from(getContent).toString("base64"),
      sha: currentFileSha,
      branch: branch_name,
    });
  } catch (err) {
    // console.log(err);
  }
}

module.exports = updateFileContents;
