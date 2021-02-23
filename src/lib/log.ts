const chalk = require('chalk');
let logStatus: Boolean = false;
function printLog(content, type) {
    if (!ifPrint) {
      return;
    }
  
    const timeString = util.formatDate(new Date(), 'YYYY-MM-DD hh:mm:ss');
    switch (type) {
      case LogLevelMap.tip: {
        if (logLevel > 0) {
          return;
        }
        console.log(chalk.cyan(`[XProxy Log][${timeString}]: ` + content));
        break;
      }
  
      case LogLevelMap.system_error: {
        if (logLevel > 1) {
          return;
        }
        console.error(chalk.red(`[XProxy ERROR][${timeString}]: ` + content));
        break;
      }
  
      case LogLevelMap.rule_error: {
        if (logLevel > 2) {
          return;
        }
  
        console.error(chalk.red(`[XProxy RULE_ERROR][${timeString}]: ` + content));
        break;
      }
  
      case LogLevelMap.warn: {
        if (logLevel > 3) {
          return;
        }
  
        console.error(chalk.yellow(`[XProxy WARN][${timeString}]: ` + content));
        break;
      }
  
      case LogLevelMap.debug: {
        console.log(chalk.cyan(`[XProxy Log][${timeString}]: ` + content));
        return;
      }
  
      default : {
        console.log(chalk.cyan(`[XProxy Log][${timeString}]: ` + content));
        break;
      }
    }
  }