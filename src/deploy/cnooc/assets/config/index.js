const dev = process.env.NODE_ENV !== 'production'
let tempCardBaseUrl = 'https://epay.cnooc.com.cn' // 生产
if (window.location.href.indexOf('imtest') > -1) {
  tempCardBaseUrl = 'https://epaytest.cnooc.com.cn' // 测试
}
export default {
  baseURL: dev ? '/' : '',
  cardBaseURL: tempCardBaseUrl, // 卡页面地址
  // mapak: 'oWbRPSoypx6ojPTEYQXNZ1qEWQAxinbX', // 公司
  mapak: 'KiG7iFx8miivMFGAoWPYIyG6CWYUHUC3', // 海油
}
