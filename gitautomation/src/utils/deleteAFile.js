const octokit = require("../lib/initialSetup");

async function deleteAFile(
  owner = "",
  repo = "",
  path = "",
  branch_name = "",
  src = ""
) {
  let trimmedPath = path.slice(src.length + 1, path.length);
  try {
    console.log(`Deleting ${trimmedPath}`);
    const { data } = await octokit.rest.repos.getContent({
      owner: owner,
      repo: repo,
      path: trimmedPath,
      ref: branch_name,
    });

    const currentFileSha = data.sha;

    await octokit.rest.repos.deleteFile({
      owner,
      repo,
      path: trimmedPath,
      message: `Deleting File ${trimmedPath}`,
      sha: currentFileSha,
      branch: branch_name,
    });
  } catch (err) {
    const { response = {} } = err;
    const { data = {} } = response;
    const { message = "" } = data;
    if (message == "Not Found") {
      console.log(`File: ${trimmedPath} is not present in the develop branch for deletion`);
    } else {
      console.log(err);
    }
  }
}

module.exports = deleteAFile;
