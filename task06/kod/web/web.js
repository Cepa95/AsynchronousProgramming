const fs = require('fs')
const http = require('http')

const PORT = 3013

http.createServer(function (req, res) {
  if (req.url === 'favicon.ico') {
    return res.end()
  }

  const filePath = req.url === '/' ? '/index.html' : req.url
  fs.readFile(`${__dirname}${filePath}`, function (err,data) {
    if (err) {
      res.writeHead(404)
      res.end(JSON.stringify(err))
      return
    }
    res.writeHead(200)
    res.end(data)
  })
}).listen(PORT, function () {
  console.log('Web je na http://localhost', PORT)
})