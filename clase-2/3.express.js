const express = require('express')
const fs = require('node:fs')

const PORT = process.env.PORT ?? 1234

const app = express()
app.disable('x-powered-by')

app.use((req, res, next) => {
    console.log(`Requested ${req.method} -> ${req.url}`)
    if (req.method != 'POST') { return next() }
    if (req.headers['content-type'] != 'application/json') { return next() }

    let body = ''
    req.on('data', chunk => {
        body += chunk.toString()
    })

    req.on('end', () => {
        req.body = JSON.parse(body)
        next()
    })
})

app.get('/favicon.ico', (req, res) => {
    fs.readFile('./favicon.ico', (err, data) => {
        if (err) {
            res.send('<h1>Failed to load file Favicon')
        } else {
            res.send(data)
        }
    })
})

app.get('/', (req, res) => {
    res.send('<h1>My Page!</h1>')
})

app.post('/create', (req, res) => {
    let responseData = req.body
    responseData.trace = `Response modified at ${Date.now()}`
    res.status(201).send(req.body)
})

app.use((req, res) => {
    res.status(404).send('<h1>404 Not Found</h1>')
})

app.listen(PORT, () => {
    console.log(`server listening on http://localhost:${PORT}`)
})