import store from '../../../vuex/store'
import http from '../../../utils/http'
import Config from '../assets/config/index.js'
import router from '@/router'
import MD5 from '@/utils/md5.js'
import { Toast } from 'vant'
// let resultUrl = window.location.href
// resultUrl = resultUrl.substring(0, resultUrl.indexOf('/app-vue/app') + 12)
let resultUrl = `${window.location.origin}/site/${store.state.webtype == 2 ? 'wx' : 'app'}`
export default {
  // 海油快报滚动新闻 点击
  newsEvent(id) {
    window.location.href = `${resultUrl}/news/newsdetail?id=${id}&token=${store.state.login.token}`
  },
  // 海油快报更多点击
  moreNews() {
    window.location.href = `${resultUrl}/news/newslist?stationCode=${store.state.refuelStation.stationCode}&token=${store.state.login.token}`
  },
  // 去答题
  goSurvey(id) {
    window.location.href = `${resultUrl}/member/personal/survey?ouName=${store.state.refuelStation.stationName}&ouCode=${store.state.refuelStation.stationCode}&questId=${id}&token=${store.state.login.token}`
  },
  stationDetail(station) {
    window.location.href = `${resultUrl}/member/oilstationdetail?stationCode=${station.stationCode}&distance=${station.distance}&token=${store.state.login.token}`
  },
  goRefuel() {
    window.location.href = `${resultUrl}/card/onepay?token=${store.state.login.token}`
  },
  goRegister(path, stationName, stationCode) {
    window.location.replace(`${resultUrl}${path}?stationName=${stationName}&stationCode=${stationCode}&fromMap=${1}&token=${store.state.login.token}`)
  },
  // 跳转卡界面的时候请求地址做签名
  signParamOfCard(pare, key) {
    var pareArr = []
    for (var item in pare) {
      if (pare[item] === null || pare[item] === undefined || pare[item] === '') {
        continue
      }
      if(item==="token"){continue
      }
      pareArr.push(item + '=' + pare[item])
    }
    var pareStr = pareArr.join('&')
    pareArr.push('key=' + key)
    var pareStrMd5 = pareArr.join('&')
    var sign = MD5(pareStrMd5)
    pareStr = pareStr + '&token='+pare['token']+'&wxOpenId=""&sign=' + sign.toUpperCase()
    return pareStr
  },
  // 跳转卡系统页面
  jumpCardSysPage(type, comeFromPage = '/cnooc-card') {
    let userId = '',
      cardToken = '',
      key = '';
    http.post('/app/json/card/loadToken', {}).then(res => {
      let data = res.data
      if (data.status == 0) {
        userId = data.data.userId
        cardToken = data.data.cardToken
        key = data.data.key
        switch (type) {
          case 1:
            var pareStr1 = this.signParamOfCard({ appType: 'APP', token: cardToken, userCode: userId, wxOpenId: "" }, key)
            router.push({
              path: '/cnooc-iframe',
              query: {
                pageTitle: '我的卡片',
                comeFromPage,
                pageUrl: Config.cardBaseURL + "/HykSite/v/user/myaccount/index?" + pareStr1
              }
            })
            break
          case 2:
            var pareStr2 = this.signParamOfCard({ appType: 'APP', token: cardToken, userCode: userId, wxOpenId: "" }, key);
            router.push({
              path: '/cnooc-iframe',
              query: {
                pageTitle: '查询服务',
                comeFromPage,
                pageUrl: Config.cardBaseURL + "/HykSite/v/user/balance/index?" + pareStr2
              }
            })

            break
          case 3:
            var pareStr3 = this.signParamOfCard({ appType: 'APP', token: cardToken, userCode: userId, wxOpenId: "" }, key)
            router.push({
              path: '/cnooc-iframe',
              query: {
                pageTitle: '充值服务',
                comeFromPage,
                pageUrl: Config.cardBaseURL + "/HykSite/v/card/recharge/index?" + pareStr3
              }
            })
            break
          case 4:
            http.post('/app/json/card/loadAllCardNum', {}).then(res => {
              let data = res.data
              if (data.status == 0) {
                if (data.data > 0) {
                  var pareStr4 = this.signParamOfCard({ appType: 'APP', token: cardToken, userCode: userId, wxOpenId: "" }, key)
                  router.push({
                    path: '/cnooc-iframe',
                    query: {
                      pageTitle: '快捷支付',
                      comeFromPage,
                      pageUrl: Config.cardBaseURL + "/HykSite/v/user/onekeyrefuel/index?" + pareStr4
                    }
                  })
                } else {
                  router.replace('/cnooc-card')
                }
              } else {
                router.replace('/cnooc-card')
              }
            }).catch(err => {
              router.replace('/cnooc-card')
            })
            break
          case 5:
            http.post('/app/json/card/loadAllCardNum', {}).then(res => {
              let data = res.data
              if (data.status == 0) {
                if (data.data > 0) {
                  var pareStr4 = this.signParamOfCard({ appType: 'APP', token: cardToken, userCode: userId, wxOpenId: "" }, key)
                  router.replace({
                    path: '/cnooc-iframe',
                    query: {
                      pageTitle: '一键加油',
                      comeFromPage,
                      pageUrl: Config.cardBaseURL + "/HykSite/v/user/onekeyrefuel/index?" + pareStr4
                    }
                  })
                } else {
                  router.replace('/cnooc-card')
                }
              } else {
                router.replace('/cnooc-card')
              }
            }).catch(err => {
              router.replace('/cnooc-card')
            })
            break
        }
      } else {
        Toast({
          type: 'fail',
          duration: 2500,
          mask: false,
          message: '获取当前用户信息错误，请您联系管理员'
        })
        return false;
      }
    }).catch(err => {
      Toast({
        type: 'fail',
        duration: 2500,
        mask: false,
        message: '获取当前用户信息错误，请您联系管理员'
      })
      return false;
    })
  },
  showHtml(data) {
    return data
      .replace(data ? /&(?!#?\w+;)/g : /&/g, '&amp;')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "\'")
      .replace(/&amp;/g, '&')
      .replace(/p&gt;/g, 'p')
      .replace(/&nbsp;/g, ' ')
  }
}
