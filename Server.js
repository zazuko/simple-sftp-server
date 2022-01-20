import EventEmitter from 'events'
import sftpFs from 'sftp-fs'
import JailedFileSystem from './lib/JailedFileSystem.js'

class SftpServer extends EventEmitter {
  constructor ({ port = 8022, root = process.cwd(), user, password, keyFile } = {}) {
    super()

    this.port = port
    this.keyFile = keyFile
    this.filesSystem = new JailedFileSystem(user, password, root)

    this.server = new sftpFs.Server(this.filesSystem)
  }

  get options () {
    return {
      protocol: 'sftp',
      host: 'localhost',
      port: this.port,
      user: this.filesSystem.username || 'anonymous',
      password: this.filesSystem.password
    }
  }

  async start () {
    this.server.on('error', err => this.emit('error', err))

    return this.server.start(this.keyFile, this.port)
  }

  async stop () {
    return this.server.stop()
  }
}

export default SftpServer
