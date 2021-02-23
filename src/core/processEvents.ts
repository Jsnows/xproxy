const { macSystem } = require('../lib/systemSetting');
module.exports = function (): void {
  process.on('exit', code => {
    macSystem.setGlobalProxy('127.0.0.1', 8001, 'http');
  });
  process.on('SIGINT', function () {
    macSystem.setGlobalProxy();
    process.exit();
  });
  process.on('unhandledRejection', err => {
    
  });
  process.on('uncaughtException', err => {

  });
}