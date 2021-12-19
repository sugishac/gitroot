function validate() {
  if (!process.env.GIT_AUTOMATION) {
    console.log("Bad Credentials");
    console.log("Please Enter A Git Hub Token To Continue");
  } else {
    console.log("Authenticated");
  }
}

module.exports = validate;
