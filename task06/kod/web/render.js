const socket = io('ws://localhost:3012')

socket.on('status', function ({gameData}) {
  render.draw(gameData)
})

socket.on('error', function (err) {
  console.error(err)
})

/**
 * Ovdje ne treba nista mijenjati!
 * Ovo je samo za crtanje i ove funkcije treba samo pozvati iz "igra.js"
 */

 const render = {
  tableBody: null,

  init: function () {
    const heightAndWidth = 20
    this.tableBody = document.getElementById('igra-tablica')

    for (let y = (heightAndWidth - 1); y > -1; y--) {
      const tr = this.createTableRow(y)
      for (let x = 0; x < heightAndWidth; x++) {
        const cell = this.createTableCell(x, y)
        tr.appendChild(cell)
      }
      this.tableBody.appendChild(tr)
    }
  },

  createTableRow: function (y) {
    const tr = document.createElement('tr')

    return tr
  },

  createTableCell: function (x, y) {
    const td = document.createElement('td')
    td.id = `cell-${x}-${y}`
    td.classList.add('cell-sel')
    return td
  },

  clearClassesForTd: function () {
    const coloredCells = [
      ...document.getElementsByClassName('plava'),
      ...document.getElementsByClassName('crvena'),
    ]

    coloredCells.forEach(e => {
      e.classList.remove('plava')
      e.classList.remove('crvena')
    })
  },

  colorCell: function (id, className) {
    const cell = document.getElementById(id)

    if (!cell) {
      throw new Error(`Polje ${id} ne postoji!`)
    }

    cell.classList.remove('plava')
    cell.classList.remove('crvena')

    if (className) {
      cell.classList.add(className)
    }
  },

  // popunjavamo tablicu
  draw: function (gameData) {
    const classes = {
      'b': 'plava',
      'c': 'crvena',
    }
    const maxHeight = 20
    const maxWidth = 20

    for (let x = 0; x < maxHeight; x++) {
      for (let y = 0; y < maxWidth; y++) {
        const cellData = gameData[x][y]
        let className = ''

        if (cellData) {
          className = cellData.pointId ? classes.b : classes.c
        }
        const key = `cell-${x}-${y}`

        this.colorCell(key, className)
      }
    }
  },

  clear: function () {
    while (this.tableBody.firstChild) {
      this.tableBody.removeChild(this.tableBody.lastChild);
    }
  },
}

render.init()
render.clearClassesForTd()