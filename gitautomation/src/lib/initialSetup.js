const { Octokit } = require("@octokit/rest");

const octokit = new Octokit({
  auth: `${process.env.GIT_AUTOMATION}`,
});

module.exports = octokit;
