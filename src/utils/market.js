/**
 * Created by steven on 2018/8/23.
 * 首页配置各事件管理js
 */
import bridgefunc from './bridgefunc'
import store from '../vuex/store'
import mallCommon from './mall2'
import Search from '@/components/mall2/common/search';
import router from '../router'
import util from './util'
import http from './http'
import userCenter from '@/components/usercenter/js/userCenter.js'
import ScanCoupons from '@/components/commonui/ScanCoupons/index'
import ExchangePop from '@/components/commonui/exchange-pop/index'
import ExchangeCoupon from '@/components/commonui/exchange-coupon/index'
import ExchangeCouponSuccess from '@/components/commonui/exchange-coupon-success/index'
import Toast from '@/components/Vendor/toast/index'
import Loading from '@/components/Vendor/Loading/index'
import config from "../api/config";
import {Dialog} from 'vant';
import AllCategories from '@/components/mall2/common/category'
import Filtrate from '@/components/mall2/common/filtrate'
import ComplexTip from '@/components/commonui/complex-tip/index'
import actionStatistics from './actionStatistics'
import payHelper from "./payHelper";
import {encryptDes} from './des'
import MessageBox from '@/components/Vendor/messagebox/index';

import More from '@/components/product/index/top-nav/more/index'
import Bus from "../components/product/index/bus";
import Login from '@/components/commonui/login/index'

let resultUrl = window.location.href
resultUrl = resultUrl.substring(0, resultUrl.indexOf('/site/wx') + 8)

