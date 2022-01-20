#!/usr/bin/env node

import { Command } from 'commander/esm.mjs'
import SftpServer from '../Server.js'

const exampleKeyFile = (new URL('../examples/test.key', import.meta.url)).pathname
const program = new Command()

program
  .option('-p, --port <port>', 'listener port', v => parseInt(v))
  .option('-k, --key-file <path>', 'path to keyfile', exampleKeyFile)
  .option('-r, --root <path>', 'root directory')
  .option('-u, --user <user>', 'user')
  .option('-p, --password <password>', 'password')
  .action(async ({ port, keyFile, root, user, password }) => {
    const server = new SftpServer({ port, root, user, password, keyFile })

    server.on('error', err => console.error(err))
    process.on('SIGINT', () => server.stop())

    await server.start()

    console.error(`listing on ${server.port}`)
  })

program.parse(process.argv)
