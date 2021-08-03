import Config from './../api/config'
import axios from 'axios'
import store from '../vuex/store'
import bridgefunc from './bridgefunc'
import logCenter from './logCenter'
import util from "./util";
import router from "../router";
import Loading from '../components/Vendor/Loading/index'
import Qs from 'qs'
import {
  Base64
} from 'js-base64'
import userCenter from "../components/usercenter/js/userCenter";
import dataMergeInterceptor from "./staticData/dataMergeInterceptor";
import Watchman from './watchman'
import appLocalstorage from "@zkty-team/x-engine-module-localstorage";

// 在此数组中的路径，都会增加加密字段
let sunboxEncodeArray = ['/app/json/login/register', '/app/json/login/sendSms', '/app/json/login/emailLogin', '/app/json/login/emailRegister', '/app/json/login/login', '/app/json/login/smsLogin', '/app/json/login/smsRegister', '/app/json/coupon/getMyCouInfo', '/app/json/coupon/getMyCouInfoByPage', '/app/json/login/updateToken']

// 网易易盾反作弊接口
let antiSpam = ['/app/json/login/register', '/app/json/login/sendSms', '/app/json/login/emailLogin', '/app/json/login/emailRegister', '/app/json/login/login', '/app/json/login/smsLogin', '/app/json/user/identifySubmmit', '/app/json/user/driverInfoSubmmit', '/app/json/user/bindVehicle', '/app/json/login/updateToken']
// 油惠通 某些接口需要跳过拦截器，token相关问题。增加下面参数。 尽量不要单独处理
let yhtApiSkip = ['/app/json/login/getVerifyImg', '/app/json/login/sendSms', '/app/json/login/login', '/app/json/login/register', '/app/json/login/wechatAppLogin', '/app/json/user/forgetPwd', '/app/json/news/getNewsList']
const pro = process.env.NODE_ENV === 'production'

const headers = {
  'Content-Type': 'application/x-www-form-urlencoded',
}

let Axios = axios.create({
  baseURL: Config.baseURL,
  timeout: 31000,
  // timeout: 3100000,
  responseType: 'json',
  withCredentials: false,
  headers
})
console.log('Config.baseURL', Config.baseURL)

let bulkApi = ['/app/json/group_buying_areas/findByRecentUseAddress', '/app/json/app_community_group_order/queryByShoppingOrderId', '/app/json/home/getVueAppTempData', '/app/json/home/vueAppTempData', '/app/json/app_member_center/findIntegralRecordList', '/app/json/login/getYthUser', '/app/json/app_pay/getWalletBalance', '/app/json/app_shopping_order/findOrderFormList', '/app/json/logistics_system/queryLogisticsInfo', '/app/json/app_group_buying_share_home/generateShareLink', '/app/json/groupbuying_activity_app/list', '/app/json/group_buying_head_info/findHeadInfoByList', '/app/json/group_buying_head_info/findSelfInfo', '/app/json/group_buying_my_earnings/getMyEarnings', '/app/json/group_buying_order/findGroupBuyingActivityOrderItemListByOrderId', '/app/json/group_buying_order/findGroupBuyingActivityOrderByList', '/app/json/app_group_buying_share_home/queryShareHomePageInfo', '/app/json/group_buying_order/findGroupBuyingActivityOrderItemListByOrderId', '/app/json/group_buying_order/findGroupBuyingActivityOrderByList'];

/**
 * 重写Axios post，以实现合并接口以及静态数据的直接返回。
 * @param url
 * @param data
 * @param config
 * @returns {*|AxiosPromise<any>}
 */
// Axios.prototype['post'] = function (url, data, config) {
//   return dataMergeInterceptor.rewritePost(url, data, config)
// }
Axios.post = function (url, data, config) {
  return dataMergeInterceptor.rewritePost(url, data, config)
}

