import store from "../vuex/store";
import Loading from "../components/Vendor/Loading";
import http from "./http";
import Toast from '../components/Vendor/toast/index'
import bridgefunc from "./bridgefunc";
import wxfunc from "./wxfunc";
import router from '@/router'
import Cookie from 'js-cookie'
import util from "./util";
import jsonp from "jsonp";

const dev = process.env.NODE_ENV !== 'production'


var payHelper = {
  getPayWays: function (orderType, occurOuCode) {
    // app 1 h5 2 mp 3 mnp 4 offline 5 IS_FJSH 6
    let payScene = 1 // 这里本来为2的，为了调试方便写成1
    payScene = payHelper.queryOrderScene()
    if (dev) {
      payScene = 1
    }
    let url = '/app/json/app_pay/queryPayModeList';
    let paramsData = {
      token: store.state.login.token,
      orderType: orderType,
      occurOuCode: occurOuCode,
      payScene: payScene,
      channel: store.state.channel,
      partnerChannel: store.state.channel,
    };

    return new Promise((resolve, reject) => {
      Loading.open();
      let payWay = []
      http.post(url, paramsData).then(res => {
        Loading.close();
        let data = res.data;
        if (data.status == 0) {
          let arr = data.data
          for (let i = 0; i < arr.length; i++) {
            let item = arr[i]
            let payModeSubList = item.payModeSubList
            for (let j = 0; j < payModeSubList.length; j++) {
              let subItem = payModeSubList[j]
              let payItem = {
                payMode: item.payModeCode,
                payModeSub: subItem.payModeCode
              }

              payItem.text = subItem.payModeName
              if (item.payModeCode == '210') {
                payItem.icon = 'static/image/mall2/weixin.png'
                if (item.payModeSub == '210004') {
                  payItem.text = '微信H5'
                }
              } else if (item.payModeCode == '200') {
                payItem.icon = 'static/image/mall2/zhifubao.png'
              } else if (item.payModeCode == '260') {
                payItem.icon = 'static/image/mall2/timesPay.png'
              } else if (item.payModeCode == '250') {
                payItem.text = '翼支付'
                payItem.icon = 'static/image/mall2/zhifubao.png'
              } else if (item.payModeCode == '300') {
                payItem.text = '银联支付'
                payItem.icon = 'static/image/mall2/yl-pay.png'
              } else if (item.payModeCode == '320') {
                payItem.text = '建行龙支付'
                payItem.icon = 'static/image/mall2/longpay.png'
              } else if (item.payModeCode == '305') {
                if (payItem.payModeSub == '305011') {
                  payItem.text = '微信支付'
                  payItem.icon = 'static/image/mall2/weixin.png'
                } else {
                  payItem.text = '工商银行支付'
                  payItem.icon = 'static/image/mall2/icbc-icon.png'
                }
              }
              payWay.push(payItem)
            }
          }
        } else {
          Toast('获取支付类型失败！')
        }
        resolve(payWay)
      }).catch(err => {
        Loading.close();
        Toast('获取支付类型失败！')
        resolve([])
      })
    })
  },
  ylH5Pay: function (payway, orderType, orderId, url) {
    let paramsData = {
      token: store.state.login.token,
      orderType: orderType,
      orderId: orderId,
      payMode: payway.payMode,
      payModeSub: payway.payModeSub
    };

    bridgefunc.customPush({
      path: window.location.origin + '/app-vue/app/index.html#/mall2/ylpay',
      isnativetop: '1',
      superback: 1,
      query: {
        url: url,
        info: encodeURIComponent(JSON.stringify(paramsData))
      }
    })
  },
  payRequest: function (payway, orderType, orderId, url, redirectUrl, wxOrderInfoKey, isGroup, restArg = null, isScan = 0) {
    if (payway.payModeSub == '300002') {
      // 银联支付，需要跳转页面走h5 支付
      this.ylH5Pay(payway, orderType, orderId, url)
      return;
    }

    Loading.open();
    let paramsData = {
      token: store.state.login.token,
      orderType: orderType,
      id: orderId,
      orderId: orderId,
      payMode: payway.payMode,
      returnUrl: window.location.origin + "/app-vue/app/index.html#/mall2/paysuccess",
      payModeSub: payway.payModeSub,
      channel: store.state.channel,
      partnerChannel: store.state.channel,
      // ipAddress: window.returnCitySN ? window.returnCitySN["cip"] : '', // 远端ip
    };
    if (payway.payMode != 305) {
      delete paramsData.returnUrl
    }
    // 支付额外参数， 目前加油支付用到
    if (restArg) {
      paramsData = Object.assign({}, paramsData, restArg)
    }
    return new Promise((resolve, reject) => {
      http.post(url, paramsData).then(
        res => {
          Loading.close();
          let data = res.data;
          if (data.status == 0) {

            payHelper.doPay(payway, data.data.payInfo, redirectUrl, wxOrderInfoKey, isGroup, data.data.tradeNo, orderType, orderId, isScan).then(() => {
              console.log('payHelper.doPay', data)
              resolve(data.data);
            }).catch(() => {
              console.log('payHelper.doPay1', data)
              reject()
            })
          } else {
            reject()
            Toast(data.info);
          }
        },
        error => {
          Loading.close();
          Toast('请求数据失败！')
          reject()
        }
      );
    })
  },
  payEvent: function (payway, orderType, orderId, redirectUrl, wxOrderInfoKey = '', isGroup = false ) {
    let url = '/app/json/app_shopping_order/pay';
    return this.payRequest(payway, orderType, orderId, url, redirectUrl, wxOrderInfoKey, isGroup)
  },
  payPurchaseEvent: function (payway, orderType, orderId, redirectUrl) {
    let url = '/app/json/app_purchase_order/pay';
    return this.payRequest(payway, orderType, orderId, url, redirectUrl)
  },
  // 代付支付
  substitutePayEvent: function (payway, orderType, orderId, payAmount, redirectUrl) {
    let url = '/app/json/app_replace_pay_order/userPay';
    return this.payRequest(payway, orderType, orderId, url, redirectUrl, {
      payAmount: payAmount
    })
  },
  trafficPayEvent: function (payway, orderType, orderId) {
    let url = '/app/json/fee_life_order/pay';
    return this.payRequest(payway, orderType, orderId, url)
  },
  elecPayEvent: function (payway, orderType, orderId) {
    let url = '/app/json/elec/pay';
    return this.payRequest(payway, orderType, orderId, url)
  },
  // 设备支付
  selfWasherPayEvent: function (payway, orderType, orderId, redirectUrl) {
    let url = '/app/json/app_self_washer_order/pay';
    return this.payRequest(payway, orderType, orderId, url, redirectUrl)
  },
  refuelPayEvent: function (payway, orderType, orderId, restArg = null) {
    let url = '/app/json/refuel_center/pay';
    let redirectUrl = `/firmDetail?orderType=${orderType}&orderId=${orderId}` // 支付成功后的页面，小程序需要跳转路径
    return this.payRequest(payway, orderType, orderId, url, redirectUrl, restArg)
  },
  refuelScanPayEvent: function (payway, orderType, orderId, restArg = null) {
    let url = '/app/json/refuel_scan_code/pay';
    let redirectUrl = `/firmScanDetail?orderType=${orderType}&orderId=${orderId}&fromPage=1` // 支付成功后的页面，小程序需要跳转路径-扫码加油支付凭证
    return this.payRequest(payway, orderType, orderId, url, redirectUrl, restArg, 1)
  },
  refuelOfflinePayEvent: function (payway, orderType, orderId, restArg = null) {
    let url = '/app/json/shopping_scan_code/pay';
    let redirectUrl = `/firmScanDetail?orderType=${orderType}&orderId=${orderId}&fromPage=1` // 支付成功后的页面，小程序需要跳转路径-扫码加油支付凭证
    return this.payRequest(payway, orderType, orderId, url, redirectUrl, restArg, 1)
  },
  doPay: function (payway, payInfo, redirectUrl, wxOrderInfoKey, isGroup, tradeNo = '', orderType = '', orderId = '', isScan = 0) {
    // isScan 扫码加油支付
    return new Promise((resolve, reject) => {
      if (payway.payModeSub == '210001') {
        // 微信app支付
        let pinfo = JSON.parse(payInfo)
        bridgefunc.wxPay(pinfo, (result) => {
          console.log('微信app支付result', result)
          if (result == '1' || result == true) {
            resolve();
          } else {
            reject()
            Toast('支付失败');
          }
        })
      } else if (payway.payModeSub == '200001') {
        // 支付宝app支付
        bridgefunc.aliPay(payInfo, (result) => {
          console.log('ali-app支付result', result)
          if (result == '1' || result == true) {
            resolve();
          } else {
            reject()
            Toast('支付失败');
          }
        });
      } else if (payway.payModeSub == '210002') {
        // 微信公众号支付
        let pinfo = JSON.parse(payInfo)
        let payData = {
          timeStamp: pinfo.timestamp,
          nonceStr: pinfo.noncestr, // 支付签名随机串，不长于 32 位
          package: pinfo.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
          signType: 'MD5', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
          paySign: pinfo.sign, // 支付签名
          appId: pinfo.appid
        }
        wxfunc.wxPay(
          payData,
          () => {
            resolve();
          },
          () => {
            reject()
            Toast('支付失败');
          },
        )
      } else if (payway.payModeSub == '210005') {
        // 微信小程序支付
        let info = JSON.parse(payInfo)
        let params = {
          package: info.package,
          noncestr: info.noncestr,
          timestamp: info.timestamp,
          sign: info.sign
        }
        if (redirectUrl) {
          if (redirectUrl == '/icbc/ryhysuccess') {
            redirectUrl = '/icbc/ryhysuccess?tradeNo=' + tradeNo
          }
          params.redirectUrl = redirectUrl
        }
        wx.miniProgram.navigateTo({
          url: `/pages/repayment/index?payInfo=${encodeURIComponent(JSON.stringify(params))}`
        })
      } else if (payway.payModeSub == '210004') {
        // 微信H5支付
        let h5Url = payInfo

        let redirect_url = window.location.href.split('#')[0] + '#/mall2/paycheck?tradeNo=' + tradeNo + '&orderType=' + orderType + '&orderId=' + orderId
        if (isScan == 1) {
          redirect_url += '&isScan=' + isScan
        }
        if (util.isZTAPP()) {
          redirect_url += '&isZTApp=1'
        }
        redirect_url = encodeURIComponent(redirect_url)
        h5Url = h5Url + '&redirect_url=' + redirect_url

        if (util.isZTAPP()) {
          let referer = window.location.origin
          let str = `sinopecapp://loadWeixinPay('${h5Url}','${referer}')`
          window.location.href = str
        } else if (store.state.webtype == '1') {
          let referer = window.location.host
          bridgefunc.wxH5Pay({
            referer: referer,
            origin: window.location.origin,
            host: window.location.host,
            url: h5Url
          });
        } else {
          window.location.href = h5Url
        }
      } else if (payway.payModeSub == '320005') {
        // 建行龙支付
        bridgefunc.jhLongPay(payInfo, (result) => {
          if (result == '1') {
            resolve();
          } else {
            reject()
            Toast('支付失败');
          }
        });
      } else if (payway.payModeSub == '300003') {
        // 银联支付
        bridgefunc.cuppay(payInfo, (result) => {
          if (result == '1') {
            resolve();
          } else {
            reject()
            Toast('支付失败');
          }
        });
      } else if (payway.payModeSub == '305011') {
        // 工行聚合支付，调用小程序支付
        let info = JSON.parse(payInfo)
        let params = {
          package: info.package,
          noncestr: info.noncestr,
          timestamp: info.timestamp,
          signType: info.signType,
          sign: info.sign
        }
        if (redirectUrl) {
          if (redirectUrl == '/icbc/ryhysuccess') {
            redirectUrl = '/icbc/ryhysuccess?tradeNo=' + tradeNo
          }
          params.redirectUrl = redirectUrl
        }
        wx.miniProgram.navigateTo({
          url: `/pages/payment/main?payInfo=${encodeURIComponent(JSON.stringify(params))}`
        })
      } else if (payway.payModeSub == 500001 || payway.payModeSub == 500002) {
        resolve();
      } else if (payway.payModeSub == 305005 || payway.payModeSub == 305007 || payway.payModeSub == 305013) {
        let tradeData = {
          tradeNo: tradeNo,
          orderType: orderType
        }
        if (redirectUrl == '/icbc/ryhysuccess') {
          tradeData.isRYHY = '1'
        }
        Cookie.set('icbc_trade_data', JSON.stringify(tradeData))
        let textNode = document.createElement('div')
        textNode.innerHTML = payInfo
        document.body.appendChild(textNode)
        document.forms[0].submit()
        // resolve()
      } else if (payway.payModeSub == '260001') {
        // 邻里邦支付平台
        resolve();
      } else if (payway.payModeSub == '260002') {
        // 临时使用 为了微信小程序测试流程
        router.push('/mall2/paysuccess')
      } else if (payway.payModeSub == 260003) {
        //时代微信小程序支付
        let info = JSON.parse(JSON.parse(payInfo))
        console.log('info-info-info',info)
        let wxPayInfo = JSON.parse(info.payData)
        console.log('wxPayInfo-wxPayInfo-wxPayInfo',wxPayInfo)

        
        let redirectUrl = "";

        // if(isGroup){
        //   redirectUrl = `/app-vue/app/index.html#/group_detail?wxOrderInfoKey=${wxOrderInfoKey}`
        // }else{
        //   redirectUrl = `/app-vue/app/index.html#/paysuccess?wxOrderInfoKey=${wxOrderInfoKey}`
        // }

        isGroup ? redirectUrl = "/app-vue/app/index.html#/group_detail" : redirectUrl = "/app-vue/app/index.html#/mall2/paysuccess";

        let params = {
          package: wxPayInfo.package,
          noncestr: wxPayInfo.nonceStr,
          timestamp: wxPayInfo.timeStamp,
          sign: wxPayInfo.paySign,
          signType: wxPayInfo.signType,
          redirectUrl:redirectUrl,
          params:{
            wxOrderInfoKey:wxOrderInfoKey
          }
          // wxOrderInfoKey: wxOrderInfoKey,
          // isGroup: isGroup
        }
        console.log('params-params-params',params)
        wx.miniProgram.navigateTo({
          url: `/pages/common/repayment/index?payInfo=${encodeURIComponent(JSON.stringify(params))}`
        })
        console.log('跳转小程序')

      } else {
        console.log(payway)
        reject()
        Toast('暂不支持的支付方式！');
      }
    })
  },
  /**
   * 下单场景(1:app 2:H5 3:公众号 4:小程序 5:线下 6:奋进石化)
   *   App(1, "app"),
   *   H5(2, "H5"),
   *   Mp(3, "公众号"),
   *   Mnp(4, "小程序"),
   *   Offline(5, "线下"),
   *   FJSH(6, "奋进石化"),
   *   ICBC_THIRD(7, "工行第三方支付"),
   *   DJLJY(8, "大家来加油"),
   *   PinganApp(9, "平安银行app"),
   *   RefuelCardApp(10, "加油卡掌上营业厅APP"),
   * submit 接口需要加入下单场景参数
   * orderScene
   */
  queryOrderScene() {
    return util.orderScene()
  },
  getPayWayStr(payMode) {
    let str = ''
    if (payMode == 200) {
      str = '支付宝支付'
    } else if (payMode == 210) {
      str = '微信支付'
    } else if (payMode == 250) {
      str = '翼支付'
    } else if (payMode == 320) {
      str = '建行龙支付'
    } else if (payMode == 300) {
      str = '银联支付'
    }
    return str
  }
}

export default payHelper
