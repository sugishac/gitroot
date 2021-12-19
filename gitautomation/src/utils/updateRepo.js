const octokit = require("../lib/initialSetup");
const readline = require("readline-sync");
const updateFileContents = require("./updateASingleFile.js");
const createPR = require("./createPullRequest.js");
const prompt = require("prompt");
const { promisify } = require("util");

async function updateRepo(
  owner = "",
  repo = "",
  base_branch = "",
  filesModified = [],
  tmpDir = ""
) {
  // 1. Getting The Latest Commit Sha
  console.log("Getting The Latest Commit Sha");
  try {
    var _tempRes = await octokit.repos.getCommit({
      owner: owner,
      repo: repo,
      ref: `heads/${base_branch}`,
    });
  } catch (err) {}
  // 2. Creating A New Branch Using The Latest Sha
  console.log("Creating A New Branch Using The Latest Sha");

  try {
    prompt.start();
    let promptData = promisify(prompt.get);
    console.log("Enter the new branch name");
    var { branch: branch_name } = await promptData(["branch"]);
    console.log(branch);
  } catch (err) {}

  try {
    const createBranch = await octokit.rest.git.createRef({
      owner: owner,
      repo: repo,
      ref: `refs/heads/${branch_name}`,
      sha: _tempRes.data.sha,
    });
    console.log(`Branch: ${branch_name} Created Successfully`);
  } catch (err) {
    const { response = {}, status = "" } = err;
    if (
      response.data &&
      response.data.message == "Reference already exists" &&
      status == 422
    ) {
      console.log("Branch With This Name Already Exist.");
      process.exit();
    } else {
      console.log(err);
    }
  }

  // 3. Updated The Files In New Branch
  console.log("Updated The Files In New Branch");
  try {
    for (let file in filesModified) {
      await updateFileContents(
        owner,
        repo,
        filesModified[file],
        branch_name,
        tmpDir
      );
    }
  } catch (err) {}

  // 4. Creating A Pull Request
  console.log("Creating A Pull Request");
  try {
    let prLink = await createPR(owner, repo, base_branch, branch_name);
    console.log("Link: ", prLink);
  } catch (err) {}
}

module.exports = updateRepo;
