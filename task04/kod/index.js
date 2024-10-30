const readline = require("readline");
const fs = require("fs");
const {
  Igra: IgraPotapanja,
  BaseError,
} = require("./igra");

const novaIgra = new IgraPotapanja();

const questionTekst = `
Opcije:
- n          => napravi novu igru
- p          => ispisi plocu
- m x:1 y:3 => napravi potez na ovim koordinatama
- q          => zaustavi proces

Vas odabir: `;

const moveRegex = new RegExp(/m\ x:\d+\ y:\d/);

function formatInput(input) {
  if (!input) {
    throw new BaseError(400, "Unos je obavezan.");
  }

  switch (input) {
    case "n":
    case "p":
    case "q":
      return { input };
  }

  if (moveRegex.test(input)) {
    const splitInputs = input.split(" ");
    const formattedInput = { input: "m" };

    for (let i = 1; i < 3; i++) {
      const [key, value] = splitInputs[i].split(":");
      formattedInput[key] = Number(value);
    }
    return formattedInput;
  }
  throw new BaseError(400, "Krivi unos");
}

function inputLoop(igraObj) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question(questionTekst, (input) => {
    rl.close();

    try {
      const formattedInput = formatInput(input);
      console.log("provjera");
      console.log(formattedInput);

      switch (formattedInput.input) {
        case "n":
          igraObj = new IgraPotapanja();
          console.log("Nova igra je započeta.");
          break;
        case "p":
          igraObj.ispisPloce();
          break;
        case "m":
          const hit = igraObj.napraviPotez({
            x: formattedInput.x,
            y: formattedInput.y,
          });
          console.log(hit ? "Pogodak!" : "Promašaj!");
          if (igraObj.jeLiIgraZavrsena()) {
            console.log("Igra je završena!");
          }
          break;
        case "q":
          console.log("Proces je zaustavljen.");
          process.exit(0);
      }
    } catch (err) {
      if (err instanceof BaseError) {
        err.logError();
        console.error(err.message);
      } else {
        console.error("Nepoznata greška:", err);
      }
    }

    console.log("\n");
    process.nextTick(() => inputLoop(igraObj));
  });
}

function main(igraObj) {
  inputLoop(igraObj);
}

process.nextTick(() => main(novaIgra));
