// dodati kod za igru ovdje

/**
 * Primjer callback funkcije
 */
// function cb (x, y) {
//   console.log('Primjer', 'x', x, ', y', y)
// }

// // render.init(cb)

// // const igra = {}

// class Game {
//   constructor(callbackFn) {
//     if (typeof callbackFn !== 'function') {
//       throw new Error('CallbackFn nije funkcija!')
//     }
//     render.init(callbackFn)
//   }
// }

// const game = new Game(cb);
// render.draw()

class Game {
  constructor() {
    this.board = {};
    this.currentPlayer = "p";
    this.nextGamePlayer = "c";
    this.scores = { p: 0, c: 0 };
  }

  init() {
    render.init((x, y) => this.makeMove(x, y));
  }

  makeMove(x, y) {
    if (!this.isValidMove(x, y)) {
      console.log("Nevaljan potez");
      return;
    }

    this.board[`${x}-${y}`] = this.currentPlayer;
    // console.log(`this.board => ${this.board}`);
    console.log(`this.board => ${JSON.stringify(this.board)}`);
    console.log(`Igrac ${this.currentPlayer} se postavio ${x}, ${y}`);

    if (this.isGameOver(x, y)) {
      this.scores[this.currentPlayer]++;
      console.log(`Pobjeda igraca ${this.currentPlayer}!`);
      this.handleFinishedGame();

      return;
    }

    if (this.isBoardFull()) {
      console.log("Neriješeno!");
      this.handleFinishedGame();

      return;
    }

    this.currentPlayer = this.currentPlayer === "p" ? "c" : "p";

    render.draw(this.board);
  }

  isValidMove(x, y) {
    if (this.board[`${x}-${y}`]) {
      return false;
    }

    if (y === 0 || this.board[`${x}-${y - 1}`]) {
      return true;
    }

    return false;
  }

  isGameOver(x, y) {
    return (
      this.checkDirection(x, y, 1, 0) ||
      this.checkDirection(x, y, 0, 1) ||
      this.checkDirection(x, y, 1, 1) ||
      this.checkDirection(x, y, 1, -1)
    );
  }

  checkDirection(x, y, dx, dy) {
    let count = 0;
    count += this.countInDirection(x, y, dx, dy);
    count += this.countInDirection(x, y, -dx, -dy);
    console.log(`count => ${count}`);
    return count >= 3;
  }

  countInDirection(x, y, dx, dy) {
    let count = 0;
    let player = this.currentPlayer;
    let nx = x + dx;
    let ny = y + dy;

    while (this.board[`${nx}-${ny}`] === player) {
      count++;
      nx += dx;
      ny += dy;
    }

    return count;
  }

  resetGame() {
    this.board = {};
    console.log(`this.board => ${JSON.stringify(this.board)}`);
    // this.currentPlayer = 'p';
    this.currentPlayer = this.nextGamePlayer;
    this.nextGamePlayer = this.nextGamePlayer === "p" ? "c" : "p";
    setTimeout(() => {
      if (confirm("Nova igra?")) {
        render.clearClassesForTd();
      } else {
        console.log("Nije nova igra!");
      }
    }, 500);

    // setTimeout(() => {
    //   if (confirm("Nova igra?")) {
    //     location.reload();
    //   } else {
    //     console.log("Nije nova igra.");
    //     game.init();
    //   }
    // }, 500);
  }

  updateScoreDisplay() {
    const scoreElement = document.getElementById("score");
    scoreElement.textContent = `Igrac P: ${this.scores.p} - Igrac C: ${this.scores.c}`;
  }

  isBoardFull() {
    return Object.keys(this.board).length >= 42;
  }

  handleFinishedGame() {
    render.draw(this.board);
    this.updateScoreDisplay();
    this.resetGame();
  }
}

const game = new Game();
game.init();
