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
const run = async () => {
   const files = await fs.promises.readdir(convertFolderPath);

   const existFile = JSON.parse(await fs.promises.readFile("ignore-file.json"));
   if (JSON.stringify(files) === JSON.stringify(existFile)) {
      console.log(
         "\x1b[33m%s\x1b[0m",
         "All images have been converted to svg already. Please check svg folder or delete the file in ignore-file.json to convert again"
      );
      return;
   }
   files.forEach(async (file) => {
      if (existFile.includes(file)) return;
      await convertFile(`${convertFolderPath}/${file}`);
      convertedFiles++;
      console.log(
         "\x1b[32m%s\x1b[0m",
         `${convertedFiles}/${files.length} ${file} converted`
      );
   });
   await fs.promises.writeFile("ignore-file.json", JSON.stringify(files));
};
run();

// fs.readdir(convertFolderPath, (err, files) => {
//    fs.readFile("file.json", (err, data) => {
//       if (err) throw err;
//       const existFile = JSON.parse(data);
//       files.forEach(async (file) => {
//          if (existFile.includes(file)) return;
//          await convertFile(`${convertFolderPath}/${file}`);
//          convertedFiles++;
//          console.log(`${convertedFiles}/${files.length} converted`);
//       });

//       fs.writeFileSync("file.json", JSON.stringify(files));
//    });
// });
