/**
 * Created by lirui on 2018/9/19
 */
import {isWeiXin} from './utils'
import Http from './http'
import Axios from 'axios'
import {Dialog, Toast} from "vant";
import Qs from 'qs'
import bridgefunc from "../../../utils/bridgefunc";
import store from "../../../vuex/store";
// import cookie from 'js-cookie'
// import Jsonp from 'jsonp'

class Jwx {
  constructor(jsApiList) {
    this.jsApiList = jsApiList
  }

  /**
   * 分享
   * @param title
   * @param link
   * @param imgUrl
   * @param desc
   */
  share(title, link, imgUrl, desc) {
    if (isWeiXin()) {
      return this._wxShare(title, link, imgUrl, desc)
    } else {
      return this._appShare(title, link, imgUrl, desc)
    }
  }

  /**
   * 选择照片
   * @param num 非必填，可选择的张数，默认1张
   */
  chooseImage(num) {
    if (isWeiXin()) {
      return this._wxChooseImage(num)
    } else {
      return this._appChooseImage()
    }
  }

  _wxChooseImage(num) {
    // store.state.globalConfig.
    return new Promise((resolve, reject) => {
      this._init(['chooseImage', 'uploadImage']).then(() => {
        wx.chooseImage({
          count: num || 1, // 默认1
          sourceType: ['camera'], // 相机
          sizeType: ['original'],
          success: function (res) {
            let img = res.localIds[0]
            wx.getLocalImgData({
              localId: img, // 图片的localID
              success: function (res) {
                console.log(res)
                let localData = res.localData // localData是图片的base64数据，可以用img标签显示
                let result = localData.substr(localData.indexOf(',') + 1)
                resolve({imagedata: [result]}) // 和app返回统一
              }
            })
            // var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
          }
        })
      })
    })
  }

  _wxUploadImage(localIds) {
    return new Promise((resolve, reject) => {
      wx.uploadImage({
        localId: localIds, // 需要上传的图片的本地ID，由chooseImage接口获得
        isShowProgressTips: 1, // 默认为1，显示进度提示
        success: function (res) {
          resolve(res.serverId)
          // var serverId = res.serverId // 返回图片的服务器端ID
        }
      })
    })
  }

  _wxShare(title, link, imgUrl, desc) {
    console.log(title)
    console.log(link)
    console.log(imgUrl)
    console.log(desc)
    return new Promise((resolve, reject) => {
      this._init(['onMenuShareTimeline', 'onMenuShareAppMessage', 'updateAppMessageShareData', 'updateTimelineShareData']).then(() => {
        console.log('开始分享')
        wx.onMenuShareTimeline({
          title: title, // 分享标题
          link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: imgUrl, // 分享图标
          success: function () {
            console.log("onMenuShareTimeline 设置成功！");
            resolve()
          },
          // cancel: function () {
          //   reject()
          // }
        })
        wx.onMenuShareAppMessage({
          title: title, // 分享标题
          desc: desc, // 分享描述
          link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: imgUrl, // 分享图标
          success: function () {
            console.log("onMenuShareAppMessage 设置成功！");
            resolve()
          },
          // cancel: function () {
          //   reject()
          // }
        })
        // 新函数
        wx.updateAppMessageShareData({
          title: title, // 分享标题
          desc: desc, // 分享描述
          link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: imgUrl, // 分享图标
          success: function () {
            // 设置成功
            console.log("updateAppMessageShareData 设置成功！");
          }
        })

        wx.updateTimelineShareData({
          title: title, // 分享标题
          link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: imgUrl, // 分享图标
          success: function () {
            // 设置成功
            console.log("updateTimelineShareData 设置成功！");
          }
        })
      })
    })
  }

  _appShare(title, link, imgUrl, desc) {
    console.log(title)
    console.log(link)
    console.log(imgUrl)
    console.log(desc)

    if (store.state.globalConfig.yht_protocol_type == 'new') {
      let params = {
        title: title,
        sharetext: desc,
        imageurl: imgUrl,
        detailurl: link
      }
      bridgefunc.share(params)
    } else {
      let params = {
        type: 'share',
        para: {
          title: title,
          sharetext: desc,
          imageurl: imgUrl,
          detailurl: link
        }
      }
      location.href = location.origin + '?appprotocol=' + encodeURIComponent(JSON.stringify(params))
    }

    // location.href = location.origin + '?appprotocol=' + encodeURIComponent(JSON.stringify(params))
  }

  _appUploadImage(num) {
    let callbackName = 'appCallbackUploadImage'
    let params = {
      type: 'webuploadimage', // 包含选择图片和上传图片功能
      para: {
        callback: callbackName,
        num: num || 1
      }
    }
    location.href = location.origin + '?appprotocol=' + encodeURIComponent(JSON.stringify(params))
    return new Promise(resolve => {
      window[callbackName] = res => { // 返回的是数组，res.rows
        resolve(res)
      }
    })
  }

