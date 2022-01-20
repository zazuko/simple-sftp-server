import fs from 'fs-extra'
import { OPEN_MODE } from 'ssh2/lib/protocol/SFTP.js'

function convFlags (flags) {
  let mode = 0

  if ((flags & OPEN_MODE.READ) && (flags & OPEN_MODE.WRITE)) {
    mode = fs.constants.O_RDWR
  } else if (flags & OPEN_MODE.READ) {
    mode = fs.constants.O_RDONLY
  } else if (flags & OPEN_MODE.WRITE) {
    mode = fs.constants.O_WRONLY
  }

  if (flags & OPEN_MODE.CREAT) {
    mode |= fs.constants.O_CREAT
  }

  if (flags & OPEN_MODE.APPEND) {
    mode |= fs.constants.O_APPEND
  }

  if (flags & OPEN_MODE.EXCL) {
    mode |= fs.constants.O_EXCL
  }

  if (flags & OPEN_MODE.TRUNC) {
    mode |= fs.constants.O_TRUNC
  }

  return mode
}

export default convFlags
