const express = require("express")
const fs = require("fs")
const path = require("path")

const PORT = process.env.PORT || 3001

const app = express()

const dataDir = path.resolve(__dirname, "../pinnacle-2021/data")

app.get("/paths", (req, res) => {
  res.json(
    fs
      .readdirSync(dataDir, { withFileTypes: true })
      .filter((e) => !e.isDirectory() && !e.name.startsWith("."))
      .map(e => e.name)
  )
})

app.get("/paths/:file", (req, res) => {
  const { file } = req.params
  const dataPath = path.join(dataDir, file)

  if (!file || !file.includes(".geojson") || !fs.existsSync(dataPath)) {
    res.status(404)
    res.end('404 Not Found')
    return
  }

  const data = JSON.parse(fs.readFileSync(dataPath))

  const {
    TIME_START,
    TIME_END,
    TIME_STEP,
  } = data.properties

  const numCoords = data.geometry.coordinates.length
  const newTimeEnd = TIME_START + Math.ceil(TIME_STEP * numCoords)

  if (newTimeEnd !== TIME_END) {

    data.properties.TIME_END = newTimeEnd
  }

  res.json(data)
})

app.listen(PORT)
console.log(`[i] Server listening on: ${PORT}`)
