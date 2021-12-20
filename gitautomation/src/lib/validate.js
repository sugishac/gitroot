function validate() {
  if (!process.env.GIT_AUTOMATION) {
    console.log("Bad Credentials");
    console.log("Please Enter A Git Hub Token To Continue");
    return false;
  } else {
    console.log("Authenticated");
    return true;
  }
}

module.exports = validate;
