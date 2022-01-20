import fs from 'fs-extra'

function longname (name, attrs, num) {
  let str = '-'

  if (attrs.isDirectory()) {
    str = 'd'
  } else if (attrs.isSymbolicLink()) {
    str = 'l'
  }

  str += (attrs.mode & fs.constants.S_IRUSR) ? 'r' : '-'
  str += (attrs.mode & fs.constants.S_IWUSR) ? 'w' : '-'
  str += (attrs.mode & fs.constants.S_IXUSR) ? 'x' : '-'
  str += (attrs.mode & fs.constants.S_IRGRP) ? 'r' : '-'
  str += (attrs.mode & fs.constants.S_IWGRP) ? 'w' : '-'
  str += (attrs.mode & fs.constants.S_IXGRP) ? 'x' : '-'
  str += (attrs.mode & fs.constants.S_IROTH) ? 'r' : '-'
  str += (attrs.mode & fs.constants.S_IWOTH) ? 'w' : '-'
  str += (attrs.mode & fs.constants.S_IXOTH) ? 'x' : '-'
  str += ' '
  str += num
  str += ' '
  str += attrs.uid
  str += ' '
  str += attrs.gid
  str += ' '
  str += attrs.size
  str += ' '
  str += attrs.mtime.toDateString().slice(4)
  str += ' '
  str += name

  return str
}

export default longname
