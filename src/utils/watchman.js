import store from '../vuex/store'
import productInit from '../api/productInit'
import bridgefunc from "./bridgefunc";
import http from "./http";
import MessageBox from "../components/Vendor/messagebox";
import router from "../router";

export default {
  async init() {
    const src = 'https://acstatic-dun.126.net/tool.min.js?t=' + new Date().getTime()
    return new Promise((resolve, reject) => {
      // 网易易盾
      productInit.loadJsFile(src).then(() => {
        // 只需初始化一次
        const num = store.state.globalConfig.anti_cheat_productNumber
        if (num) {
          initWatchman({
            productNumber: store.state.globalConfig.anti_cheat_productNumber,
            onload: function (instance) {
              window.wm = instance
              resolve()
            }
          })
        } else {
          reject('vue conf anti_cheat_productNumber empty')
        }

      })
    })
  },
  getToken() {
    return new Promise((resolve, reject) => {
      const id = store.state.globalConfig.anti_cheat_business_id
      if (id) {
        wm && wm.getToken(id, function(token) {
          console.log('anti_cheat_business_id', token)
          resolve(token)
        }, function(error) {
          reject(error)
        })
      } else {
        reject('vue conf anti_cheat_business_id empty')
      }
    })
  },
  yidunLoginInit() {
    console.log('易盾一键登录')
    console.log('deployType' + store.state.deployType)
    console.log('can_use_yidun' + store.state.globalConfig.can_use_yidun)
    console.log('yidun_businessId' + store.state.globalConfig.yidun_businessId)
    if (store.state.webtype == '1' && (!store.state.login.token || store.state.login.token == '')) {
      /**
       * 初始化 两分钟之内有效 需要在每一分半 初始化一次
       */
      bridgefunc.yidunInit({
        businessId: store.state.globalConfig.yidun_businessId
      }, res => {
        // console.log(res)
        if (res == '1') {
          store.commit('setYiDunLogin', true)
          console.log('易盾初始化成功！')
        } else {
          store.commit('setYiDunLogin', false)
          console.log('易盾初始化失败！')
        }
        setTimeout(()=>this.yidunLoginInit(),90 * 1000)
      })
    }
  }
}
