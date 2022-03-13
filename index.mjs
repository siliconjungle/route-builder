import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const app = express()
const port = process.env.PORT || 3000

app.use(express.static('public'))

app.get('*', (req, res, next) => {
  console.log(req.path)
  res.sendFile(`${__dirname}/public/index.html`)
})

app.listen(port, () => {
  console.log(`Your app is listening to port ${port}`)
})
