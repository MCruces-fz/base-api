const express = require('express')
const movies = require('./movies.json')
const fs = require('node:fs')
const crypto = require('node:crypto')
const { validateMovie } = require('./schemes/movies')

const app = express()
app.use(express.json()) // middleware to read json correctly developed by express
app.disable('x-powered-by')

app.get('/favicon.ico', (req, res) => {
  fs.readFile('./favicon.ico', (err, data) => {
    if (err) {
      res.status(500).end('<h1>500 Internal Server Error</h1>')
    } else {
      res.end(data)
    }
  })
})

app.get('/movies', (req, res) => {
  const { genre, year } = req.query

  let filteredMovies = movies
  if (genre) { filteredMovies = filteredMovies.filter(movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())) }
  if (year) { filteredMovies = filteredMovies.filter(movie => movie.year.toString() === year) }

  res.json(filteredMovies)
})

app.get('/movies/:id', (req, res) => {
  const { id } = req.params

  const movie = movies.find(movie => movie.id === id)
  if (movie) return res.json(movie)
  res.status(404).end(`<h1>404 Not found movie with id ${id}</h1>`)
})

app.post('/movies', (req, res) => {
  const result = validateMovie(req.body)

  if (!result.success) {
    return res.status(422).json({ error: JSON.parse(result.error.message) })
  }

  const newMovie = {
    id: crypto.randomUUID(),
    ...result.data
  }

  movies.push(newMovie)

  res.status(201).json(newMovie)
})

app.use((req, res) => {
  res.setHeader('Content-Type', 'text/html; charset:utf-8')
  res.end(`<h1>404 Not Found ${req.url}</h1>`)
})

const port = process.env.PORT ?? 1234

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`)
})
