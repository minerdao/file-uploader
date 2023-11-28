import * as http from 'http'
import * as fs from 'fs'
import * as path from 'path'

const startClient = (directory: string) => {
  const serverHostname = 'localhost'
  const serverPort = 3000
  
  fs.readdir(directory, (err, files) => {
    if (err) {
      console.error('Error reading directory:', err.message)
      return
    }

    const basePath = path.basename(directory)
  
    files.forEach((file) => {
      const filePath = path.join(directory, file)
      const stats = fs.statSync(filePath)

      // 确保是文件而不是目录
      if (stats.isFile()) {
        const fileStream = fs.createReadStream(filePath)
        
        const options = {
          hostname: serverHostname,
          port: serverPort,
          path: '/upload/' + encodeURIComponent(file),
          method: 'POST',
          headers: {
            'Content-Length': stats.size,
            'postname': basePath
          },
        }
  
        const req = http.request(options, (res) => {
          console.log(`STATUS: ${res.statusCode}`)
          res.setEncoding('utf8')
          res.on('data', (chunk) => {
            console.log(`${chunk}`)
          })
          res.on('end', () => {
            console.log('File uploaded:', file)
          })
        })
  
        req.on('error', (e) => {
          console.error(`problem with request: ${e.message}`)
        })
  
        // 将文件流发送到服务器
        fileStream.pipe(req)
  
        // 当文件读取完成后，结束请求
        fileStream.on('end', () => {
          req.end()
        })
      }
    })
  })
}

export default startClient
