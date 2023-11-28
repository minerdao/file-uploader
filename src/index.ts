import startServer from './server'
import startClient from './client'

// 获取命令行参数来决定运行客户端还是服务器
const [,, service, ...args] = process.argv
console.log('service: ', service);

switch (service) {
  case 'server':
    startServer()
    break
  case 'client':
    // 假设命令行中第二个参数是文件或目录的路径
    const filePath = args[0]
    if (!filePath) {
      console.error('Please provide a file or directory path for the client.')
      process.exit(1)
    }
    startClient(filePath)
    break
  default:
    console.error('Please specify "server" or "client" to start the appropriate service.')
    process.exit(1)
}
