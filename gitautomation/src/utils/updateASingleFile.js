const octokit = require("../lib/initialSetup");
const util = require("util");
const fs = require("fs");
const _tempPromise = util.promisify(fs.readFile);
const _tempPath = require("path");

async function updateFileContents(
  owner = "",
  repo = "",
  path = "",
  branch_name = "",
  tmpPath = ""
) {
  try {
    const { data } = await octokit.rest.repos.getContent({
      owner: owner,
      repo: repo,
      path: path,
      ref: branch_name,
    });

    const currentFileSha = data.sha;
    const updateMessage = currentFileSha
      ? `Updating ${path}`
      : `Creating ${path}`;
    console.log(updateMessage);
    const getPath = _tempPath.join(tmpPath, path);
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
    console.log(err);
  }
}

module.exports = updateFileContents;
