const octokit = require("../lib/initialSetup");

async function createPR(owner, repo, base_branch, branch_name) {
  try {
    const { data } = await octokit.rest.pulls.create({
      owner: owner,
      repo: repo,
      title: "Raising PR For Updating Changes",
      head: branch_name,
      base: base_branch,
    });
    return data['html_url']
    
  } catch (err) {}
}

module.exports = createPR;
