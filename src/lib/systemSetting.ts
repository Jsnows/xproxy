'use strict'

const child_process = require('child_process');
const networkTypes: Array <String> = ['Ethernet' , 'Thunderbolt Ethernet', 'Wi-Fi'];
let currentNetworkType: String;

function _execSync(cmd) {
  let stdout,
    status = 0;
  try {
    stdout = child_process.execSync(cmd);
  } catch (err) {
    stdout = err.stdout;
    status = err.status;
  }

  return {
    stdout: stdout.toString(),
    status
  };
}

// 获取当前网络类型
const getNetworkType = function(): String {
  let type: String = 'unknow';
  for (let i = 0; i < networkTypes.length; i++) {
    const _type: String = networkTypes[i],
    result = _execSync('networksetup -getwebproxy ' + _type);
    if (result.status === 0) {
      currentNetworkType = type = _type;
      break;
    }
  }
  return type;
};

// 获取需要代理的域名
const getProxybyPassDomains = function (): Array<String> {
  let passDomains = _execSync(`networksetup -getproxybypassdomains ${getNetworkType()}`).stdout;
  let currentPassDomains: Array<String> = [];
  try{
    currentPassDomains = passDomains.split('\n');
    while(currentPassDomains.indexOf('') != -1){
      currentPassDomains.splice(currentPassDomains.indexOf(''),1);
    }
  }catch(err){throw err}
  return currentPassDomains;
}

// 设置需要忽略代理的域名
const setProxybyPassDomains = function (passDomainsArr: Array<String>): void {
  if (passDomainsArr.length > 0) {
    _execSync(`networksetup -setproxybypassdomains ${getNetworkType()} ${passDomainsArr.join(' ')}`);
  }
}

// 设置全局代理
const setGlobalProxy = function (ip: String, port: Number, proxyType: String): any {
  if (!ip || !port) {
    throw '请传入代理ip和代理端口号';
  } else {
    proxyType = proxyType || 'http';
    const networkType: any = currentNetworkType || getNetworkType();
    return /^http$/i.test(<any>proxyType) ?
      // set http proxy
      _execSync(
        'networksetup -setwebproxy ${networkType} ${ip} ${port}'
          .replace(/\${networkType}/g, networkType)
          .replace('${ip}', <any>ip)
          .replace('${port}', <any>port)) :

      // set https proxy
      _execSync('networksetup -setsecurewebproxy ${networkType} ${ip} ${port}'
        .replace(/\${networkType}/g, networkType)
        .replace('${ip}', <any>ip)
        .replace('${port}', <any>port));
  }
};

// 取消系统代理
const cancelGlobalProxy = function(proxyType): any {
  proxyType = proxyType || 'http';
  const networkType: any = currentNetworkType || getNetworkType();
  return /^http$/i.test(proxyType) ?
    // set http proxy
    _execSync(
      'networksetup -setwebproxystate ${networkType} off'
        .replace('${networkType}', networkType)) :
    // set https proxy
    _execSync(
      'networksetup -setsecurewebproxystate ${networkType} off'
        .replace('${networkType}', networkType));
};

const getProxyState = function(): any {
  const networkType: any = currentNetworkType || getNetworkType();
  const result = _execSync('networksetup -getwebproxy ${networkType}'.replace('${networkType}', networkType));
  return result;
};
module.exports.macSystem = {
  getProxybyPassDomains,
  setProxybyPassDomains,
  setGlobalProxy,
  cancelGlobalProxy,
  getProxyState
};