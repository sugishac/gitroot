const fs = require("fs");
const fse = require('fs-extra')
const path = require('path')

let directoryPath = 'newfile'
let _tempPath = path.resolve(directoryPath)

// Copying The Entire Folder

fse.copySync('./src', './SAMPLEPROJECT', { overwrite: true })

// Removing A Directory

fs.rmdirSync(_tempPath)

// Reading A File

fs.readFile("file1.js", "utf8", function (err, data) {
  if (err) {
    console.log(err);
  } else {
    console.log(data);
  }
});


// Writing A File

const data = `\n console.log('This is duplicate file 2')`;
fs.writeFile("file2.js", data, "utf8", function (err, data) {
  console.log("File Written Succesfully");
});

// Appending A File

fs.appendFileSync("file1.js", data, function (err, data) {
  console.log("File appended succesfully");
});

// Copying a file 

fs.copyFile("file1.js", "file2.js", function (err, data) {
  if (err) {
    console.log(err);
  }
});

// Deleting a file

fs.unlinkSync('file1.js')

// Checking the existence of a file

const checkExist = fs.existsSync('file3.js')
console.log(checkExist)

// Making A New Directory

fs.mkdirSync('your_path')