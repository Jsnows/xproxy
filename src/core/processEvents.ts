const systemSetting = require('../lib/systemSetting');
const logger = require('../lib/log');

module.exports = function (): void {
  process.on('exit', code => {
    systemSetting.macSystem.cancelGlobalProxy();
  });
  process.on('SIGINT', function () {
    systemSetting.macSystem.cancelGlobalProxy();
    process.exit();
  });
  process.on('unhandledRejection', err => {
    
  });
  process.on('uncaughtException', err => {

  });
}
export {};