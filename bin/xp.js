#!/usr/bin/env node

'use strict';

const program = require('commander'),
      packageInfo = require('../package.json')

program
  .version(packageInfo.version)
  .option('-p, --port [value]', 'proxy port, 8001 for default')
  .option('-w, --web [value]', 'web GUI port, 8002 for default')
  .option('-r, --rule [value]', 'path for rule file,')
  .option('-l, --throttle [value]', 'throttle speed in kb/s (kbyte / sec)')
  .option('-i, --intercept', 'intercept(decrypt) https requests when root CA exists')
  .option('-s, --silent', 'do not print anything into terminal')
  .option('-c, --clear', 'clear all the certificates and temp files')
  .option('--ws-intercept', 'intercept websocket')
  .option('--ignore-unauthorized-ssl', 'ignore all ssl error')
  .parse(process.argv);

console.log(program.port);