Axios.interceptors.request.use(
  async config => {
    if (/times\/charge-bff/.test(config.url)) {
      let tokenStr1;
      await appLocalstorage.get({ key: "LLBToken", isPublic: true }).then(res => {
        tokenStr1 = "Bearer " + res.result;
      });
      config.headers.Authorization = tokenStr1
      console.log(`一体化token`, config.headers.Authorization);
      // config.headers.Authorization = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiIxMzU2MDU0MzgzOCIsInNjb3BlIjpbImFsbCJdLCJpZCI6MjQwNTU0OTA2MDA4MjYzMTg0MCwiZXhwIjoxNjI3Mzc4NTI3LCJhdXRob3JpdGllcyI6WyJ2aXNpdG9yIiwib3duZXIiXSwianRpIjoiMDJmYjg5MjQtMjZhZi00MjE2LTg0NjYtYTc0ZjcwYjZkMmY4IiwiY2xpZW50X2lkIjoiYXBwX2MifQ.f4GClQFSj8GEw25L9dxtFIgulKTggQkVCFVgJSJoFiaXIxlNDamAnVwOB6q7zSCOnli7E9UHr6ymSCXOGm47bhy-VEAW5BRkRO9e-vdeBfm9ebjTLW8iVo5PTxIWYYWR9pYZ0ZcYHJ7s4yH89iBSjDlHV9VDoXIItGkZ7gGi7HHimirdHCgwdUdbJYKEGEmX6aErCKpSXvKRtaxc53xNeJmvt5jYKZEgQkg8SggIDnTZhINNuT3wlL3mZidiJ1SPTrbjMUCUqQOtNdFSxPbJNQQLkm0AdGuQJiAVuUvAwXJKdX8_os_stsvQ5ag1cMR0OsuBG5lqsHFXp9ylY1EG1g"
    } else {
      config.headers.token = store.state.login.token;
      config.headers.Authorization = store.state.login.token;
      //   config.headers.token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiIxMzU2MDU0MzgzOCIsInNjb3BlIjpbImFsbCJdLCJpZCI6MjQwNTU0OTA2MDA4MjYzMTg0MCwiZXhwIjoxNjI3Mzc4NTI3LCJhdXRob3JpdGllcyI6WyJ2aXNpdG9yIiwib3duZXIiXSwianRpIjoiMDJmYjg5MjQtMjZhZi00MjE2LTg0NjYtYTc0ZjcwYjZkMmY4IiwiY2xpZW50X2lkIjoiYXBwX2MifQ.f4GClQFSj8GEw25L9dxtFIgulKTggQkVCFVgJSJoFiaXIxlNDamAnVwOB6q7zSCOnli7E9UHr6ymSCXOGm47bhy-VEAW5BRkRO9e-vdeBfm9ebjTLW8iVo5PTxIWYYWR9pYZ0ZcYHJ7s4yH89iBSjDlHV9VDoXIItGkZ7gGi7HHimirdHCgwdUdbJYKEGEmX6aErCKpSXvKRtaxc53xNeJmvt5jYKZEgQkg8SggIDnTZhINNuT3wlL3mZidiJ1SPTrbjMUCUqQOtNdFSxPbJNQQLkm0AdGuQJiAVuUvAwXJKdX8_os_stsvQ5ag1cMR0OsuBG5lqsHFXp9ylY1EG1g"
      //   config.headers.Authorization = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiIxMzU2MDU0MzgzOCIsInNjb3BlIjpbImFsbCJdLCJpZCI6MjQwNTU0OTA2MDA4MjYzMTg0MCwiZXhwIjoxNjI3Mzc4NTI3LCJhdXRob3JpdGllcyI6WyJ2aXNpdG9yIiwib3duZXIiXSwianRpIjoiMDJmYjg5MjQtMjZhZi00MjE2LTg0NjYtYTc0ZjcwYjZkMmY4IiwiY2xpZW50X2lkIjoiYXBwX2MifQ.f4GClQFSj8GEw25L9dxtFIgulKTggQkVCFVgJSJoFiaXIxlNDamAnVwOB6q7zSCOnli7E9UHr6ymSCXOGm47bhy-VEAW5BRkRO9e-vdeBfm9ebjTLW8iVo5PTxIWYYWR9pYZ0ZcYHJ7s4yH89iBSjDlHV9VDoXIItGkZ7gGi7HHimirdHCgwdUdbJYKEGEmX6aErCKpSXvKRtaxc53xNeJmvt5jYKZEgQkg8SggIDnTZhINNuT3wlL3mZidiJ1SPTrbjMUCUqQOtNdFSxPbJNQQLkm0AdGuQJiAVuUvAwXJKdX8_os_stsvQ5ag1cMR0OsuBG5lqsHFXp9ylY1EG1g"
    }

    if (bulkApi.indexOf(config.url) !== -1) {
      config.headers.token = store.state.login.token;
      config.headers.Authorization = store.state.login.token;
    }
    if (/times\/distr-service\/index\/api-c\/v1\/get\/my\/info/.test(config.url)) {
      let ua = window.navigator.userAgent.toLowerCase()
      let isWX = ua.match(/MicroMessenger/i) == 'micromessenger';
      console.log('ythtttttttttttt--store----->', store.state.ythToken)
      console.log('---getItem---->', localStorage.getItem('ythToken'))
      if (isWX) {
        config.headers.Authorization = store.state.ythToken || localStorage.getItem('ythToken');
      } else {
        let tokenStr1;
        await appLocalstorage.get({ key: "LLBToken", isPublic: true }).then(res => {
          tokenStr1 = "Bearer " + res.result;
        });
        config.headers.Authorization = tokenStr1;
      }
    }


    if (/times\-center\-trade/.test(config.url)) {

      // config.headers.Authorization = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiIxMzU2MDU0MzgzOCIsInNjb3BlIjpbImFsbCJdLCJpZCI6MjQwNTU0OTA2MDA4MjYzMTg0MCwiZXhwIjoxNjI3Mzc4NTI3LCJhdXRob3JpdGllcyI6WyJ2aXNpdG9yIiwib3duZXIiXSwianRpIjoiMDJmYjg5MjQtMjZhZi00MjE2LTg0NjYtYTc0ZjcwYjZkMmY4IiwiY2xpZW50X2lkIjoiYXBwX2MifQ.f4GClQFSj8GEw25L9dxtFIgulKTggQkVCFVgJSJoFiaXIxlNDamAnVwOB6q7zSCOnli7E9UHr6ymSCXOGm47bhy-VEAW5BRkRO9e-vdeBfm9ebjTLW8iVo5PTxIWYYWR9pYZ0ZcYHJ7s4yH89iBSjDlHV9VDoXIItGkZ7gGi7HHimirdHCgwdUdbJYKEGEmX6aErCKpSXvKRtaxc53xNeJmvt5jYKZEgQkg8SggIDnTZhINNuT3wlL3mZidiJ1SPTrbjMUCUqQOtNdFSxPbJNQQLkm0AdGuQJiAVuUvAwXJKdX8_os_stsvQ5ag1cMR0OsuBG5lqsHFXp9ylY1EG1g"
      if (store.state.webtype == "2" || store.state.webtype == "3") {
        config.headers.Authorization = localStorage.getItem('ythToken')
      } else {
        let ythToken = '';
        await appLocalstorage.get({ key: "LLBToken", isPublic: true }).then(res => {
          ythToken = res.result;
        });
        config.headers.Authorization = ythToken
      }
      config.headers.access_channel = 'mall'
      config.headers["Content-Type"] = "application/json"
    }

    //中台接口要带一体化token

    /*物业系统请求处理逻辑
    Content-Type方式是: application/json;charset=UTF-8
    */
    let memberPatt = /times\/member-bff/g; //会员
    let pcsPatt = /pcs\/bill-center\/check-bill/g; //物业
    if (pcsPatt.test(config.url) || memberPatt.test(config.url)) {
      config.headers["Content-Type"] = "application/json;charset=UTF-8"
    }

    var time = new Date().getTime();
    let urlStr = config.url;

    // 是否加密判断
    let useEncode = false
    let cToken = ''
    let appId = ''
    if (store.state.globalConfig.encyptDisable != 1) {
      for (let i = 0; i < sunboxEncodeArray.length; i++) {
        if (urlStr == sunboxEncodeArray[i]) {
          useEncode = true
          break;
        }
      }
    }

    if (urlStr.indexOf("?") == -1) {
      config.url = config.url + '?ver=' + time;
    } else {
      config.url = config.url + '&ver=' + time;
    }

    if (store.state.globalConfig.isEnableAntiCheat == 1 && antiSpam.includes(urlStr)) {
      cToken = await Watchman.getToken().catch(err => console.log(err))
    }

    if (config.method == 'post') {
      let postData = config.data;
      return new Promise((resolve, reject) => {
        bridgefunc.getCommonArgs((cmArgs) => {

          let nArgs = JSON.parse(JSON.stringify(cmArgs))
          if (util.isJsonObj(postData)) {

            nArgs.longitude = store.state.currentLocation.posx
            nArgs.latitude = store.state.currentLocation.posy;
            if (cToken) nArgs.cToken = cToken
            if (store.state.login.token && store.state.login.token != '') {
              nArgs.token = store.state.login.token
            } else {
              // if (store.state.deployType == 2) {
              // 不得已而为之，跳过所有的没有传token的情况，这样兼容了，没有token的情况
              nArgs.hbsy_web_tag_type = 1
              // // 油惠通 某些接口需要跳过拦截器，token相关问题。增加下面参数。 尽量不要单独处理
              // if (yhtApiSkip.indexOf(config.url) > -1) {
              //   nArgs.hbsy_web_tag_type = 1
              // }
              // }
            }

            // if (store.state.webtype == '8') {
            //   if (store.state.etpAppId) {
            //     nArgs.channel = store.state.etpAppId
            //   }
            // }

            for (let key in postData) {
              nArgs[key] = postData[key]
            }
            let dic = {}
            if (nArgs.isJsonData) {
              dic = nArgs
              let d = Qs.stringify(dic, {
                arrayFormat: 'repeat'
              });
              config.data = d;
              resolve(config);
            } else {
              if (useEncode == true) {
                let encryptData = JSON.stringify(nArgs)
                if (store.state.globalConfig.encyptBase64Enable == '1') { // 是否启用base64加密
                  encryptData = Base64.encode(JSON.stringify(nArgs))
                }
                bridgefunc.sunboxencode(encryptData, 1, (result, resultStr) => {
                  if (result == 1) {
                    nArgs.ciphertext = resultStr
                    dic = {
                      jsonData: JSON.stringify(nArgs),
                      hbsy_web_tag_type: nArgs.hbsy_web_tag_type
                    }
                    let d = Qs.stringify(dic, {
                      arrayFormat: 'repeat'
                    });
                    config.data = d;
                    resolve(config);
                  } else {
                    dic = {
                      jsonData: JSON.stringify(nArgs),
                      hbsy_web_tag_type: nArgs.hbsy_web_tag_type
                    }
                    let d = Qs.stringify(dic, {
                      arrayFormat: 'repeat'
                    });
                    config.data = d;
                    resolve(config);
                  }
                })
              } else {
                if (/pcs\/bill-center\/check-bill/.test(config.url)) { //物业系统接口处理逻辑，请求参数不带nArgs的数据
                  dic = config.data
                } else {
                  dic = {
                    jsonData: JSON.stringify(nArgs),
                    hbsy_web_tag_type: nArgs.hbsy_web_tag_type
                  }
                }

                if (/times\-center\-trade/.test(config.url)) {  //服务商城接口不需要转Qs,直接传JSON
                  dic = JSON.stringify(config.data)
                  config.data = dic
                } else {
                  let d = Qs.stringify(dic, {
                    arrayFormat: 'repeat'
                  });
                  config.data = d;
                }
                resolve(config);
              }
            }
          } else {
            resolve(config);
          }
        });
      });
    } else if (config.method == 'get') {
      let params = {}
      if (cToken) {
        params.cToken = cToken
      }
      // if (store.state.globalConfig.channel) {
      //   params.channel = store.state.globalConfig.channel
      // }
      config.params = Object.assign(config.params || {}, params)

      return config;
    }
  },
  error => {
    return Promise.reject(error);
  }
);

