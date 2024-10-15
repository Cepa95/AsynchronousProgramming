// x / y <-> 7 x 6

/**
 * Ovdje ne treba nista mijenjati!
 * Ovo je samo za crtanje i ove funkcije treba samo pozvati iz "igra.js"
 */

const HEIGHT = 5
const WIDTH = 7

const render = {
  tableBody: null,
  cbFn: null,

  init: function (callbackFn) {
    this.tableBody = document.getElementById('igra-tablica')

    if (typeof callbackFn !== 'function') {
      throw new Error('init se mora pozvati sa funkcijom!')
    }
    this.cbFn = callbackFn

    for (let y = HEIGHT; y >= 0; y--) {
      const tr = this.createTableRow(y)
      for (let x = 0; x < WIDTH; x++) {
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
    const cbFn = this.cbFn
    td.id = `cell-${x}-${y}`
    td.classList.add('cell-sel')
    td.onclick = () => cbFn(x, y)
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

    cell.classList.add(className)
  },

  // popunjavamo tablicu
  draw: function (gameData) {
    const classes = {
      'p': 'plava',
      'c': 'crvena',
    }

    // dodat logiku za crtanje boja
    for (const key in gameData) {
      if (typeof gameData[key] !== 'string') {
        throw new Error(`Game data od ${key} nije string!`)
      }
      const className = classes[gameData[key]]
      const cellId = `cell-${key}`
      this.colorCell(cellId, className)
    }
  },

  clear: function () {
    while (this.tableBody.firstChild) {
      this.tableBody.removeChild(this.tableBody.lastChild);
    }
  },
}

/**
 * Primjer
 */
function cb (x, y) {
  console.log('Primjer', 'x', x, ', y', y)
}

// render.init(cb)
//render.clearClassesForTd()