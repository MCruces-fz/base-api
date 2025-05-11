const http = require('node:http')
const fs = require('node:fs')

const desiredPort = process.env.PORT ?? 1234

const processRequest = (req, res) => {
    console.log(`equested received: ${req.url}`)
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    if (req.url == '/') {
        res.end("<h1>Bienvenido a mi página de inicio</h1>")
    } else if (req.url == '/favicon.ico') {
        fs.readFile('./favicon.ico', (err, data) => {
            if (err) {
                res.end('<h1>500 Internal Server Error</h1>')
            } else {
                res.setHeader('Content-Type', 'image/png')
                res.end(data)
            }
        })
    } else if (req.url == '/contacto') {
        res.end("<h1>Contact</h1>")
    } else {
        res.statusCode = 400
        res.end("<h1>404 Not Found</h1>")
    }
}

const server = http.createServer(processRequest)

server.listen(desiredPort, () => {
    console.log(`server listening on port http://localhost:${desiredPort}`)
})