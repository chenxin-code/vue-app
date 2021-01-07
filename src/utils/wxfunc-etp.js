import Vue from 'vue'
import util from './util'
import Router from '../router'
import Http from './http'
import {Toast} from 'vant'
import Store from '../vuex/store.js'
Vue.use(Toast)
class JwxEtp {
  constructor(jsApiList) {
    this.jsApiList = jsApiList
  }
  
  hideAllBaseMenu() {
    this._init(['hideAllNonBaseMenuItem']).then(() => {
      wx.hideAllNonBaseMenuItem()
    })
  }

  // 获取经纬度
  getEtpLocation(callback) {
    this._init(['getLocation']).then(() => {
      wx.getLocation({
        type: 'gcj02',
        success: function (res) {
          callback && callback(res)
        }
      })
    })
  }

  // 创建会话接口
  createEnterpriseChat(userIds, externalUserIds, callback) {
    if (!userIds || !externalUserIds) {
      console.log('传参有误')
    } else {
      this._init(['openEnterpriseChat']).then(() => {
        wx.openEnterpriseChat({
          // 注意：userIds和externalUserIds至少选填一个。内部群最多2000人；外部群最多500人；如果有微信联系人，最多40人
          userIds: userIds.join(';'), // 参与会话的企业成员列表，格式为userid1;userid2;...，用分号隔开。
          externalUserIds: externalUserIds.join(';'), // 参与会话的外部联系人列表，格式为userId1;userId2;…，用分号隔开。
          groupName: '群聊', // 必填，会话名称。单聊时该参数传入空字符串""即可。
          success: function(res) {
            callback && callback(res)
          },
          fail: function(res) {
            if (res.errMsg.indexOf('function not exist') > -1){
              alert('版本过低请升级')
            }
          }
        })
      })  
    }
  }

  // 获取当前外部联系人userid
  getExternalContact(callback) {
    this._init(['getCurExternalContact']).then(() => {
      this._initAgent(['getCurExternalContact']).then((configInfo) => {
        wx.invoke('getCurExternalContact', {}, function(res) {
          if (res.err_msg == "getCurExternalContact:ok") {
            console.log('wxfunc-etp getCurExternalContact res', res)
            callback && callback(res.userId)
          } else {
            // 错误处理
            console.log('wxfunc-etp getCurExternalContact err')
          }
        })
      })
    })
  }

  _init(jsApiList) {
    return new Promise((resolve, reject) => {
      this._getConfig().then(res => {
        wx.config({
          beta: true,
          debug: false,
          appId: res.corpId,
          timestamp: res.timestamp,
          nonceStr: res.nonceStr,
          signature: res.signature,
          jsApiList: jsApiList
        })
        wx.ready(() => {
          resolve(res)
        })
        wx.error((res) => {
          reject(res)
          console.log('we error', res)
        })
      }).catch(function (error) {
        console.log('发生错误！', error)
      })
    })
  }

  _getConfig() {
    return new Promise((resolve, reject) => {
      const agent = navigator.userAgent
      const isiOS = !!agent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // ios终端
      let url = window.location.href.split('#')[0]
      let params = {
        url: url,
        agentId: Store.state.etpAgentId, // 企业微信授权需要（该值在router/index.js中通过地址烂获取并存入）
        appId: Store.state.etpAppId, // 企业微信授权需要（该值在router/index.js中通过地址烂获取并存入）
        hbsy_web_tag_type: 1,
      }
      Http.post('/app/json/wechat_qy/signature', params).then(res => {
        let data = res.data
        if (data.status === 0) {
          resolve(data.data)
        } else {
          reject('获取签名信息失败!')
        }
      }).catch(error => {
        reject(error)
      })
    })
  }

  _initAgent(jsApiList) {
    return new Promise((resolve, reject) => {
      this._getAgentConfig().then(agentSignatureInfo => {
        wx.agentConfig({
          corpid: agentSignatureInfo.corpId, // 必填，企业微信的corpid，必须与当前登录的企业一致
          agentid: agentSignatureInfo.agentId, // 必填，企业微信的应用id （e.g. 1000247）
          timestamp: agentSignatureInfo.timestamp,
          nonceStr: agentSignatureInfo.nonceStr,
          signature: agentSignatureInfo.signature,
          jsApiList: jsApiList, //必填
          success: (res) => {
            resolve(res)
          },
          fail: (res) => {
            if (res.errMsg.indexOf('function not exist') > -1) {
              alert('版本过低请升级')
            }
          },
          complete: (res) => {
            console.log('agentConfig complete', res)
          }
        })
      }).catch(function (error) {
        console.log('发生错误！', error)
      })
    })
  }

  _getAgentConfig() {
    return new Promise((resolve, reject) => {
      const agent = navigator.userAgent
      const isiOS = !!agent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // ios终端
      let url = window.location.href.split('#')[0]
      let params = {
        url: url,
        agentId: Store.state.etpAgentId, // 企业微信授权需要（该值在router/index.js中通过地址烂获取并存入）
        appId: Store.state.etpAppId, // 企业微信授权需要（该值在router/index.js中通过地址烂获取并存入）
        hbsy_web_tag_type: 1,
      }
      Http.post('/app/json/wechat_qy/agentSignature', params).then(res => {
        let data = res.data
        if (data.status === 0) {
          resolve(data.data)
        } else {
          reject('获取签名信息失败!')
        }
      }).catch(error => {
        reject(error)
      })
    })
  }
}
export default new JwxEtp()
