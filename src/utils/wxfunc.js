import  http  from './http'
import Loading from '../components/Vendor/Loading/index'
import Toast from '../components/Vendor/toast/index'
import jsonp from 'jsonp'
import Config from '@/api/config.js'
import Router from '../router'
import util from './util'
import {qqMapTransBMap} from './map'
import store from "../vuex/store";

var wxfunc = {
  wxPay: function (payData, success, failure) {
    // let tradeno = payData.tradeno
    function onBridgeReady() {
      WeixinJSBridge.invoke(
        'getBrandWCPayRequest', payData,
        function (res) {
          if (res.err_msg == "get_brand_wcpay_request:ok") {
            success(res)
          } else {
            failure(res)
          }
        }
      );
    }

    if (typeof WeixinJSBridge == "undefined") {
      if (document.addEventListener) {
        document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
      } else if (document.attachEvent) {
        document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
        document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
      }
    } else {
      onBridgeReady();
    }
  },
  getWechatSignature: function (callback, debug=false) {
    let url = '/app/json/we_chat/signature';
     //安卓传全路径
    let href = '';
    let u = navigator.userAgent;
    let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if(isiOS){
      href = window.initUrl;
    } else {
      href = window.location.href.split('#')[0];
    }
    // href = window.location.href
    // href = href.split('#')[0]
    // href = href.split('?')[0]
    let params1 = {
      url: href
    };
    // if (store.state.deployType == '2') {
    //   debug = true
    // }
    http.post(url, params1).then(res => {
      let data = res.data;
      if (data.status == 0) {
        wx.config({
          debug: debug, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: data.data.appId, // 必填，公众号的唯一标识
          timestamp: data.data.timestamp, // 必填，生成签名的时间戳
          nonceStr: data.data.nonceStr, // 必填，生成签名的随机串
          signature: data.data.signature,// 必填，签名
          beta: true,
          jsApiList: ['getLocation','updateAppMessageShareData','updateTimelineShareData','onMenuShareTimeline','scanQRCode','onMenuShareAppMessage','chooseImage','getLocalImgData','uploadImage', 'downloadImage','openLocation','chooseInvoiceTitle', 'hideAllNonBaseMenuItem', 'hideMenuItems'] // 必填，需要使用的JS接口列表
        });
        wx.ready(function () {
          // console.log('----isSignature--------签名成功')
          if (callback) {
            callback(true)
          }
        });
        wx.error(function (res) {
          console.log('----isSignature--------',res)

          if (callback) {
            callback(false)
          }
        });
      } else {
        // console.log(data.info);
        // Toast(`signature err ${data.info}`)
        if (callback) {
          callback(false)
        }
      }
    }, error => {
      // console.log('获取失败', error);
      Toast('获取数据失败')
      if (callback) {
        callback(false)
      }
    });
  },
  // 隐藏所有非基础按钮接口
  hideNonMenu() {
    this.getWechatSignature(() => {
      wx.hideAllNonBaseMenuItem()
    })
  },
  // 批量隐藏功能按钮
  hideMeItems(menus) {
    this.getWechatSignature(() => {
      wx.hideMenuItems({
        menuList: [
          ...menus
        ]
      })
    })
  },

  wxSetShareData: function (shareData, callback) {
    // shareData.title = this.detailData.skuName;
    // shareData.sharetext = this.detailData.skuName;
    // shareData.imageurl = this.detailData.phMainUrl;
    // shareData.detailurl = this.$store.state.globalConfig.wxBaseUrl + Config.shareUrl + this.$route.fullPath;
    wx.onMenuShareAppMessage({
      title: shareData.title, // 分享标题
      desc: shareData.sharetext, // 分享描述
      link: shareData.detailurl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
      imgUrl: shareData.imageurl, // 分享图标
      success: function () {
        // 设置成功
        console.log("onMenuShareAppMessage 设置成功！");
        callback(1)
      }
    })

    wx.onMenuShareTimeline({
      title: shareData.title, // 分享标题
      link: shareData.detailurl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
      imgUrl: shareData.imageurl, // 分享图标
      success: function () {
        // 设置成功
        console.log("onMenuShareTimeline 设置成功！");
      }
    })

    // 新函数
    if (wx.updateAppMessageShareData) {
      wx.updateAppMessageShareData({
        title: shareData.title, // 分享标题
        desc: shareData.sharetext, // 分享描述
        link: shareData.detailurl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: shareData.imageurl, // 分享图标
        success: function () {
          // 设置成功
          console.log("updateAppMessageShareData 设置成功！");
        }
      })
    }

    if (wx.updateTimelineShareData) {
      wx.updateTimelineShareData({
        title: shareData.title, // 分享标题
        link: shareData.detailurl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: shareData.imageurl, // 分享图标
        success: function () {
          // 设置成功
          console.log("updateTimelineShareData 设置成功！");
        }
      })
    }

  },
  getLocationCallbacks: [],
  wxGetLocation: function (callback) {
    this.getLocationCallbacks.push(callback)
    if (this.getLocationCallbacks.length == 1) {
      wx.getLocation({
        type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
        success: (res) => {
          const {longitude, latitude} = qqMapTransBMap(res.longitude, res.latitude)
          console.log('----gcj02--------获取成功', res)
          this.geocoder({latitude, longitude}, (jsoninfo) => {
              console.log('----geocoder--------获取成功', jsoninfo)
              if (jsoninfo) {
                // callback(jsoninfo);
                for (let i = 0; i < this.getLocationCallbacks.length; i++) {
                  let f = this.getLocationCallbacks[i]
                  f(jsoninfo)
                }
                this.getLocationCallbacks = []
              } else {
                for (let i = 0; i < this.getLocationCallbacks.length; i++) {
                  let f = this.getLocationCallbacks[i]
                  f(null)
                }
                this.getLocationCallbacks = []
              }
            }
          )
        },
        fail: (res) => {
          Toast('微信定位失败!');
          console.error(res)
          for (let i = 0; i < this.getLocationCallbacks.length; i++) {
            let f = this.getLocationCallbacks[i]
            f(null)
          }
          this.getLocationCallbacks = []
        }
      });
    }
  },
  openLocation:function(jsonData){
    let json = util.bd_decrypt(parseFloat(jsonData.endlong),parseFloat(jsonData.endlat));
    wx.openLocation({
      latitude: json.gg_lat, // 纬度，浮点数，范围为90 ~ -90
      longitude: json.gg_lon, // 经度，浮点数，范围为180 ~ -180。
      name: '', // 位置名
      address: '', // 地址详情说明
      scale: 10, // 地图缩放级别,整形值,范围从1~28。默认为最大
      infoUrl: '' // 在查看位置界面底部显示的超链接,可点击跳转
    });
  },

  /**
   * 拍照
   * @param phototype 1 是相册 2 是拍照 3 自定义相机拍证件
   * @param callback
   */
  wxChooseImage:function(phototype,callback){
    let sourceType = [];
    if(phototype == 1){
      sourceType.push('album');
    }else {
      sourceType.push('camera');
    }
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: sourceType, // 可以指定来源是相册还是相机，默认二者都有
      success: (res) => {
        let localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
        if(localIds.length){
          this.dealLocalId(localIds[0],callback);
        }
      }
    });
  },
  wxinvoice:function(callback){ //获取发票抬头
      wx.invoke('chooseInvoiceTitle', {"scene": "1"},
        function (res) {
          callback(res)
        });
  },
  /**
   * 通过localID做对应处理
   * @param localID  微信图片id
   */
  dealLocalId:function(localID,callback){
    let u = navigator.userAgent;
    let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    //ios 直接获取图片base64
    if(isiOS){
      wx.getLocalImgData({
        localId: localID, // 图片的localID
        success:  (res) => {
          var localData = res.localData; // localData是图片的base64数据，可以用img标签显示
          callback({data:localData});
        },
        fail:function () {
          callback(undefined);
        }
      })
    }else {
      wx.uploadImage({
        localId: localID, // 需要上传的图片的本地ID，由chooseImage接口获得
        isShowProgressTips: 0, // 默认为1，显示进度提示
        success: function (res) {
          callback({mediaid:res.serverId});
        },
        fail:function (e) {
          callback(undefined);
        }
      });
    }
  },
  geocoder: function (location, callback) {
    let url = 'https://api.map.baidu.com/geocoder/v2/?callback=renderReverse&location=' + location.latitude + ',' + location.longitude + '&output=json&pois=0&ak=' + Config.mapak;
    // console.log('----geocoder--------进入')

    jsonp(url, null, (err, data) => {
      // console.log('----jsonp----err----执行', err)
      // console.log('----jsonp----data----执行', data)

      if (err) {
        callback(null);
      } else {
        let json = data.result.addressComponent;
        //当省份和城市相同的时候   将区域付给城市
        if (json.province == json.city) {
          json.city = json.district;
          json.district = '';
        }
        json.longitude = location.longitude;
        json.latitude = location.latitude
        // console.log('----jsonp----json----执行', json)

        callback(json);
      }
    })
  },
  /**
   * 微信小程序分享地址
   * @param to 当前路由
   * @returns {string}
   */
  wxmpPath: function (to) {
    let query = JSON.parse(JSON.stringify(to.query))
    let path = ''
    if (query.hasOwnProperty('userInfo') || query.hasOwnProperty('token')) { // 分享链接删除用户信息
      delete query.userInfo
      delete query.token
    }
    for (let key in query) {
      path += `&${key}=${query[key]}`
    }
    path = `${to.path}?${path.substr(1)}`
    return path
  },
  wxmpShare: function (shareData) {
    wx.miniProgram.postMessage({ data: JSON.stringify(shareData) });
  }
}

export default wxfunc
