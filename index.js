// const _ = require("lodash");
// const fs = require("fs");

// const aFiles = fs.readdirSync("SAMPLEPROJECT/files");
// const bFiles = fs.readdirSync("temp/files");

// _.difference(aFiles, bFiles).forEach((v) => {
//   console.log(v);
// });

const fse = require('fs-extra')
fse.copySync('src', 'SAMPLEPROJECT', { overwrite: true })