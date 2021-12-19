var Generator = require("yeoman-generator");

class MyAppGenerator extends Generator {
  constructor(args, opts) {
    super(args, opts);
    this.argument("appname1", { type: String, required: false });
    this.option("appname", { type: String, required: false });
    this.argument("appname2", { type: String, required: false });
    this.argument("appname3", { type: String, required: false });
    this.props = {};
  }

  initializing() {
    this.log(
      "Welcome, lets start building your application" +
        this.options.appname1 +
        this.options.appname +
        this.options.appname2 +
        this.options.appname3
    );
  }

  async prompting() {
    const prompts = [];
    const _tempDestinationPath = this.config.get("destinationPath");
    if (_tempDestinationPath == undefined) {
      prompts.push({
        type: "input",
        name: "destinationPath",
        message: "Your project root destimation",
      });
    }

    prompts.push(
      {
        type: "input",
        name: "projectName",
        message: "Your project name",
        default: "XYZ",
        filter(input) {
          return input.toUpperCase();
        },
      },
      {
        type: "confirm",
        name: "tempConfirm",
        message: "Please confirm",
      }
    );
    this.answers = await this.prompt(prompts);
    this.projectName = this.answers.projectName;
    this.config.set("destinationPath", this.answers.destinationPath);
  }

  loggingUserDetails() {
    this.log("Project Name is :" + this.answers.projectName);
  }

  _copyFiles() {
    const src = this.templatePath("index.js");
    const dest = this.destinationPath(
      `${this.config.get("destinationPath")}/${this.projectName}/files/index.js`
    );
    this.fs.copyTpl(src, dest, {
      projectName: this.projectName,
    });
  }

  async writing() {
    this._copyFiles();
  }
}

exports.default = MyAppGenerator;
module.exports = exports["default"];
