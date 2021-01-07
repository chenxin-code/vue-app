import Http from '../../http'

class Jwx {
  constructor(jsApiList) {
    this.jsApiList = jsApiList
  }

  // 隐藏所有非基础按钮
  // 文档地址 https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/JS-SDK.html#46
  hideNonMenu() {
    this._init(['hideAllNonBaseMenuItem']).then(() => {
      wx.hideAllNonBaseMenuItem()
    })
  }

  _init(jsApiList) {
    return new Promise((resolve, reject) => {
      this._getConfig().then(res => {
        wx.config({
          // debug: true,
          appId: res.appid, // 必填，公众号的唯一标识
          timestamp: res.timestamp, // 必填，生成签名的时间戳
          nonceStr: res.nonce, // 必填，生成签名的随机串
          signature: res.signature, // 必填，签名
          jsApiList: jsApiList // 必填，需要使用的JS接口列表
        })
        wx.ready(() => {
          console.log('微信签名配置成功')
          resolve()
        })
        wx.error(function (res1) {
          reject(res1)
          // alert(res)
          console.log(`请求信息：${JSON.stringify(res)}-----错误信息：${JSON.stringify(res1)}`)
        })
      }).catch(function (error) {
        reject()
        console.log('发生错误！', error)
      })
    })
  }

  _getConfig() {
    return new Promise((resolve, reject) => {
      /* resolve({
       'signature': 'ade79c33b4d059aee6053faeb1942247cb0b8785',
       'timestamp': '1539253502',
       'nonce': '5e7f7fa5-e87f-4e7d-a816-e215b66531c6',
       'url': 'http://localhost:8900/hboildrop/certification',
       'jspApiTicket': 'kgt8ON7yVITDhtdwci0qea4AiugAQb8EoMdQtXeMymJCraWo2_pO7ZLXjUuzO6-IP3lsG-8SDUAa3sAWizMh6Q',
       'echostr': '',
       'appid': 'wx83faf1720924e936'
       }) */
      let href = '';
      let u = navigator.userAgent;
      let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      if(isiOS){
        href = window.initUrl;
      }else {
        href = window.location.href.split('#')[0];
      }
      // href = 'http://test.uhuitong.com/app-vue/app/index.html#/invitation-details'
      Http.post('/app/json/wx/getAccessToken', {url: encodeURIComponent(href)}).then(res => {
        if (res.data.status === 0) {
          console.log('请求', Object.assign({}, res.data.data, res.data.data.signature))
          resolve(Object.assign({}, res.data.data, res.data.data.signature))
        } else {

        }
      }).catch(error => {
        reject(error)
      })
    })
  }
}
export default new Jwx()
