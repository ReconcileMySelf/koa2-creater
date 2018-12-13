/**
 * 查询依赖包的版本
 * Created by haoran.shu on 2018/12/12 11:23.
 */
const https = require('https');

let ps = function(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let resData = '', statusCode = res.statusCode;
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        resData += chunk;
      });
      res.on('end', () => {
        if (statusCode >= 200 && statusCode < 300) {
          resolve(JSON.parse(resData));
        } else {
          reject(new Error(statusCode + ' & ' + res.statusText));
        }
      });
    }).on('error', (e) => {
      reject(e);
    });
  });
};

module.exports = function(packageName) {
  return ps(`https://api.npms.io/v2/package/${packageName}`)
    .then(function(r) {
      let metadata = r.collected.metadata;
      return { name: metadata.name, version: metadata.version };
    });
};