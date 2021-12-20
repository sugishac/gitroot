const octokit = require("../lib/initialSetup");

async function deleteAFile(owner = "", repo = "", path = "", branch_name = "") {
  try {
    console.log(`Deleting ${path}`);
    const { data } = await octokit.rest.repos.getContent({
      owner: owner,
      repo: repo,
      path: path,
      ref: branch_name,
    });

    const currentFileSha = data.sha;

    await octokit.rest.repos.deleteFile({
      owner,
      repo,
      path: path,
      message: `Deleting File ${path}`,
      sha: currentFileSha,
      branch: branch_name,
    });
  } catch (err) {
    const { response = {} } = err;
    const { data = {} } = response;
    const { message = "" } = data;
    if (message === "Not Found") {
      console.log(
        `File: ${path} is not present in the develop branch for deletion`
      );
    } else {
      console.log(err);
    }
  }
}

module.exports = deleteAFile;
