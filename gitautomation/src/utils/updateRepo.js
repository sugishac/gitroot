const octokit = require("../lib/initialSetup");
const updateFileContents = require("./updateASingleFile.js");
const deleteAFile = require("./deleteAFile");
const createPR = require("./createPullRequest.js");
const prompt = require("prompt");
const { promisify } = require("util");

async function updateRepo(
  owner = "",
  repo = "",
  base_branch = "",
  filesModified = [],
  tmpDir = "",
  filesDeleted = [],
  source = "",
  branchExistCheck = false,
  branchExistSha = null,
  exisiting_branch = undefined
) {
  // 1. Branch Validation Checking
  console.log("Branch Validation Checking");
  let branch_name;
  let branch_sha;
  try {
    if (branchExistCheck) {
      branch_name = exisiting_branch;
      branch_sha = branchExistSha;
    } else {
      prompt.start();
      let promptData = promisify(prompt.get);
      console.log("Enter the new branch name");
      const { branch } = await promptData(["branch"]);
      branch_name = branch;

      // 2. Getting The Latest Commit Sha
      console.log("Getting The Latest Commit Sha");

      const _tempRes = await octokit.repos.getCommit({
        owner: owner,
        repo: repo,
        ref: `heads/${base_branch}`,
      });

      branch_sha = _tempRes.data.sha;

      const createBranch = await octokit.rest.git.createRef({
        owner: owner,
        repo: repo,
        ref: `refs/heads/${branch_name}`,
        sha: branch_sha,
      });
      console.log(`Branch: ${branch_name} Created Successfully`);
    }
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

  // 3. Updating (Adding/Modiying) The Files In New Branch
  if (filesModified.length > 0) {
    console.log("Updating (Adding/Modiying) The Files In New Branch");
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
  }

  // 4. Deleting The Files In New Branch
  if (filesDeleted.length > 0) {
    console.log("Deleting The Files In New Branch");
    try {
      for (let file in filesDeleted) {
        await deleteAFile(owner, repo, filesDeleted[file], branch_name, source);
      }
    } catch (err) {}
  }

  // 5. Creating A Pull Request
  console.log("Creating A Pull Request");
  try {
    let prLink = await createPR(owner, repo, base_branch, branch_name);
    console.log("Link: ", prLink);
  } catch (err) {
    console.log(err)
  }
}

module.exports = updateRepo;
