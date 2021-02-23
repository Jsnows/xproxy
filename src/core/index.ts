const http = require('http');
const https = require('https');
const async = require("async");

const proxyServer = http.createServer((req, res) => {
  let reqData: Buffer;
  async.series([
    (next): void => {
      const postData = [];
      console.log(req.url);
      req.on('data', (chunk) => {
        postData.push(chunk);
      });
      req.on('end', () => {
        reqData = Buffer.concat(postData);
        console.log('第一步完成');
        next();
      });
    },
    (next): void => {
      console.log('第二步完成');
      next();
    }
  ], function(err): void {
    if (!err) {
      console.log('流程完成');
    }
  });
  res.end('ok');
});
proxyServer.listen(8001, () => {
  console.log('start1');
});
