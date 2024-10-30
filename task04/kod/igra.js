const fs = require("fs");

class BaseError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
    this.name = this.constructor.name;
    Error.captureStackTrace(this);
  }

  logError() {
    console.log(this.name);
    const logMessage = `${new Date().toUTCString()} ${this.status} ${
      this.name
    } ${this.stack.replace(/\n/g, " ")}`;
    fs.appendFile("log.txt", logMessage + "\n", (err) => {
      if (err) throw new BaseError(500, "Error while writing to log file.");
      console.log('The "logMessage" was appended to file!');
    });
  }
}

function swap(arr, index01, index02) {
  const temp = arr[index01];
  arr[index01] = arr[index02];
  arr[index02] = temp;
}

const DULJINA_STRANICE_PLOCE = 5;

const Igra = function () {
  const brojMeta = 5;

  let ploca = [];
  generiraneTocke = {};
  pogodeneTocke = {};
  pokusaji = {};

  this.jeLiIgraZavrsena = function () {
    return Object.keys(pogodeneTocke).length === brojMeta;
  };

  this.napraviPotez = function (potez) {
    console.log("Move coordinates:", potez);

    if (this.jeLiIgraZavrsena()) {
      throw new BaseError(400, "Igra je završena, ne možete napraviti potez.");
    }

    const key = `${potez.x}-${potez.y}`;

    if (
      potez.x < 0 ||
      potez.x >= DULJINA_STRANICE_PLOCE ||
      potez.y < 0 ||
      potez.y >= DULJINA_STRANICE_PLOCE
    ) {
      throw new BaseError(400, "Potez nije valjan.");
    }

    if (pokusaji[key]) {
      throw new BaseError(400, "Potez je već napravljen.");
    }

    pokusaji[key] = true;

    if (generiraneTocke[key]) {
      pogodeneTocke[key] = true;
      if (this.jeLiIgraZavrsena()) {
        console.log("Igra je završena!");
      }
      return true;
    }

    return false;
  };

  this.ispisPloce = function () {
    console.log("Ispis ploce:");
    for (let x = 0; x < DULJINA_STRANICE_PLOCE; x++) {
      let line = [];
      for (let y = 0; y < DULJINA_STRANICE_PLOCE; y++) {
        let mark = "-";
        const key = `${x}-${y}`;

        if (pokusaji[key]) {
          mark = "X";
        }

        if (pogodeneTocke[key]) {
          mark = "o";
        }

        line.push(mark);
      }
      console.log(line.join(" "));
    }
  };

  function generirajTocke() {
    const moguceTocke = [];
    for (let i = 0; i < DULJINA_STRANICE_PLOCE; i++) {
      for (let j = 0; j < DULJINA_STRANICE_PLOCE; j++) {
        moguceTocke.push({
          x: i,
          y: j,
        });
      }
    }

    for (let i = 0; i < 100; i++) {
      for (let j = 0; j < 100; j++) {
        const randomA = Math.floor(Math.random() * 25) % 25;
        const randomB = Math.floor(Math.random() * 25) % 25;

        swap(moguceTocke, randomA, randomB);
      }
    }

    for (let i = 0; i < brojMeta; i++) {
      const mark = moguceTocke[i];
      generiraneTocke[`${mark.x}-${mark.y}`] = true;
    }

    console.log("Generated coordinates:", generiraneTocke);
  }

  ploca = new Array(DULJINA_STRANICE_PLOCE);
  for (let i = 0; i < DULJINA_STRANICE_PLOCE; i++) {
    ploca[i] = new Array(DULJINA_STRANICE_PLOCE);
  }

  generirajTocke();
};

module.exports = {
  Igra,
  BaseError,
};
