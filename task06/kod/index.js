const server = require('http').createServer()
const crypto = require('crypto')
const io = require('socket.io')(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
})

const Game = require('./game')

const PORT = 3012
const INTERVAL_TIME = 1000

let activeSocketIds = []
const activeSockets = {}
const activePlayers = {}
// let totalPoints = 0;

const novaIgra = new Game()

function sendGameStatusMessage (socketId, points) {
  const socketObj = activeSockets[socketId]

  if (!socketObj) {
    return
  }
  socketObj.emit('status', {
    gameData: novaIgra.getGameState(),
    points,
  })
}

function sendMessages () {
  console.log('Game tick...')
  const points = novaIgra.nextGameTick()
  // totalPoints += points;
  activeSocketIds.map(socketId => sendGameStatusMessage(socketId, points))//totalPoints))
}
setInterval(sendMessages, INTERVAL_TIME)

io.on('connection', function (socket) {
  const userId = socket.io || crypto.randomBytes(10).toString('hex');
  console.log('Netko se spojio sa ID:', userId)

  activeSocketIds.push(userId)
  activeSockets[userId] = socket

  socket.on('game-start', function (data) {
    if (typeof data === 'object' && data.isPlayer) {

      if (activePlayers[userId]) {
        console.log('Igra je vec pocela')
        return
      }

      const position = novaIgra.givePlayerInitialPosition(userId)

      activePlayers[userId] = {
        position,
        points: 0,
        socket
      }

      // pocetno stanje igracu
      socket.emit('initial-data', position)
    }
  })

  // potez igraca
  socket.on('make-move', function (move) {
    const playerMove = {...move}
    if (!activePlayers[userId]) {
      console.log('ne postoji igrac')
      return
    }

    if (novaIgra.queuePlayerMove(playerMove)) {
      socket.emit('move-response', playerMove)
      activePlayers[userId].position = playerMove
      return
    }
    socket.emit('move-response', false)
  })

  socket.on('disconnect', function () {
    console.log('ID', userId, 'se odspojio')
    delete activePlayers[userId]
    delete activeSockets[userId]
  })
})

io.on('error', console.error)

server.listen(PORT, function (err) {
  if (err) {
    console.error(err)
    return
  }
  console.log('Igra pokrenuta na portu:', PORT)
})