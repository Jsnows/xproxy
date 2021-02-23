'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');

/**
 * 驼峰转小写 {"Content-Encoding":"gzip"} --> {"content-encoding":"gzip"}
 */
const toLowerkeys = function<T> (obj: T): T {
  for (const key in obj) {
    const val = obj[key];
    delete obj[key];
    obj[key.toLowerCase()] = val;
  }
  return obj;
};
/*
 * 对象合并
*/
const merge = function (baseObj: any, extendObj: any): any {
  for (const key in extendObj) {
    baseObj[key] = extendObj[key];
  }
  return baseObj;
};
/**
 * 获取本机home路径
 */
const getUserHome = function (): string {
  return process.env.HOME || process.env.USERPROFILE;
}

/*
* 删除缓存重新载入模块
*/
const freshRequire = function (modulePath: string): NodeRequire {
  delete require.cache[require.resolve(modulePath)];
  return require(modulePath);
};

/*
* 时间转换
* @param Date或者时间戳
* @param  YYYYMMDDHHmmss
*/
const formatDate = function (date: String | Number | Date, formatter: String) {
  if (typeof date !== 'object') {
    date = new Date(date);
  }
  const transform = function (value) {
    return value < 10 ? '0' + value : value;
  };
  return formatter.replace(/^YYYY|MM|DD|hh|mm|ss/g, (match) => {
    switch (match) {
      case 'YYYY':
        return transform(date.getFullYear());
      case 'MM':
        return transform(date.getMonth() + 1);
      case 'mm':
        return transform(date.getMinutes());
      case 'DD':
        return transform(date.getDate());
      case 'hh':
        return transform(date.getHours());
      case 'ss':
        return transform(date.getSeconds());
      default:
        return ''
    }
  });
};

/**
 * 获取本地ip
 */
const getLocalIp = function(): String {
  const ifaces = os.networkInterfaces();
  let lookupIpAddress = null;
  for (let dev in ifaces) {
    if (dev.indexOf('en') == 0 || dev.indexOf('eth') == 0) {
      ifaces[dev].forEach(function (details) {
        if (details.family == 'IPv4' && !lookupIpAddress) {
          lookupIpAddress = details.address;
        }
      });
    }
  }
  return lookupIpAddress || '127.0.0.1';
}

/**
 * 删除文件内容
 */
const deleteFolderContentsRecursive = function(dirPath: String, ifClearFolderItself: Boolean): void {
  if (!dirPath.trim() || dirPath === '/') {
    throw new Error('can_not_delete_this_dir');
  }

  if (fs.existsSync(dirPath)) {
    fs.readdirSync(dirPath).forEach((file) => {
      const curPath = path.join(dirPath, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolderContentsRecursive(curPath, true);
      } else { // delete all files
        fs.unlinkSync(curPath);
      }
    });

    if (ifClearFolderItself) {
      try {
        // ref: https://github.com/shelljs/shelljs/issues/49
        const start = Date.now();
        while (true) {
          try {
            fs.rmdirSync(dirPath);
            break;
          } catch (er) {
            if (process.platform === 'win32' && (er.code === 'ENOTEMPTY' || er.code === 'EBUSY' || er.code === 'EPERM')) {
              // Retry on windows, sometimes it takes a little time before all the files in the directory are gone
              if (Date.now() - start > 1000) throw er;
            } else if (er.code === 'ENOENT') {
              break;
            } else {
              throw er;
            }
          }
        }
      } catch (e) {
        throw new Error('could not remove directory (code ' + e.code + '): ' + dirPath);
      }
    }
  }
}

/**
 * 获取可用端口号
 */
const getFreePort = function (): Promise<Number> {
  return new Promise((resolve, reject) => {
    const server = require('net').createServer();
    server.unref();
    server.on('error', reject);
    server.listen(0, () => {
      const port = parseInt(server.address().port);
      server.close(() => {
        resolve(port);
      });
    });
  });
}

/**
 * 判断是否为函数
 */
const isFunc = function (source) {
  return source && Object.toString.call(source) === '[object Function]';
};

/**
* 内容大小
*/
const getByteSize = function (content): Number {
  return Buffer.byteLength(content);
};

/**
 * 是否为ip
 */
const isIpDomain = function (domain) {
  if (!domain) {
    return false;
  }
  const ipReg = /^\d+?\.\d+?\.\d+?\.\d+?$/;
  return ipReg.test(domain);
};

/**
 * 判断是否为windows系统
 */
const isWin = function () {
  return /^win/.test(process.platform);
}

/**
 * 异步检查方法
 */
const waitStatus = function(callback): Promise<void> {
  return new Promise((res)=>{
    let t = setInterval(()=>{
      if (callback() === true) {
        clearInterval(t);
        res();
      }
    }, 0);
  });
}
/**
 * 解析URL参数
 */
const query2json = function(path): any {
  if (typeof path === 'string') {
    let queryArr = path.split('?')[1] ? path.split('?')[1].split('&') : [];
    let result = {};
    queryArr.forEach((item, index) => {
      let key = item.split('=')[0];
      let value = decodeURIComponent(item.split('=')[1] || '');
      result[key] = value;
    });
    return result;
  } else {
    return path;
  }
}
/**
 * 参数对象转字符串
 */
const json2string = function(queryJson): String {
  if (typeof queryJson === 'string') {
    try{
      queryJson = JSON.parse(queryJson);
    } catch(err) {
      queryJson = queryJson;
    }
  }
  if (typeof queryJson === 'object') {
    let keys = Object.keys(queryJson);
    let result = [];
    keys.forEach((item, index)=>{
      result.push(`${item}=${encodeURIComponent(queryJson[item])}`);
    });
    return result.join('&');
  } else {
    return queryJson;
  }
}
module.exports = {
  json2string,
  query2json,
  isWin,
  isIpDomain,
  getByteSize,
  waitStatus,
  isFunc,
  getFreePort,
  deleteFolderContentsRecursive,
  getLocalIp,
  formatDate,
  freshRequire,
  getUserHome,
  merge,
  toLowerkeys
}