const chalk = require('chalk');
const util = require('./utils');

const LEVELS = {
  INFO: 0,
  WARN: 1,
  ERROR: 2,
  DEBUG: 3
}

let logStatus: Boolean = process.env.MODE ? true : false;
let logLevel: Number = LEVELS[process.env.MODE] || LEVELS.INFO;

function setLogConfig (status: Boolean, logLevel: Number) {
  logStatus = status;
  logLevel = logLevel;
}

function printLog(content, type) {
    if (!logStatus) {
      return;
    }
    const timeString = util.formatDate(new Date(), 'YYYY-MM-DD hh:mm:ss');
    switch (type) {
      case LEVELS.INFO: {
        if (logLevel <= LEVELS[type]) {
          return;
        }
        console.log(chalk.cyan(`[XProxy Info][${timeString}]: ` + content));
        break;
      }
      case LEVELS.WARN: {
        if (logLevel <= LEVELS[type]) {
          return;
        }
        console.error(chalk.yellow(`[XProxy WARN][${timeString}]: ` + content));
        break;
      }
      case LEVELS.ERROR: {
        if (logLevel <= LEVELS[type]) {
          return;
        }
        console.error(chalk.red(`[XProxy ERROR][${timeString}]: ` + content));
        break;
      }
      case LEVELS.DEBUG: {
        if (logLevel <= LEVELS[type]) {
          return;
        }
        console.log(chalk.cyan(`[XProxy Debug][${timeString}]: ` + content));
        return;
      }
      default : {
        console.log(chalk.cyan(`[XProxy Log][${timeString}]: ` + content));
        break;
      }
    }
}
module.exports.printLog = printLog;

module.exports.debug = (content) => {
  printLog(content, LEVELS.DEBUG);
};

module.exports.info = (content) => {
  printLog(content, LEVELS.INFO);
};

module.exports.warn = (content) => {
  printLog(content, LEVELS.WARN);
};

module.exports.error = (content) => {
  printLog(content, LEVELS.ERROR);
};