// 返回状态判断(添加响应拦截器)
Axios.interceptors.response.use(
  res => {
    // 对响应数据做些事
    /* if (res.data && !res.data.success) {

     return Promise.reject(res.data.error.message);
     } */

    // router.replace({
    //   path: 'oilhandlogin',
    // })

    let data = res.data;
    //token  过期重新登录
    console.log('http res', res)
    if (data.errorCode == 1000 && res.config.url.indexOf('/app/json/login/updateToken?') == -1) {
      res.data.info = '';
      // if (store.state.login.token != '' && (store.state.webtype == '1' || store.state.webtype == '0')) {
      //   return userCenter.expireUpdateToken(res);
      // } else {
      if (store.state.webtype == '1' || store.state.webtype == '0') {
        store.state.login.token = ''
        bridgefunc.vuexStorage(function () {
          // !store.state.ythToken
          if (process.env.VUE_APP_ENV === 'development') util.toLogin();
          if (!store.state.ythToken) {//如果没有一体化token,表示在普通网页不在app或小程序，走正常登录流程
            util.toLogin();
          } else {
            // 用户token过期重新走一体化转商城token接口
            let url = window.location.hash;
            let beforeUrl = url.substr(0, url.indexOf("?"));   //?之前主地址
            let afterUrl = url.substr(url.indexOf("?") + 1);   //？之后参数路径
            let nextUrl = "";
            let arr = new Array();
            if (afterUrl != "") {
              let urlParamArr = afterUrl.split("&"); //将参数按照&符分成数组
              for (let i = 0; i < urlParamArr.length; i++) {
                let paramArr = urlParamArr[i].split("="); //将参数键，值拆开
                //如果键雨要删除的不一致，则加入到参数中
                if (paramArr[0] !== 'token' && paramArr[0] !== 'projectId') {
                  arr.push(urlParamArr[i]);
                }
              }
            }
            if (arr.length > 0) {
              nextUrl = "?" + arr.join("&");
            }
            url = beforeUrl + nextUrl;
            console.log('url', url)
            window.location.href = `${window.location.origin}/app/index?token=${store.state.ythToken}&projectId=&redirect=${encodeURIComponent(`/app-vue/app/index.html${url}`)}`
          }
          // util.toLogin();
          return res;
        })
      }
      // }
    } else if (data.errorCode == 2051) {
      //设备更换 需要短信登录才行
      util.toSmsLogin();
      res.data.info = '登陆设备变更，请重新进行短信验证';
      return res;
    }
    if (data.currentTime != '' && data.currentTime != 'null' && data.currentTime != 'undefined') {
      let currentTime = util.getDateFromString(data.currentTime)
      let localTime = parseInt((new Date()).getTime() / 1000)
      store.state.severTime.currentTime = currentTime
      store.state.severTime.jetlag = currentTime - localTime
    } else {
      store.state.severTime.curTime = parseInt((new Date()).getTime() / 1000)
      store.state.severTime.jetlag = 0
    }
    // 导致了部分页面还在加载没有loading了，loading请自己管理
    // Loading.close()
    return res;
  },
  error => {
    // 导致了部分页面还在加载没有loading了，loading请自己管理
    // Loading.close()

    // console.log(error);
    return Promise.reject(error);
  }
);

export default Axios;