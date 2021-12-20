const fse = require("fs-extra");
const fs = require("fs");
const path = require("path");
const tmp = require("tmp-promise");
const execute = require("../execute.js");
const updateRepo = require("./updateRepo.js");
const getCurrentUser = require("../lib/getCurrentUser.js");
const checkDeleted = require("./checkDeletedFile.js");
const getBranch = require("./getBranch.js");

async function checkUpdateRepo(
  src = "baseProject",
  des = "targetProject",
  exisiting_branch = undefined
) {
  // 1. Checking If The Given Branch Exist For 'Update-Exist'
  let branchExistCheck = false;
  let branchExistSha = null;
  if (exisiting_branch != undefined) {
    const getDetails = await getCurrentUser();
    let getBranchDetails = await getBranch(
      getDetails,
      "gitautomation",
      exisiting_branch
    );
    branchExistCheck = getBranchDetails.data ? true : false;
    console.log(
      `Branch: ${exisiting_branch} ${branchExistCheck ? "Exist" : "Not Exist"}`
    );
    branchExistSha = branchExistCheck ? getBranchDetails.data.sha : null;
    if (!branchExistCheck) {
      process.exit();
    }
  }

  // 2. Updating The Code From Base Folder To Target Folder
  const source = path.resolve(src);
  const destination = path.resolve(des);
  if (!fs.existsSync(source)) {
    console.log("Project Doesnot Exist");
    console.log("Exiting...");
    process.exit();
  } else {
    if (!fs.existsSync(destination)) {
      fs.mkdirSync(destination);
    }
    fse.copySync(source, destination, {
      overwrite: true,
      filter: (file) => {
        const check =
          file.includes("\\.git\\") || file.includes("node_modules")
            ? false
            : true;
        return check;
      },
    });
  }
  // 3. Creating A New Temporary Directory In Order To Update The Code
  console.log("Creating A New Temporary Directory In Order To Update The Code");
  try {
    var tmpDir = await tmp.dir({
      unsafeCleanup: true,
      prefix: `tempusage`,
    });

    console.log("Temporary File Path", tmpDir.path);
  } catch (err) {}

  // 4. Cloning The Develop Branch In Temporary Folder
  try {
    console.log("Cloning The Develop Branch In Temporary Folder");
    if (!fs.existsSync(tmpDir.path)) {
      console.log(
        "Seems Like The Temporary Directory Is Not Built. Exiting..."
      );
      process.exit();
    } else {
      await execute(
        `git clone --single-branch --branch ${
          branchExistCheck ? exisiting_branch : "develop"
        } https://github.com/robinatwork1998/gitautomation.git ${tmpDir.path} `,
        {
          cwd: tmpDir.path,
        }
      );
    }

    // 5. Updating The Temporary Folder With The Target Folder
    console.log("Updating The Temporary Folder With The Target Folder");
    fse.copySync(destination, tmpDir.path, {
      overwrite: true,
    });
  } catch (err) {
    tmpDir.cleanup();
  }

  // 6. Checking The Different Files That Are Added / Deleted / Modified
  console.log(
    "Checking The Different Files That Are Added / Deleted / Modified"
  );
  try {
    await execute(`git add .`, { cwd: tmpDir.path });
  } catch (err) {
    console.log(err);
    tmpDir.cleanup();
  }

  try {
    const filesModified = await execute(
      "git diff HEAD --name-only --ignore-space-change --ignore-space-at-eol",
      {
        cwd: tmpDir.path,
      }
    );
    let filesUpdatedClone = filesModified.split("\n");
    filesUpdatedClone = filesUpdatedClone.filter(
      (p) => path.join(tmpDir.path, p) != tmpDir.path
    );

    let filesDeletedClone = await checkDeleted(src);
    let filesDeleted = filesDeletedClone.map((p) =>
      p.slice(src.length + 1, p.length)
    );

    let filesUpdated = filesUpdatedClone.filter(
      (p) => !filesDeleted.includes(p)
    );

    if (filesUpdated.length == 0 && filesDeleted.length === 0) {
      console.log("No Files Changed Exiting...");
      tmpDir.cleanup();
      process.exit();
    } else {
      console.log("List of files added/modified");
      for (let files in filesUpdated) {
        console.log(filesUpdated[files]);
      }

      console.log("List of files deleted");
      for (let filesDel in filesDeleted) {
        console.log(filesDeleted[filesDel]);
      }
      const getDetails = await getCurrentUser();

      // Move To Next File
      let update = await updateRepo(
        getDetails,
        "gitautomation",
        "develop",
        filesUpdated,
        tmpDir.path,
        filesDeleted,
        src,
        branchExistCheck,
        branchExistSha,
        exisiting_branch
      );
    }
  } catch (err) {
    console.log(err);
    tmpDir.cleanup();
  }
  // Remove the temporary folder
  tmpDir.cleanup();
  return 0;
}

module.exports = checkUpdateRepo;
