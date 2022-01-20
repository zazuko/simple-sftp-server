import { join } from 'path'
import fs from 'fs-extra'
import sftpFs from 'sftp-fs'
import { PermissionDeniedError } from 'sftp-fs/lib/errors.js'
import convFlags from './convFlags.js'
import longname from './longname.js'

class JailedFileSystem extends sftpFs.ImplFileSystem {
  constructor (username, password, rootPath) {
    super(username, password)

    this.rootPath = rootPath
  }

  async authenticate (session, request) {
    const validMethods = ['password', 'publickey', 'none']
    const method = request.method

    if (!validMethods.includes(method)) {
      return validMethods
    }

    if (method === 'none' && this.username) {
      throw new PermissionDeniedError()
    }

    if (method === 'password') {
      if (request.username !== this.username || request.password !== this.password) {
        throw new PermissionDeniedError()
      }
    }
  }

  async open (session, handle, flags, attrs) {
    const id = await fs.open(this.resolve(handle.pathname), convFlags(flags), attrs.mode)

    handle.setParam('id', id)
    handle.addDisposable(async () => fs.close(id))
  }

  async stat (session, pathname) {
    return super.stat(session, this.resolve(pathname))
  }

  async lstat (session, pathname) {
    return super.lstat(session, this.resolve(pathname))
  }

  async listdir (session, handle) {
    if (handle.getParam('eof')) {
      return
    }

    const list = []
    const files = await fs.readdir(this.resolve(handle.pathname))

    for (const filename of files) {
      const attrs = await this.lstat(session, join(handle.pathname, filename))
      const num = 1 // TODO: Number of links and directories inside this directory

      list.push({
        filename,
        longname: longname(filename, attrs, num),
        attrs
      })
    }

    handle.setParam('eof', true)

    return list
  }

  async mkdir (session, pathname, attrs) {
    return super.mkdir(session, this.resolve(pathname), attrs)
  }

  async setstat (session, pathname, attrs) {
    return super.setstat(session, this.resolve(pathname), attrs)
  }

  async rename (session, oldPathname, newPathname) {
    await super.rename(session, this.resolve(oldPathname), this.resolve(newPathname))
  }

  async rmdir (session, pathname) {
    return super.rmdir(session, this.resolve(pathname))
  }

  async remove (session, pathname) {
    return super.remove(session, this.resolve(pathname))
  }

  async realpath (session, pathname) {
    const realpath = await super.realpath(session, this.resolve(pathname))

    if (!realpath.startsWith(this.rootPath)) {
      throw new PermissionDeniedError()
    }

    return realpath.slice(this.rootPath.length) || '/'
  }

  async readlink (session, pathname) {
    return super.readlink(session, this.resolve(pathname))
  }

  async symlink (session, targetPathname, linkPathname) {
    return super.symlink(session, this.resolve(targetPathname), this.resolve(linkPathname))
  }

  resolve (pathname) {
    return join(this.rootPath, pathname)
  }
}

export default JailedFileSystem