  _appChooseImage() {
    // let callbackName = 'photoCallBack'
    // let params = {
    //   type: 'nativephoto', // 包含选择图片和上传图片功能
    //   para: {
    //     type: '3'
    //   }
    // }
    // location.href = location.origin + '?appprotocol=' + encodeURIComponent(JSON.stringify(params))
    if (store.state.globalConfig.yht_protocol_type == 'new') {
      return new Promise(resolve => {
        bridgefunc.getPhoto(3, img => {
          let imagedata = []
          imagedata.push(img)
          resolve({
            imagedata: imagedata
          })
        })
      })
    } else {
      let callbackName = 'photoCallBack'
      let params = {
        type: 'nativephoto', // 包含选择图片和上传图片功能
        para: {
          type: '3'
        }
      }
      location.href = location.origin + '?appprotocol=' + encodeURIComponent(JSON.stringify(params))
      return new Promise(resolve => {
        window[callbackName] = res => { // 返回的是数组，res.rows
          resolve(res)
        }
      })
    }
  }

  scanCode() { // 扫一扫
    if (store.state.globalConfig.yht_protocol_type == 'new') {
      return new Promise(resolve => {
        bridgefunc.scanCode(res => {
          resolve(res)
        })
      })
    } else {
      let callbackName = 'qrCallBack'
      let params = {
        type: 'qrscan'
      }
      location.href = location.origin + '?appprotocol=' + encodeURIComponent(JSON.stringify(params))
      return new Promise(resolve => {
        window[callbackName] = res => { // 返回的是数组，res.rows
          resolve(res)
        }
      })
    }
  }

  wxSign(info) {
    if (store.state.globalConfig.yht_protocol_type == 'new') {
      bridgefunc.wxFreePay(info)
    } else {
      let params = {
        type: 'wxfreepay',
        para: {
          pre_entrustweb_id: info
        }
      }
      location.href = location.origin + '?appprotocol=' + encodeURIComponent(JSON.stringify(params))
    }
  }

  getLocation() {
    return new Promise(resolve => {
      wx.getLocation({
        type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
        success: function (res) {
          // var latitude = res.latitude // 纬度，浮点数，范围为90 ~ -90
          // var longitude = res.longitude // 经度，浮点数，范围为180 ~ -180。
          // var speed = res.speed // 速度，以米/每秒计
          // var accuracy = res.accuracy // 位置精度
        }
      })
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

  /**
   * @param p 原生传入code码， 非原生界面传入weburl
   * @param isnative 是否是原生界面 默认false
   */
  openNewPage(p, isnative = false) {
    if (store.state.globalConfig.yht_protocol_type == 'new') {
      bridgefunc.newPage({
        weburl: p,
        isnativetop: true
      })
    } else {
      let params = {
        type: 'newpage', // 跳转原生新窗口
        para: {
          isnative: isnative,
          islogin: true,
          isnativetop: true,
          isopen: true
        }
      }
      if (isnative) {
        params.para.code = p
      } else {
        params.para.weburl = p
        console.log('打印的p',p)
      }
      location.href = location.origin + '?appprotocol=' + encodeURIComponent(JSON.stringify(params))
    }
  }

  /**
   * 关闭当前网页窗口，返回上一级原生
   */

  finishPage() {
    let params = {
      type: 'finish' // 跳转原生新窗口
    }
    location.href = location.origin + '?appprotocol=' + encodeURIComponent(JSON.stringify(params))
  }

  /**
   * 重新登录
   */

  openLogin() {
    let params = {
      type: 'login' // 重新登录
    }
    location.href = location.origin + '?appprotocol=' + encodeURIComponent(JSON.stringify(params))
  }

  chooseImg() {
    return new Promise((resolve, reject) => {
      this.chooseImage().then(res => {
        if (res.imagedata && res.imagedata.length) {
          let baseImgUrl = res.imagedata[0]
          Http.get('/app/json/app_youdi/getSunboxToken').then(res => { // 获取token
            const token = res.data.data
            Toast.loading({
              mask: true,
              duration: 0
            })
            Axios.post('/uploadFile', Qs.stringify({ // 上传
              base64File: baseImgUrl,
              fileType: 'png',
              fileName: '1',
              token: token,
              bucketName: 'default_file'
            })).then(res => {
              let imgDataObj = res.data.data
              let dataObj = {
                imgUrl: imgDataObj,
                baseImgUrl: baseImgUrl
              }
              Toast.clear()
              if (imgDataObj) {
                resolve(dataObj)
              } else {
                Dialog.alert({
                  title: '提示',
                  message: '上传失败！'
                })
              }
            })
          })
        }
      })
    })
  }
}
export default new Jwx()
