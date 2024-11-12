const webSocketClient = io("localhost:3012");

function generateMove(event, currentPosition) {
  const directions = {
    ArrowUp: { x: 0, y: 1 },
    ArrowDown: { x: 0, y: -1 },
    ArrowLeft: { x: -1, y: 0 },
    ArrowRight: { x: 1, y: 0 },
  };

  const direction = directions[event.key];
  if (direction) {
    return {
      x: currentPosition.x + direction.x,
      y: currentPosition.y + direction.y,
    };
  }
  return null;
}

webSocketClient.emit("game-start", { isPlayer: true });
console.log("Event send: game-start");

webSocketClient.on("initial-data", (position) => {
  console.log("Initial position:", position);

  let playerPosition = position;

  document.addEventListener("keydown", (event) => {
    const move = generateMove(event, playerPosition);
    if (move) {
      console.log("Generiran potez:", move);
      webSocketClient.emit("make-move", move);
    }
  });

  webSocketClient.on("move-response", (response) => {
    if (response) {
      console.log("move accepted:", response);
      playerPosition = response;
    } else {
      console.log("move rejected");
    }
  });

  webSocketClient.on("status", ({ gameData, points }) => {
    console.log("Current board status:", gameData);
    console.log("Number of eaten blue squares:", points);
  });
});
