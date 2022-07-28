import potrace from "potrace";
import fs from "fs";

const convertFolderPath = process.argv[2] || "./img";
const convertFolderOutputPath = process.argv[3] || "./svg";

const convertFile = (file) => {
   return new Promise((resolve, reject) => {
      potrace.trace(file, (err, svg) => {
         if (err) reject(err);
         const splitFilePath = file.split("/");
         const filename = splitFilePath[splitFilePath.length - 1];
         const splitFilename = filename.split(".");
         splitFilename[splitFilename.length - 1] = "svg";
         const newFilename = splitFilename.join(".");
         const outputPath = `${convertFolderOutputPath}/${newFilename}`;
         fs.writeFileSync(outputPath, svg);
         resolve(true);
      });
   });
};

if (!fs.existsSync(convertFolderPath)) {
   fs.mkdirSync(convertFolderPath);
   throw new Error(`Folder ${convertFolderPath} don't have any image`);
}
if (!fs.existsSync(convertFolderOutputPath)) {
   fs.mkdirSync(convertFolderOutputPath);
}
let convertedFiles = 0;
fs.readdir(convertFolderPath, (err, files) => {
   files.forEach(async (file) => {
      await convertFile(`${convertFolderPath}/${file}`);
      convertedFiles++;
      console.log(`${convertedFiles}/${files.length} converted`);
   });
});