let market = {
  baiduNav: function (args) {
    bridgefunc.baiduNav(args)
  },
  exchangeCoupon: function (item) {
    ExchangeCoupon.open({
      exchangeData: item,
      exchangeSuccess: function () {
        userCenter._getMyAssets()
        ExchangeCouponSuccess.open()
      }
    })
  },
  exchangeEvent: function (code) {
    Loading.open()
    http.post('/app/json/acct/acctRechargeCode', {dynamicCode: code}).then(res => {
      Loading.close()
      if (res.data.status === 0 && res.data.data.state == '1') {
        ExchangePop.open({exchangeData: res.data.data});
      } else {
        Toast(res.data.info || '兑换失败！')
      }
    }).catch(err => {
      Loading.close()
      Toast('网络加载较慢！')
    })
  },
  toNavTopMore: function (topData) {
    More.open({
      initData: {
        topData: topData
      },
      eventClick: function (code) {
        More.close()
        switch (code) {
          case 'ydf':
            let url = window.location.origin + '/app-vue/oildrop/qrpayment'
            bridgefunc.customPush({
              path: url,
              isVuePage: false,
              isnativetop: true
            })
            break;
          case 'dzk':
            Toast('暂缓开通！')
            break;
          case 'sys':
            market.showScan()
            break;
          case 'kfp': // 开发票
            router.push({path:'/assistantindex'})
            break;
        }
      }
    })
  },
  toYHTService: function () {
    let url = window.location.origin + '/app-vue/oildrop/customerservice'
    bridgefunc.customPush({
      path: url,
      isVuePage: false,
      isnativetop: true
    })
  },
  payEvent: function (payway, orderType, orderId, redirectUrl) {
    return payHelper.payEvent(payway, orderType, orderId, redirectUrl)
  },
  doPay: function (payway, payInfo,) {
    return payHelper.doPay(payway, payInfo, redirectUrl)
  },
  dealPhone(phone) {
    if (phone && phone != '') {
      let str = phone.substr(0, 3) + "****" + phone.substr(7)
      return str
    }
    return '暂无手机号'
  },
  enterSpecialFunc: function (link) {
    let code = link.code
    if (code == "saomajiayou") { // 扫码加油
      bridgefunc.scanCode((scanRes) => {
        console.log('scanRes', scanRes)
        // 判断扫码结果
        let requestParams = null;
        if (scanRes.code.indexOf('gasoilno') > -1) {
          let params = JSON.parse(scanRes.code)
          requestParams = {
            kshopOrgid: params.orgid,
            kshopGasoilno: params.gasoilno
          };
        } else {
          let newCode = scanRes.code || ''
          let newCodelength = newCode.split("qrCode=")
          let qsCode = ''
          if (newCodelength.length == 2) {
            qsCode = newCode.split("qrCode=")[1]
          } else {
            qsCode = scanRes.code
          }
          console.log(qsCode)
          requestParams = {
            rfrCode: qsCode
          };
        }

        // 调用getScanCodeInfo方法获取中控类型
        Loading.open();
        http.post('/app/json/refuel_scan_code/getScanCodeInfo', requestParams).then(res => {
          Loading.close();
          let data = res.data;
          if (data.status == 0) {
            // 允许扫码加油
            if (store.state.globalConfig.scan_refuel_allow == 1 || data.data.stationCenterControlType == 'none') { // 无中控类型-调用扫码加油流程
              let newCode = scanRes.code || ''
              let newCodelength = newCode.split("qrCode=")
              let qsCode = ''
              if (newCodelength.length == 2) {
                qsCode = newCode.split("qrCode=")[1]
              } else {
                qsCode = scanRes.code
              }

              // 如果是在掌厅里面
              if (store.state.webtype == '7' && router.currentRoute.path == '/blockindex') {
                market.sinopecappFunc2({
                  type: 2,
                  url: '/scan_refuel',
                  args: {
                    codeObj: qsCode
                  }
                })
              } else {
                router.push({
                  path: '/scan_refuel',
                  query: {
                    codeObj: qsCode
                  }
                })
              }
            } else { // 有中控类型-调用app加油流程
              let newCode = scanRes.code || ''
              let newCodelength = newCode.split("qrCode=")
              let qsCode = ''
              if (newCodelength.length == 2) {
                qsCode = newCode.split("qrCode=")[1]
              } else {
                qsCode = scanRes.code
              }

              // 如果是在掌厅里面
              if (store.state.webtype == '7' && router.currentRoute.path == '/blockindex') {
                market.sinopecappFunc2({
                  type: 2,
                  url: '/flashPayment',
                  args: {
                    stationOuCode: data.data.stationOuCode,
                    stationName: data.data.stationName,
                    stationStandardCode: data.data.stationStandardCode,
                    codeObj: qsCode,
                    entryType: 2,
                  }
                })
              } else {
                router.push({
                  path: '/flashPayment',
                  query: {
                    stationOuCode: data.data.stationOuCode,
                    stationName: data.data.stationName,
                    stationStandardCode: data.data.stationStandardCode,
                    codeObj: qsCode,
                    entryType: 2,
                  }
                })
              }
            }
          } else {
            Toast(data.info);
          }
        }).catch(err => {
          Loading.close();
          Toast('请求数据失败！')
        })
      })
    } else if (code == "offlinepay") { // 云南离线支付
      bridgefunc.scanCode((scanRes) => {
        let newCode = scanRes.code || ''
        let newCodelength = newCode.split("qrCode=")
        let qsCode = ''
        if (newCodelength.length == 2) {
          qsCode = newCode.split("qrCode=")[1]
        } else {
          qsCode = scanRes.code
        }
        router.push({
          path: '/offline_payment/payment_type',
          query: {
            codeObj: qsCode
          }
        })
      })
    } else if (code == 'showScan') { // 扫一扫
      market.showScan()
    } else if (code == 'productBtnEvent') { // 商品按钮事件
      Bus.$emit("productBtnEvent");
    } else if (code == 'tothirdapp') { // 跳转app事件
      // if (store.state.webtype == '1') {
      //   // 在app里面
      //   // bridgefunc.jump
      //   let appurl = link.args.jumpScheme
      //   appurl += '://'
      //   bridgefunc.jumpAPPFunc(appurl, (res) => {
      //     if (res != 1) {
      //       this.tothirdapp(link)
      //     }
      //   })
      // } else {
        this.tothirdapp(link)
      // }
    }
  },
  tothirdapp: function (link) {
    let url = link.args.url
    let jumpScheme = link.args.jumpScheme
    Loading.open()
    http.post('/app/json/login/getEncodeUrl', {
      url: url,
      code: jumpScheme
    }).then(res => {
      Loading.close()
      let data = res.data
      if (data.status == 0) {
        window.location.href = data.data
      } else {
        Toast(data.info ? data.info : '获取跳转链接失败！')
      }
    }).catch(err => {
      Loading.close()
      Toast("系统运行过程中遇到问题，请稍候再试")
    })
  },
  filtrateEvent: function (initData, filtrateEvent) {
    Filtrate.open({
      initData: initData,
      filtrateEvent: filtrateEvent
    });
  },
  showCategories: function (initData, cateEvent) {
    AllCategories.open({
      initData: initData,
      cateEvent: cateEvent
    });
  },
  moduleIsShow: function (moduleData) {
    // console.log(moduleData)
    if (moduleData.cannotSee == true) {
      let arr1 = moduleData.canSeenArr
      if (arr1 && arr1 != '' && arr1 != undefined) {
        for (let j = 0; j < arr1.length; j++) {
          let qxStr = arr1[j]
          if (qxStr == "empFlag") {
            if (store.state.mall2.myAssets.empFlag == '1') {
              return true
            }
          } else {
            if (store.state.mall2.myAssets.levelNo == qxStr) {
              return true
            }
          }
        }
      }
      let arr2 = moduleData.canSeenGroups
      if (arr2 && arr2 != '' && arr2 != undefined) {
        let clusterIds = store.state.mall2.myAssets.clusterIds
        if (clusterIds && clusterIds != undefined && clusterIds != '') {
          for (let j = 0; j < arr2.length; j++) {
            let qxStr = arr2[j]
            for (let i = 0; i < clusterIds.length; i++) {
              if (qxStr == clusterIds[i]) {
                return true;
              }
            }
          }
        }
      }
      return false
    }
    return true
  },
  showShare: function (shareData) {
    bridgefunc.share(shareData)
  },
  newsEvent: function (id) {
    window.location.href = `${window.location.href.substring(0, resultUrl.indexOf('/site/wx') + 8)}/news/newsdetail?id=${id}`
  },
  toNews: function () {
    market.customPush({
      path: '/mall2/headlines'
    })
  },
  toAdImgMove: function (info, moduleId) {
    router.push({
      path: '/imageadmove',
      query: {
        'info': encodeURIComponent(JSON.stringify(info)),
        moduleId: moduleId
      }
    })
  },
  moreNews: function () {
    window.location.href = `${resultUrl}/news/newslist?stationCode=${store.state.refuelStation.stationCode}`
  },
  getCategorySubPageKey: function (cateId) {
    return 'CategoryHeaderDiv' + '_' + 'category_' + cateId;
  },
  getModuleBgStyle: function (moduleData) {
    let styleStr = '';
    let img = moduleData.bgImgUrl
    if (img && img != undefined && img != '') {
      styleStr += "background: url('" + img + "') no-repeat center center / 100% 100%;"
    }
    let color = moduleData.bgColor
    if (color && color != undefined && color != '') {
      styleStr += "background-color: " + color + ";"
    }
    return styleStr;
  },
  getMemberLevelIndex: function (level) {
    let lArr = store.state.memberLevel
    for (let i = 0; i < lArr.length; i++) {
      if (level == lArr[i].rankCode) {
        return i + 1;
      }
    }
    return 0
  },
  getMemberLevelStr: function (level) {
    let lArr = store.state.memberLevel
    for (let i = 0; i < lArr.length; i++) {
      if (level == lArr[i].rankCode) {
        return lArr[i].name;
      }
    }
    return ''
  },
  apiBaseURL: function () {
    return '';
  },
  productEvent: function (product, route, onlyDeliveryType = '0', showActivityTime = '0') {
    console.log(route)
    let path = '/mall2/detail/' + util.getDataString()
    if (product.productType == 2) {
      path = '/mall2/ticketdetail';
    } else if (product.productType == 511 || product.productType == 508) {
      path = '/movie-ticket-order'
    } else if (product.productType == 507) {
      // 生活缴费商品 处理
    }

    if (onlyDeliveryType == '1' || onlyDeliveryType == '2') {
      store.state.mall2.staticDeliverType = onlyDeliveryType
    } else if (product.orginDeliveryType == '1' || product.orginDeliveryType == '2') {
      store.state.mall2.staticDeliverType = product.orginDeliveryType
    } else {
      // if (product.orginDeliveryType && product.orginDeliveryType != '' && product.orginDeliveryType != '12' && product.orginDeliveryType != store.state.mall2.staticDeliverType) {
      //   store.state.mall2.staticDeliverType = product.orginDeliveryType
      // }
    }

    let pushData = {
      path: path,
      query: {
        id: product.id,
        skuId: product.skuId,
        // deliveryType: product.deliverType,
        productType: product.productType,
        activityId: product.activityId,
        showActivityTime: showActivityTime,
        name: route.name
        // productType: product.productType,
      }
    }
    // if (userCenter.checkLogined(pushData, 0) == false) {
    //   return
    // }
    router.push(pushData)
  },
  secondsKillProEvent: function (product, activityId, onlyDeliveryType = '0') {
    let path = '/mall2/detail/' + util.getDataString()
    if (product.productType == 2) {
      path = '/mall2/ticketdetail';
    }
    if (onlyDeliveryType == '1' || onlyDeliveryType == '2') {
      store.state.mall2.staticDeliverType = onlyDeliveryType
    } else if (product.orginDeliveryType == '1' || product.orginDeliveryType == '2') {
      store.state.mall2.staticDeliverType = product.orginDeliveryType
    } else {
      // if (product.orginDeliveryType && product.orginDeliveryType != '' && product.orginDeliveryType != '12' && product.orginDeliveryType != store.state.mall2.staticDeliverType) {
      //   store.state.mall2.staticDeliverType = product.orginDeliveryType
      // }
    }
    let pushData
    if (product.productType > 500 && product.productType < 512) {
      // 都是欧菲
      path = '/video-recharge'
      pushData = {
        path: path,
        query: {
          activityId: activityId,
          spuId: product.spuId,
          spuName: product.spuName,
          spuImage: product.phMainUrl,
        }
      }
    } else {
      pushData = {
        path: path,
        query: {
          id: product.id,
          skuId: product.skuId,
          productType: product.productType,
          isSecondsKill: 1,
          activityId: activityId
        }
      }
    }
    if (userCenter.checkLogined(pushData, 0) == false) {
      return
    }
    router.push(pushData)
  },
  pushToPickupProducts: function (item, productType = 0) {
    store.state.mall2.zitiAddress = item

    userCenter._addToMyPickupAddress(item.id)
    userCenter._setDefaultPickupAddress(item.id)

    store.state.mall2.staticDeliverType = 1;
    let path = '/mall2/list/' + util.getDataString()
    router.push({
      path: path,
      query: {
        productType: productType
      }
    })
  },
  allShops: function (type) {
    if (type == '1') {
      router.push({
        path: '/mall2/selfliftingsite',
        query: {
          pageType: 3,
          productType: '6'
        }
      })
    } else {
      router.push({
        path: '/mall2/selfliftingsite',
        query: {
          pageType: 3,
        }
      })
    }
  },
  customGo: function (n) {
    router.go(n)
  },
  customPush: function (pushData, mustLogined) {
    // 如果是在掌厅里面
    if (store.state.webtype == '7' && router.currentRoute.path == '/blockindex') {
      let link = {
        type: '2',
        url: pushData.path,
        args: pushData.query
      }
      market.sinopecappFunc2(link)
      return;
    }
    if (mustLogined == true) {
      if (userCenter.checkLogined(pushData, 0) == false) {
        return
      }
    }
    router.push(pushData)
  },
  enterSubCommon: function (link, mustLogined) {

    if (!link.pgCode || link.pgCode == null || link.pgCode == undefined || link.pgCode == '') {
      return;
    }

    let timec = (new Date()).getTime()
    let path = '/common2/' + timec
    let pushData = {
      path: path,
      query: {
        pgCode: link.pgCode,
      }
    }
    if (mustLogined == true) {
      if (userCenter.checkLogined(pushData, 0) == false) {
        return
      }
    }
    if (link.isztRedirect == true) {
      router.replace(pushData)
    } else {
      router.push(pushData)
    }
  },
  // 进入游戏页面
  enterGamesFunc: function (pushData, mustLogined) {
    if (mustLogined == true) {
      if (userCenter.checkLogined(pushData, 8) == false) {
        return
      }
    }
    let phone = store.state.login.phone;
    let userId = store.state.userInfo.userId;
    if (pushData.gameType == 'sign_in') {
      let url = `${location.origin}${config.gameUrl}/sign_in?t=signin`
      url += '&phone=' + phone + '&userId=' + userId
      let jsonData = {
        path: url
      };
      if (pushData.isztRedirect == true) {
        bridgefunc.customPush(jsonData, true, true)
      } else {
        bridgefunc.customPush(jsonData)
      }
      actionStatistics.gameAction('170000', JSON.stringify({
        type: 'signin'
      }))
      return;
    }

    let gameTypeCategoryId = pushData.gameTypeCategoryId;
    let gameTypeCode = pushData.gameTypeCode;
    let url;
    let gameUrl
    if (store.state.deployType == '2') {
      gameUrl = config.gameHistoryUrl
    } else {
      gameUrl = config.gameUrl
    }
    if (gameTypeCode && gameTypeCode != '' && gameTypeCode != 'undefined') {
      url = `${location.origin}${gameUrl}/?gameTypeCode=` + gameTypeCode
    } else if (gameTypeCategoryId && gameTypeCategoryId != '' && gameTypeCategoryId != 'undefined') {
      url = `${location.origin}${gameUrl}/?gameTypeCategoryId=` + gameTypeCategoryId
    }
    url += '&phone=' + phone + '&userId=' + userId
    let jsonData = {
      path: url
    };
    if (pushData.isztRedirect == true) {
      bridgefunc.customPush(jsonData, true, true)
    } else {
      bridgefunc.customPush(jsonData)
    }
    actionStatistics.gameAction('170000', JSON.stringify({
      type: gameTypeCode,
      cateId: gameTypeCategoryId
    }))
  },
  // 进入客户端功能页面
  enterClientFunc: function (pushData, mustLogined) {
    if (userCenter.checkLogined(pushData, 5) == false) {
      return
    }
    let code = pushData.code;
    if (code == 'chatservice') {
      bridgefunc.chatservice();
    } else if (code == 'yijieqifu') {
      bridgefunc.toYJQF();
    } else if (code == 'yijianjiayou') {
      bridgefunc.toYJJY(pushData);
    } else if (code == '200018' || code == '200019' || code == '200021' || code == '200005' || code == '200030' || code == '100004' || code == '100008') {
      bridgefunc.yhdClientFunc(code);
    }
  },
  // 进入动态链接路径
  dynamicNavEnter: function (pushData, mustLogined) {
    if (mustLogined == true) {
      if (userCenter.checkLogined(pushData, 2) == false) {
        return
      }
    }
    let url = pushData.url;
    let baseUrl = pushData.baseUrl;
    let params = new FormData();
    let paramsData = {
      token: store.state.login.token,
      baseUrl: baseUrl
    };
    let args = pushData.args
    for (let key in args) {
      paramsData[key] = args[key]
    }
    params.append('jsonData', JSON.stringify(paramsData));
    Loading.open()
    http.get(url, {params: paramsData}).then(
      res => {
        Loading.close();
        let data = res.data;
        if (data.status == 0) {
          let url = data.data
          if (url == '') {
            Toast('返回动态链接错误，请稍后重试！');
            return;
          }
          let jsonData = {
            path: url,
            isnativetop: pushData.renderNav ? '1' : '0',
          };
          if (pushData.isztRedirect == true) {
            bridgefunc.customPush(jsonData, true, true)
          } else {
            bridgefunc.customPush(jsonData)
          }
        } else {
          Toast(data.info);
        }
      },
      error => {
        Loading.close();
        Toast('请求数据失败！')
      }
    );
  },
  sinopecappFunc: function (item) {
    let path = window.location.href.split('#')[0];
    path = path + "#/link-configuration?type=2&funcCode=" + item.code
    path = "sinopecapp://loadH5Url('" + path + "')"
    console.log(path)
    window.location.href = path
  },
  // 链接配置重新定义
  sinopecappFunc2: function (link) {
    let path = window.location.href.split('#')[0];
    path = path + "#/link-configuration?type=3&link=" + encodeURIComponent(JSON.stringify(link))
    path = "sinopecapp://loadH5Url('" + path + "')"
    window.location.href = path
  },
  actionBtnEvent: function (pgcode, idCode) {
    if (pgcode && idCode)
      actionStatistics.commonAction('140001', '', '', '', '', idCode, pgcode, pgcode, '')
  },
  enterNav: async function (item, pgcode = '') {
    // if (item.link.url.indexOf('stationto') > -1) {
    //   router.push('/stationto')
    //   return false;
    // }
    // if (pgcode && item.idCode) {
    //   actionStatistics.commonAction('140001', '', '', '', '', item.idCode, pgcode, pgcode, '')
    // }
    // item.mustLogined = true // 写死
    if (item.link.type == '99') {
      let complexData = item.link.complexData
      if (complexData) {
        ComplexTip.open({
          complexData: complexData
        })
        return;
      }
      let tipStr = item.link.tipStr
      // 没有配置跳转路径
      Dialog.alert({
        title: '温馨提示',
        message: tipStr && tipStr != '' ? tipStr : '功能暂未开放，敬请期待'
      })
      return;
    }
    // 掌厅类型
    if (item.link.type == '11') {
      market.sinopecappFunc(item.link)
      return
    }

    // 微信小程序
    if (item.link.type == '9') {
      console.info('跳转小程序', item)
      if (item.link.url) {
        if (store.state.webtype == 1) {
          // 从APP跳转小程序需要传原始ID
          bridgefunc.navigateToMiniProgram(item.link.wxAppId, item.link.wxPath)
        } else {
          let url = item.link.url.trim()
          if (url.includes('?')) {
            url += '&'
          } else {
            url += '?'
          }
          url = `${url}envVersion=${store.state.globalConfig.wxmnpEnvVersion || 'release'}`
          wx.miniProgram.navigateTo({url: url})
        }
      } else {
        Toast('微信小程序地址未配置！')
      }
      return
    }
    // 特殊类型
    if (item.link.type == '10') {
      market.enterSpecialFunc(item.link, true)
      return
    }
    // 如果是在掌厅里面
    if (store.state.webtype == '7' && router.currentRoute.path == '/blockindex') {
      market.sinopecappFunc2(item.link)
      return;
    }
    if (item.link.type == '8') {
      if (!item.link.url || item.link.url == null || item.link.url == '') {
        market.enterGamesFunc(item.link, true)
        return
      }
      item.link.type = '3'
    }

    if (item.link.type == '5') {
      market.enterClientFunc(item.link)
      return;
    }
    if (item.link.type == '6') {
      market.dynamicNavEnter(item.link)
      return;
    }

    if (item.link.type == '1') {
      market.enterSubCommon(item.link)
      return;
    }
    let jsonData = {
      path: item.link.url,
      isnativetop: item.link.renderNav ? '1' : '0',
      query: item.link.args && item.link.args != undefined ? item.link.args : {}
    };
    if (item.link.type != '3') {

      if (item.link.isztRedirect == true) {
        router.replace(jsonData)
      } else {
        market.customPush(jsonData, item.link.mustLogined)
      }
      return;
    }
    jsonData.isVuePage = true
    if (item.link.mustLogined == true) {
      if (userCenter.checkLogined(jsonData, 1) == false) {
        return
      }
    }
    //需要授权
    if (item.link.disTrust && item.link.type == '3') {
      let authorizationType = item.link.authorizationType
      if (authorizationType != '0') {
        let isHasAuth = await bridgefunc.getItemPromise('auth_' + authorizationType);
        if (isHasAuth != '1') {
          router.push({
            path: '/usercenter/authorizationpage',
            query: {
              args: encodeURIComponent(JSON.stringify(item))
            }
          })
          return;
        }
      } else {
        jsonData.authorizationType = '0'
      }
    }
    if (item.link.useOldProtocal) {
      // 使用老协议
      jsonData.isVuePage = false
    }
    if (item.link.isztRedirect == true) {
      bridgefunc.customPush(jsonData, true, true)
    } else if (item.link.openByExternal == true) {
      bridgefunc.openMobileBrowsers(jsonData.path)
    } else {
      bridgefunc.customPush(jsonData, item.link.mustLogined)
    }
  },
  backNav: function () {
    if (store.state.webtype == '4') {
      // 工银e生活
      hybrid_app.back()
    } else {
      router.go(-1)
    }
  },
  // 退出
  loginOut: function () {
    let url = '/app/json/login/logout'
    let paramsData = {
      token: store.state.login.token
    }
    // 微信小程序解绑
    if (store.state.webtype == 3) {
      url = '/app/json/user/unBindThirdUser'
      paramsData.regChannel = 6
    }
    http.post(url, paramsData).then(res => {
      let data = res.data
      if (data.status == 0) {
        userCenter.loginOut()
      } else {
        Toast(data.info ? data.info : '登录失败')
      }
    }).catch(err => {
      Toast("系统运行过程中遇到问题，请稍候再试")
    })
  },
  showMsg: function () {
    if (store.state.deployType == '2') {
      if (userCenter.checkLogined(undefined, undefined) == false) {
        return
      }
      bridgefunc.yhdClientFunc('10073');
    } else {
      router.push({
        path: '/usercenter/msgcenterlist',
        isnativetop: '1'
      })
    }
  },
  selectStation: function () {
    router.push({
      path: '/nearstation'
    })
  },
  selectArea: function () {
    store.state.location.selectType = '2'
    router.push({
      path: '/cityselector/0'
    })
    // bridgefunc.vuexStorage(function () {
    //   bridgefunc.customPush({
    //     path: '/cityselector/0',
    //     isnativetop: '1'
    //   })
    //   // router.push({
    //   //   path: '/cityselector/0',
    //   //   isnativetop:'1'
    //   // })
    // })
  },
  showScan: function () {
    bridgefunc.scanCode((dic) => {
      let code = dic.code;
      // code="StationRefuelActivity=H4sIAAAAAAAAAB3GyQ0AIQwEwVQ2AVCPD/ASm4NHol7lHgmmXqRq22rtmdmCCV3GO6F0noo/qg1jSMP80zrOieycmwvf37E3UAAAAA=="
      // Toast(code);
      // code='{"pickupId":4204,"nodeType":5,"storeOuName":"襄阳环城洗车店","storeOuCode":"1000042006014040006"}'
      // let codeObj=JSON.parse(code)
      let codeObj = {}
      try {
        codeObj = JSON.parse(code)
      } catch (e) {
        codeObj = {}
      }

      if (code && code.indexOf('COUPON:') > -1) { // 扫码领券
        let couponCode = code.split('COUPON:')[1]
        ScanCoupons.open({couponCode: couponCode});
      } else if (code && code.indexOf('COUPON=') > -1) { // sunbox 新增扫码领券
        let couponCode = code.split('COUPON=')[1]
        ScanCoupons.open({couponCode: couponCode});
      } else if (code && code.indexOf('COUPON_OUCODE:') > -1) { // sunbox 新增扫码领券
        let couponCode = code.split('COUPON_OUCODE:')[1]
        ScanCoupons.open({couponCode: couponCode, type: '2'});
      } else if (code && code.indexOf('COUPON_OUCODE=') > -1) { // sunbox 新增扫码领券  油站扫码
        let couponCode = code.split('COUPON_OUCODE=')[1]
        ScanCoupons.open({couponCode: couponCode, type: '2'});
      } else if (code && code.indexOf('COUPON_DYNAMIC_CODE:') > -1) { // sunbox 新增扫码领券
        let couponCode = code.split('COUPON_DYNAMIC_CODE:')[1]
        ScanCoupons.open({couponCode: couponCode, type: '3'});
      } else if (code && code.indexOf('COUPON_DYNAMIC_CODE=') > -1) { // sunbox 新增扫码领券
        let couponCode = code.split('COUPON_DYNAMIC_CODE=')[1]
        ScanCoupons.open({couponCode: couponCode, type: '3'});
      } else if (code && code.indexOf('COUPON_ALL:') > -1) { // sunbox 新增扫码领券
        let couponCode = code.split('COUPON_ALL:')[1]
        ScanCoupons.open({couponCode: couponCode, type: '4'});
      } else if (code && code.indexOf('COUPON_ALL=') > -1) { // sunbox 新增扫码领券
        let couponCode = code.split('COUPON_ALL=')[1]
        ScanCoupons.open({couponCode: couponCode, type: '4'});
        // } else if (code && code.indexOf('pickupId') > -1) { //扫码进入洗车劵
      } else if (code && code.indexOf('StationRefuelActivity=') > -1) { // sunbox 新增扫码领券
        let couponCode = code.split('StationRefuelActivity=')[1]
        ScanCoupons.open({couponCode: couponCode, type: '6'});
        // } else if (code && code.indexOf('pickupId') > -1) { //扫码进入洗车劵
      } else if (code && code.indexOf('COUPON_SCREEN:') > -1) { // 大屏扫码
        let couponCode = code.split('COUPON_SCREEN:')[1]
        ScanCoupons.open({couponCode: couponCode, type: '5'});
      } else if (code && codeObj.nodeType == 5) { //扫码进入洗车劵
        // modify by liao ， 这里 storeOuCode 太常用了，请想办法修改生成的二维码尽量用全大写
        // console.log(code,"code")
        market.enterNav({
          link: {
            type: '2',
            url: '/user_center/writeoff1',
            args: {
              codeObj: code
            }
          }
        })
      } else if (code && code.indexOf('rfrCode') > -1) { //扫码进入壁虎机预约报价
        router.push({
          path: '/insurance/subscribe',
          query: {
            codeObj: code,
          }
        })
      } else if (code && code.indexOf('orgid') > -1) { // 扫码加油--对象结果
        console.log(code);
        router.push({
          path: '/scan_refuel',
          query: {
            codeObj: code
          }
        })
      } else if (code && code.indexOf('SCREEN') > -1) { // 大屏扫码购
        let _code = util.getUrlParam(code, 'SCREEN')
        router.push({
          path: '/mall2/placeorder',
          query: {
            SCREEN: _code,
          }
        })
      } else if (code && code.indexOf('GAME') > -1) { // 扫码得游戏机会
        let jsonData = {
          path: `${location.origin}${config.gameUrl}/?qrCode=${code}`
        };
        bridgefunc.customPush(jsonData)
      } else if (code && code.indexOf('smartCarSashStoreOuCode') > -1) { // 扫码洗车
        let _code = util.getUrlParam(code, 'smartCarSashStoreOuCode')
        router.push({
          path: '/wash-store',
          query: {
            storeOuCode: _code
          }
        })
      } else if (code && code.indexOf('gzCarWash') > -1) { // 贵州扫码洗车
        router.push({
          path: '/carWash/home',
          query: {
            washingWay: util.getUrlParam(code, 'washingWay') || '',
            stationOuCode: util.getUrlParam(code, 'stationOuCode') || '',
            deviceCode: util.getUrlParam(code, 'deviceCode') || '',
            deviceId: util.getUrlParam(code, 'deviceId') || '',
            gzCarWash: 1,
          }
        })
      } else if (code && code.indexOf('http') == 0) { // code是地址
        let domain = window.document.domain
        let wxDomain = store.state.globalConfig.wxBaseUrl
        console.log('code', code)
        let shortCode = code.match(/(\/s\/)(\w+)/) // 扫码 兼容微信
        if (shortCode) {
          market.getShortAddress(shortCode[2]).then(longAddress => {
            if (longAddress.indexOf('StationInvoice') > -1) { // 发票
              let code = util.getUrlParam(longAddress, 'StationInvoice')
              router.push({
                path: '/invoicing',
                query: {
                  StationInvoice: code
                }
              })
            } else if (longAddress.indexOf('StationRefuelActivity') > -1) { // 加油
              // let couponCode = code.split('StationRefuelActivity=')[1]
              let couponCode = util.getUrlParam(longAddress, 'StationRefuelActivity')
              ScanCoupons.open({couponCode: couponCode, type: '6'});
            } else if (longAddress.indexOf('DEVICE_ID') > -1) { // 洗衣机
              let deviceId = util.getUrlParam(longAddress, 'DEVICE_ID')
              this.$router.push({
                path: '/device_management/payment',
                query: {
                  id: deviceId
                }
              })
            } else if (longAddress.indexOf('washingWay') > -1) { // 扫码洗车
              this.$router.push({
                path: '/carWash/details',
                query: {
                  stationOuCode: util.getUrlParam(longAddress, 'stationOuCode'),
                  deviceCode: util.getUrlParam(longAddress, 'deviceCode'),
                  washingWay: util.getUrlParam(longAddress, 'washingWay'),
                  isScanCode: util.getUrlParam(longAddress, 'isScanCode'),
                }
              })
            } else {

              if (longAddress.indexOf(domain) > -1 || longAddress.indexOf(wxDomain) > -1) {

                let arr = longAddress.split('#')
                console.log(arr)
                if (arr.length >= 2) {
                  let path = arr[1]
                  console.log(path)
                  router.push({
                    path: path
                  })
                }
              } else {

                bridgefunc.customPush({
                  path: longAddress,
                  isnativetop: '1'
                })
              }
            }
          })

          return;
        }

        if (code.indexOf(domain) > -1 || code.indexOf(wxDomain) > -1) {

          console.log(code)
          let arr = code.split('#')
          console.log(arr)
          if (arr.length >= 2) {
            let path = arr[1]
            console.log(path)
            router.push({
              path: path
            })
          }
        } else {

          bridgefunc.customPush({
            path: code,
            isnativetop: '1'
          })
        }
      }
    })
  },
  getShortAddress: function (code) { // 获取长码跳转到开票页面
    return new Promise((resolve, reject) => {
      http.post('/app/json/short_address/getShortAddress', {code: code}).then(res => {
        if (res.data.status === 0) {
          const longAddress = res.data.data.longAddress
          resolve(longAddress)
        } else {
          reject()
          Toast(res.data.info || '地址错误')
        }
      })
    })

  },
  showSearch: function () {

  },
  clickSearch: function () {
    Search.open({
      initData: {
        initClear: true,
        barHeight: store.state.barHeight,
        searchHistory: store.state.mall2.searchHistory
      },
      clearSearchHistory: () => {
        store.state.mall2.searchHistory = []
      },
      searchEvent: (searchStr) => {
        Search.close()
        if (searchStr == '') {
          return;
        }
        console.log(searchStr)
        mallCommon.pushSearchHistory(searchStr)
        // this._loadProList()
        let path = '/mall2/list/' + util.getDataString()
        router.push({
          path: path,
          query: {
            searchKey: searchStr,
          }
        })
      }
    })
  },
  clickSearchWash: function () {
    Search.open({
      initData: {
        barHeight: store.state.barHeight,
        searchHistory: store.state.mall2.searchHistory
      },
      clearSearchHistory: () => {
        store.state.mall2.searchHistory = []
      },
      searchEvent: (searchStr) => {
        Search.close()
        if (searchStr == '') {
          return;
        }
        console.log(searchStr)
        mallCommon.pushSearchHistory(searchStr)
        // this._loadProList()
        let path = '/mall2/list/' + util.getDataString()
        router.push({
          path: path,
          query: {
            searchKey: searchStr,
          }
        })
      }
    })
  },
  getNavHeight: function (isMust) {
    // let clientWidth = document.body.clientWidth;
    // let navh = 148*clientWidth/1080;
    let navHeight = 44
    if (isMust || isMust == 'true' || store.state.globalConfig.navBarVisible == 1) { // 强制显示导航
      navHeight = 44
    } else if (store.state.webtype == '2' || store.state.webtype == '7' || (store.state.webtype == '3' && (store.state.globalConfig.navBarVisible == 0 || store.state.webview == 1))) {
      // webview 去掉导航
      navHeight = 0
    }
    return navHeight
  },
  getBarHeight: function () {
    return store.state.barHeight
  },
  getCartNum: function (code) {
    if (code == 'Mallshoppingcart' && store.state.mall2 && store.state.mall2.cartNum > 0) {
      return store.state.mall2.cartNum;
    } else {
      return 0;
    }
  },
  // 中转函数
  toDecimal2: function (x) {
    return util.toDecimal2(x)
  },
  dataProcessing: function (item) {

    item.dpedData = mallCommon.priceFromItem(item);

    return item
  },
  //获取标签下el加载完毕
  getImgLoadEd: function (el, callback) {
    if (el) {
      let imgAll = el.getElementsByTagName("img");

      let imgL = imgAll.length;
      let imgStart = 0;
      for (let i = 0; i < imgAll.length; i++) {
        let imgEl = imgAll[i];
        imgEl.onload = function () {
          imgStart++;
          if (imgStart == imgL && callback) {
            callback();
          }
        }
        imgEl.onerror = function () {
          imgStart++;
          if (imgStart == imgL && callback) {
            callback();
          }
        }
      }
    }
  },
  // 海油自提配送
  returnCnoocDeliveryType: function () {
    if (store.state.mall2.zitiAddress.id != '' && store.state.mall2.zitiAddress.mchOuCode != '') {
      return '12';
    } else if (store.state.mall2.zitiAddress.id != '' && store.state.mall2.zitiAddress.mchOuCode == '') {
      return '1';
    } else if (store.state.mall2.zitiAddress.id == '' && store.state.mall2.zitiAddress.mchOuCode != '') {
      return '2';
    }
    return ''
  },
  // 获取可领取优惠券
  checkLogin(moduleData) {
    return new Promise((resolve, reject) => {
      if (store.state.login.token) {
        resolve()
      } else if (store.state.globalConfig.yn_coupon_login_type == 1) {
        Login.open({
          loginFinishEvent: (res) => {
            resolve();
          }
        })
      }else{
        util.toLogin();
      }
    })
  },
  goCouponsTarget(moduleData) {
    let path = (moduleData.link && moduleData.link.url) || '/usercenter/downloadshare'
    if(path.indexOf('http')>=0){
      location.replace(path);
    }else{
      router.replace({path, query: {fromCoupon: '1'}})
    }
  },
  getCoupons: function (mktActivityId, moduleData) {
    market.checkLogin(moduleData).then(() => {
      Loading.open()
      let params = {
        mktActivityId,  // 活动ID
      }
      http.post('/app/json/app_market/getCouScanUrl', params).then(res => {
        Loading.close()
        let data = res.data
        if (data.status == 0 && data.data) {
          if (data.data.mktAwardModelList.length) {
            MessageBox.alert("恭喜您领券成功，请尽快完成使用！", "提示", {confirmButtonText: "确定"}).then(action => {
              this.goCouponsTarget(moduleData);
            });
          } else {
            this.goCouponsTarget(moduleData);
          }
        } else {
          Toast(data.info || '领取失败')
        }
      }, err => {
        Loading.close()
      })
    })
  },
}

export default market
// {
//   install: function (Vue, Option) {
//     Object.defineProperty(Vue.prototype, '$market', {value: market});
//   }
// }

export function canNotGetHotareaClass() {
  return true
}


