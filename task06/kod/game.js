const crypto = require('crypto')

function swap (arr, index01, index02) {
  const temp = arr[index01]
  arr[index01] = arr[index02]
  arr[index02] = temp
}

function PointBox (startingPosition) {
  this.pointId = crypto.randomBytes(10).toString('hex');
  this.currentPosition = {...startingPosition}
  this.nextPosition = null

  this.getNextPossiblePositions = function (existingNextMoves) {
    const possiblePositions = []

    const currentY = this.currentPosition.y
    const currentX = this.currentPosition.x

    const maxBoard = 19
    const minBoard = 0

    let newPosition = {}

    for (let i = 0; i < 3; i++) {
      const newX = i - 1

      if ((currentX + newX) > maxBoard || (currentX + newX) < minBoard) {
        continue
      }

      for (let j = 0; j < 3; j++) {
        const newY = j - 1
        if ((currentY + newY) > maxBoard || (currentY + newY) < minBoard) {
          continue
        }
        newPosition = { x: currentX + newX, y: currentY + newY }

        let moveExists = false
        for (let k = 0; k < existingNextMoves.length; k++) {
          if (areMovesTheSame(existingNextMoves[k], newPosition)) {
            moveExists = true
            break
          }
        }

        if (!moveExists) {
          possiblePositions.push(newPosition)
        }
      }
    }

    return possiblePositions
  }

  this.generateNextPosition = function (existingNextMoves) {
    const possibleMoves = this.getNextPossiblePositions(existingNextMoves)
    const numMoves = possibleMoves.length
    const randomPosition = Math.floor(Math.random() * numMoves) % numMoves

    this.nextPosition = possibleMoves[randomPosition]
  }
}

function areMovesTheSame (moveA, moveB) {
  return moveA.x === moveB.x && moveA.y === moveB.y
}

function Game () {
  let gameState = []
  let activePointBoxes = {}
  let playerPreviousMove = {}
  let playerQueuedMove = {}

  function generateNewPositionsForPoints () {
    const activePointIds = Object.keys(activePointBoxes)
    const existingNextMoves = []

    activePointIds.map(activePointId => {
      activePointBoxes[activePointId].generateNextPosition(existingNextMoves)
      existingNextMoves.push(activePointBoxes[activePointId].nextPosition)
    })
  }

  this.makeMoves = function () {
    const activePointIds = Object.keys(activePointBoxes)

    activePointIds.map(activePointId => {
      const pointBox = activePointBoxes[activePointId]

      const pointCurPos = pointBox.currentPosition
      const pointNextPos = pointBox.nextPosition

      gameState[pointCurPos.x][pointCurPos.y] = null
      gameState[pointNextPos.x][pointNextPos.y] = pointBox
      pointBox.currentPosition = pointBox.nextPosition
    })

    if (playerQueuedMove.x) {
      gameState[playerQueuedMove.x][playerQueuedMove.y] = 'player'

      if (!areMovesTheSame(playerQueuedMove, playerPreviousMove) && typeof gameState[playerPreviousMove.x][playerPreviousMove.y] === 'string') {
        gameState[playerPreviousMove.x][playerPreviousMove.y] = null
      }

      playerPreviousMove = playerQueuedMove
    }
  }

  this.getGameState = function () {
    return gameState
  }

  this.givePlayerInitialPosition = function (userId) {
    const maxHeight = 20
    const maxWidth = 20

    // if (playerPreviousMove.x !== undefined && playerPreviousMove.y !== undefined) {
    //   gameState[playerPreviousMove.x][playerPreviousMove.y] = null;
    // }

    const possibleMoves = []
    for (let x = 0; x < maxWidth; x++) {
      for (let y = 0; y < maxHeight; y++) {
        if (!gameState[x][y]) {
          possibleMoves.push({x, y})
        }
      }
    }
    const numPossibleMoves = possibleMoves.length
    const randomNum = Math.floor(Math.random() * numPossibleMoves) % numPossibleMoves
    const randomPosition = possibleMoves[randomNum]

    gameState[randomPosition.x][randomPosition.y] = userId
    playerPreviousMove = randomPosition
    return randomPosition
  }

  this.checkIfMoveValid = function (newMove) {
    if (newMove.x > 19 || newMove.x < 0 || newMove.y > 19 || newMove.y < 0) {
      return false
    }
    return true
  }

  this.queuePlayerMove = function (playerMove) {
    if (this.checkIfMoveValid(playerMove)) {
      playerQueuedMove = playerMove
      return true
    } else {
      return false
    }
  }

  this.removeFromBoard = function (position) {
    try {
      gameState[position.x][position.y] = null
    } catch (err) {
      console.warn(err)
    }
  }

  this.checkIfThereAreEatenPoints = function () {
    const activePointIds = Object.keys(activePointBoxes)
    let numPoints = 0

    activePointIds.map(activePointId => {
      const pointBox = activePointBoxes[activePointId]
      const pointCurPos = pointBox.currentPosition
      const pointNextPos = pointBox.nextPosition

      if (areMovesTheSame(pointCurPos, playerPreviousMove)) {
        numPoints += 1
        delete activePointBoxes[activePointId]
      }
    })

    return numPoints
  }

  this.nextGameTick = function () {
    const points = this.checkIfThereAreEatenPoints()
    this.makeMoves()

    generateNewPositionsForPoints()

    return points
  }

  // init
  let svePozicije = []
  gameState = new Array(20)
  for (let x = 0; x < 20; x++) {
    gameState[x] = new Array(20)
    for (let y = 0; y < 20; y++) {
      gameState[x][y] = null
      svePozicije.push({x, y})
    }
  }

  // generate initial points and destroyers
  const brojPozicija = 400
  for (let i = 0; i < 100; i++) {
    for (let j = 0; j < 100; j++) {
      const randomA = Math.floor(Math.random() * brojPozicija) % brojPozicija
      const randomB = Math.floor(Math.random() * brojPozicija) % brojPozicija

      swap(svePozicije, randomA, randomB)
    }
  }

  // postavi destroyer/point pozicije
  for (let i = 0; i < 80; i++) {
    const position = svePozicije.pop()
    const pointBox = new PointBox(position)

    activePointBoxes[pointBox.pointId] = pointBox
    gameState[position.x][position.y] = pointBox
  }
  generateNewPositionsForPoints()
}

module.exports = Game