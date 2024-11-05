const fs = require("fs").promises;
const path = require("path");
const sharp = require("sharp");
const argv = require("yargs").argv;

const inputDir = "../slike";
const outputDir = "./pictures";
const sizes = argv.velicina ? [argv.velicina] : ["150x150", "100x100", "50x50"];

const makeDirectory = async (dir) => {
  try {
    await fs.access(dir);
  } catch (error) {
    console.log(`Creating directory ${dir}`);
    await fs.mkdir(dir);
  }
};

const extractFileInfo = (file, size) => {
  const sizeParts = size.split("x");
  const width = parseInt(sizeParts[0]);
  const height = parseInt(sizeParts[1]);
  const fileParts = path.basename(file).split(".");
  const fileName = fileParts[0];
  const fileExtension = "." + fileParts[1];
  return { width, height, fileName, fileExtension };
};

const resizeImage = async (file, size) => {
  const { width, height, fileName, fileExtension } = extractFileInfo(
    file,
    size
  );
  const outputFileName = `${fileName}-${size}${fileExtension}`;
  const outputPath = path.join(outputDir, outputFileName);

  try {
    await sharp(file).resize(width, height).toFile(outputPath);

    const stats = (await fs.stat(outputPath)).size;

    return { outputFileName, stats };
  } catch (error) {
    console.error(`Error processing ${file} to size ${size}:`, error);
    throw error;
  }
};

const processImages = async () => {
  try {
    await makeDirectory(outputDir);

    const files = [];
    const allFiles = await fs.readdir(inputDir);
    allFiles.forEach((file) => {
      if (/\.(jpg|jpeg|png)$/i.test(file)) {
        files.push(file);
      }
    });

    const legend = [];

    for (const file of files) {
      for (const size of sizes) {
        const filePath = path.join(inputDir, file);
        const result = await resizeImage(filePath, size);
        legend.push(result);
      }
    }
  
    for (const line of legend) {
      await fs.appendFile("legenda.txt", line.outputFileName + ' - ' + line.stats + " bytes\n");
    }
    console.log("Image processing complete.");
  } catch (error) {
    console.error("Error processing images:", error);
  }
};

processImages();
