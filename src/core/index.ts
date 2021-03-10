const http = require('http');
const https = require('https');
const async = require("async");
const url = require('url');
const processEvents = require('./processEvents');
const logger = require('../lib/log');
const baseConfig = require('./baseConfig');
const systemSetting = require('../lib/systemSetting');
let config = baseConfig;


const getRequestData = function(req) {
  let fetchData: Array<any>;
  return new Promise((success, fail) => {
    req.on('data', br => {
      fetchData.push(br);
    });
    req.on('end', () => {
      success(Buffer.concat(fetchData));
    });
    req.on('error', (error) => {
      fail(error);
    });
  });
}

const proxyServer = http.createServer(async (req, res) => {
  let reqData = await getRequestData(req);
  
})
proxyServer.listen(config.port, () => {
  logger.info(`listenning ${config.port}`);
  systemSetting.macSystem.setGlobalProxy(config.server, config.port, 'http');
  processEvents();
  
});
