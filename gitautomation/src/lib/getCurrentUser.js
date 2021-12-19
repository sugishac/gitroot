const octokit = require("./initialSetup");

async function getCurrentUser() {
  try {
    const user = await octokit.rest.users.getAuthenticated();
    console.log("Current User: " + user.data.login);
    return user.data.login;
  } catch (err) {
    console.log(err);
  }
}

module.exports = getCurrentUser;
