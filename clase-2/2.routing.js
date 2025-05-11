const http = require('node:http')
const fs = require('node:fs')

const desiredPort = process.env.PORT ?? 1234

// const processRequest = (req, res) => {
//     console.log(`equested received: ${req.url}`)
//     res.setHeader('Content-Type', 'text/html; charset=utf-8')
//     if (req.url == '/') {
//         res.end("<h1>Bienvenido a mi página de inicio</h1>")
//     } else if (req.url == '/favicon.ico') {
//         fs.readFile('./favicon.ico', (err, data) => {
//             if (err) {
//                 res.end('<h1>500 Internal Server Error</h1>')
//             } else {
//                 res.setHeader('Content-Type', 'image/png')
//                 res.end(data)
//             }
//         })
//     } else if (req.url == '/contacto') {
//         res.end("<h1>Contact</h1>")
//     } else {
//         res.statusCode = 400
//         res.end("<h1>404 Not Found</h1>")
//     }
// }

function processRequest(req, res) {
    const { method, url } = req

    console.log(`equested received: ${method} -> ${url}`)

    switch (method) {
        case 'GET':
            switch (url) {
                case '/':
                    res.setHeader('Content-Type', 'text/html; charset=utf-8')
                    res.end("<h1>Bienvenido a mi página de inicio</h1>")
                    break
                case '/favicon.ico':
                    fs.readFile('./favicon.ico', (err, data) => {
                        if (err) {
                            res.setHeader('Content-Type', 'text/html; charset=utf-8')
                            res.end('<h1>500 Internal Server Error</h1>')
                        } else {
                            res.setHeader('Content-Type', 'image/png')
                            res.end(data)
                        }
                    })
                    break
                default:
                    res.statusCode = 404
                    res.setHeader('Content-Type', 'text/html; charset=utf-8')
                    res.end(`<h1>404</h1><h2>'${url}' Not Found.</h2>`) 
                    break
            }
            break
        case 'POST':
            switch (url) {
                case '/create': {
                    let body = ''
                    req.on('data', chunk => {
                        body += chunk.toString()
                    })

                    req.on('end', () => {
                        const data = JSON.parse(body)

                        res.writeHead(201, { 'Content-Type': 'application/json; charset=utf-8' })
                        data.trace = `Recived at ${Date.now()}`
                        res.end(JSON.stringify(data))
                    })
                    break
                }
                default:
                    res.statusCode = 404
                    res.setHeader('Content-Type', 'text/html; charset=utf-8')
                    res.end(`<h1>404</h1><h2>'${url}' Not Found.</h2>`) 
                    break
            }
        default: break
    }
}

const server = http.createServer(processRequest)

server.listen(desiredPort, () => {
    console.log(`server listening on port http://localhost:${desiredPort}`)
})