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

let bulkApi = ['http://192.168.31.173:18807/app/json/group_buying_head_info/findSelfInfo','/app/json/group_buying_my_earnings/getMyEarnings','http://192.168.31.173:18807/app/json/group_buying_order/findGroupBuyingActivityOrderItemListByOrderId','/app/json/group_buying_order/findGroupBuyingActivityOrderByList','/app/json/app_group_buying_share_home/queryShareHomePageInfo', '/app/json/group_buying_order/findGroupBuyingActivityOrderItemListByOrderId', '/app/json/group_buying_order/findGroupBuyingActivityOrderByList'];

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

      if (bulkApi.indexOf(config.url) !== -1) {
        config.headers.token = store.state.login.token;
        config.headers.Authorization = store.state.login.token;
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

              if (store.state.webtype == '8') {
                if (store.state.etpAppId) {
                  nArgs.channel = store.state.etpAppId
                }
              }

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
        if (store.state.globalConfig.channel) {
          params.channel = store.state.globalConfig.channel
        }
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
      if (store.state.login.token != '' && (store.state.webtype == '1' || store.state.webtype == '0')) {
        return userCenter.expireUpdateToken(res);
      } else {
        store.state.login.token = '';
        bridgefunc.vuexStorage(function () {
          util.toLogin();
          return res;
        })
      }
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
