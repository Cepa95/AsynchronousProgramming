// Ovdje ce te pisat funkcije koje vam trebaju. Ako zelite, mozete razdvojit u par datoteka, ali iz ove datoteke vam mora
// biti exportana glavna funkcija

const {
  readdir,
  readFile,
  writeFile,
  appendFile,
} = require("node:fs/promises");
// const path = require("path");
const { join } = require("path");

async function fileActions() {
  // console.log('Reading files from:', __dirname);
  const dirPath = join(__dirname, "..", "tekstualneDatoteke");
  // console.log('Reading files from:', dirPath);

  const combinedFilePath = join(dirPath, "combined.txt"); //cetvrti zadatak

  // za ocistiti file ako postoji, da ne appenda na postojeci sadrzaj
  await writeFile(combinedFilePath, "", "utf-8");
  try {
    const files = await readdir(dirPath);
    const results = [];
    // let combinedContent = ""; //cetvrti zadatak

    for (const file of files) {
      const filePath = join(dirPath, file);
      const content = await readFile(filePath, "utf-8"); //const contents = await readFile(filePath, { encoding: 'utf8' });
      // \p{L} - Unicode letter, \s - whitespace, nije potreban sada filter ali neka se nadje
      const words = content.replace(/[^\p{L}\s]/gu, "").split(/\s+/).filter(Boolean); // regex za razmak, tab, novi red, ... i filter za prazne stringove(false, null, 0, "", undefined, and NaN)
      console.log(words);
      const wordCount = words.length;

      const wordLengthCount = {}; //treci zadatak

      for (const word of words) {
        //treci zadatak
        const length = word.length;
        if (!wordLengthCount[length]) wordLengthCount[length] = 0;
        wordLengthCount[length]++;
        // wordLengthCount[length] = wordLengthCount[length]
        //   ? wordLengthCount[length] + 1
        //   : 1;
      }

      results.push({
        imeDatoteke: file, // drugi zadatak
        ukupanBrojRijeci: wordCount,
        brojRijeciSaIstimBrojemSlova: wordLengthCount, //treci zadatak
      });

      //   combinedContent += content.replace(/\s+/g, ""); //cetvrti zadatak
      const modifiedContent = content.replace(/\s+/g, "");
      await appendFile(combinedFilePath, modifiedContent, "utf-8");
    }

    // const combinedFilePath = join(dirPath, "combined.txt"); //cetvrti zadatak => ne samo combined.txt, nego i u tekstualneDatoteke folder
    // await writeFile(combinedFilePath, combinedContent);  // => const promise = writeFile('message.txt', data, { signal }); await promise;
    // // await writeFile(combinedFilePath, combinedContent, 'utf-8');
    // // console.log(`Combined content written to: ${combinedFilePath}`);

    return results;
  } catch (err) {
    if (err.code === "ENOENT") {
      //ENOENT - Error NO ENTry
      console.error(`Directory not found: ${dirPath}`);
    } else {
      console.error("An error occurred:", err);
    }
    throw err;
  }
}

module.exports = {
  fileActions,
};
