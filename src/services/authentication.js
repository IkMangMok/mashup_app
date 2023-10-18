const crypto = require('crypto');
const base64 = require('base64-js');
const querystring = require('querystring');
const { Buffer } = require('buffer');

// 从讯飞控制台获取的APIKey和APISecret
const APIKey = 'b8904d156bc2d6d74ccfde5fd656b56b';
const APISecret = 'ZGMwYjgzZDIxMWMwZTg1NDQ3ZjE3Y2Mx';

function generateAuthHeader()
{
    // 获取当前时间，并格式化为RFC1123格式
    const date = (new Date()).toUTCString();
    const host = 'spark-api.xf-yun.com';
    // 构造待签名的字符串
    const tmp = `host: ${host}\ndate: ${date}\nGET /v2.1/chat HTTP/1.1`;
    // 利用hmac-sha256算法和APISecret对待签名字符串进行签名，获得签名后的摘要tmp_sha
    const tmp_sha = crypto.createHmac('sha256', APISecret).update(tmp).digest();
    // 将上方的tmp_sha进行base64编码生成signature
    const signature = base64.fromByteArray(Array.from(tmp_sha));
    // 构造authorization_origin字符串
    const authorization_origin = `api_key="${APIKey}", algorithm="hmac-sha256", headers="host date request-line", signature="${signature}"`;
    // 将上方的authorization_origin进行base64编码，生成最终的authorization
    const authorization = base64.fromByteArray(Array.from(Buffer.from(authorization_origin)));
    return authorization;
}

function generateURL() {
    const authorization = generateAuthHeader();
    const date = (new Date()).toUTCString();
    const params = {
        authorization: authorization,
        date: date,
        host: 'spark-api.xf-yun.com'
    };
    const queryString = querystring.stringify(params);
    const url = 'wss://spark-api.xf-yun.com/v2.1/chat?' + queryString;
    console.log(url);
    return url;
}

module.exports = {
    generateAuthHeader,
    generateURL
};