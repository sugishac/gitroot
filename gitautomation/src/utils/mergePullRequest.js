const octokit = require("../lib/initialSetup");

async function mergePR(owner, repo, pull_number) {
  try {
    const createPullRequest = await octokit.rest.pulls.merge({
      owner,
      repo,
      pull_number,
    });
  } catch (err) {}
}

module.exports = mergePR;
