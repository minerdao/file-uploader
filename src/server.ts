import * as http from 'http'
import * as fs from 'fs'
import * as path from 'path'

interface UploadStats {
  fileSize: number
  startTime: number
  endTime?: number
}

const uploadStats: Record<string, UploadStats> = {}
const uploadPath = '/Users/max/data/savepath'

const server = http.createServer((req, res) => {
  if (req && req.url && req.method === 'POST') {
    const filename = path.basename(req.url)
    const { postname } = req.headers
    if (postname && filename) {
      const savePath = `${uploadPath}/${postname}`
      if (!fs.existsSync(savePath)) {
        fs.mkdirSync(savePath)
      }
      
      const destPath = path.join(savePath, filename)
      console.log(`Uploading ${filename} and save to ${destPath}`);

      const fileWriteStream = fs.createWriteStream(destPath)

      const stats: UploadStats = {
        fileSize: 0,
        startTime: Date.now(),
      }
      uploadStats[filename] = stats

      req.on('data', (chunk) => {
        stats.fileSize += chunk.length
      })

      req.pipe(fileWriteStream)

      req.on('end', () => {
        stats.endTime = Date.now()
        const duration = (stats.endTime - stats.startTime) / 1000 // seconds
        const speed = (stats.fileSize / duration) / (1024 * 1024) // MB/sec

        res.writeHead(200, { 'Content-Type': 'text/plain' })
        res.end(`File uploaded successfully. Speed: ${speed.toFixed(2)} MB/sec`)

        // Print overall stats
        printOverallStats()
      })
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' })
    res.end('Not Found')
  }
})


const startServer = () => {
  const port = 3000
  server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`)
  })
}


function printOverallStats() {
  const totalSize = Object.values(uploadStats).reduce((acc, stats) => acc + stats.fileSize, 0)
  const totalDuration = Object.values(uploadStats).reduce((acc, stats) => {
    if (stats.endTime) {
      return acc + (stats.endTime - stats.startTime)
    }
    return acc
  }, 0) / 1000 // seconds

  if (totalDuration > 0) {
    const overallSpeed = (totalSize / totalDuration) / (1024 * 1024) // MB/sec
    console.log(`Overall speed: ${overallSpeed.toFixed(2)} MB/sec`)
  }
}

export default startServer
