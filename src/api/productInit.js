import logCenter from "../utils/logCenter";

const dev = process.env.NODE_ENV !== 'production'
import MessageBox from '@/components/Vendor/messagebox/index';
import utils from "@/utils/util";
import {Dialog} from 'vant';
import Toast from "../components/Vendor/toast";
import axios from 'axios'
import Config from './../api/config'
import Qs from 'qs'
import Agreement from '../components/usercenter/agreement'
import store from "../vuex/store";
const JSALIPAYURL = 'https://appx/web-view.min.js'
const JSWXURL = 'https://res.wx.qq.com/open/js/jweixin-1.3.2.js'
// 企业微信部分api必须依赖1.2版本
const JSWXEPTURL = 'https://res.wx.qq.com/open/js/jweixin-1.2.0.js'
// 此文件尽量不要改，如果有修改，提交git的时候记得检验，是否能符合要求
const ProductInit = {
  vuexInit: function (state) {

    // 慎之，关键
    if (dev) {
      state.webtype = '0'
      state.deployType = '0'
    }

    // sunbox_web_type		selfapp:我们的app；selfsdk：我们封装的webview SDK；thirdapp：其他公司的app里面；没有的时候理解为网页场景
    let sunboxwebtype = utils.getCookie('sunbox_web_type')

    // console.log('sunbox_web_type:', sunboxwebtype)

    if (sunboxwebtype == 'selfapp') {
      state.webtype = '1'
    }

    let u = navigator.userAgent;
    //判断是否是微信
    var ua = u.toLowerCase();
    // 通过正则表达式匹配ua中是否含有MicroMessenger字符串
    if (ua.match(/wxwork/i) == 'wxwork') {
      state.webtype = '8'
    } else if (ua.match(/MicroMessenger/i) == 'micromessenger') {
      state.webtype = '2'
    } else if (ua.match(/Alipay/i) == 'alipay') {
      state.webtype = '5'
    } else if (utils.isICBCApp()) {
      // 工银e生活
      state.webtype = '4'
      // 临时作用
      store.state.channel = '401'
    } else if (utils.isZTAPP()) {
      // 掌厅 app
      state.webtype = '7'
    }

    if (window.location.host.includes('uhuitong.com') > 0) {
      // 油惠通环境
      state.deployType = '2'
    } else if (window.location.host.includes('tbdapp.deepermobile.com') > 0) {
      // 有路环境
      state.deployType = '3'
    } else if (window.location.host.includes('.cnooc.com.cn') > 0) {
      // 海油环境
      state.deployType = '4'
    }

    // console.log('state.webtype:', state.webtype)

    //判断是否是小程序
    return new Promise((resolve) => {
      if (state.webtype == '2') {
        ProductInit.loadJsFile(JSWXURL).then(() => {
          wx.miniProgram.getEnv(function (res) {
            if (res.miniprogram) {
              state.webtype = '3'
            }
            resolve()
          })
        })
      } else if (state.webtype == '8') {
        ProductInit.loadJsFile(JSWXEPTURL).then(() => {
          resolve()
        })
      } else if (state.webtype == '5') {
        // 支付宝小程序
        ProductInit.loadJsFile(JSALIPAYURL).then(() => {
          my.getEnv(function(res){
            if (res.miniprogram) {
              state.webtype = '6'
            }
            resolve()
          });
        })

      } else if (state.webtype == '1' || state.webtype == '0') {
        let isAgree = localStorage.getItem('agreement_tip_user_select')
        if (isAgree != 'true') {
          // 这里不能有公共参数
          let url = Config.baseURL + '/app/json/news/getNewsList'
          let params = Qs.stringify({values: 38, hbsy_web_tag_type: 1}, {arrayFormat: 'repeat'});
          axios.post(url, params, {
            'Content-Type': 'application/x-www-form-urlencoded'
          }).then((res) => {
            // console.log(res);
            let data = res.data
            let integralList = data.data || []
            if (integralList.length > 0) {
              let content = integralList[0].content
              ProductInit.agreementEvent(content, () => {
                localStorage.setItem('agreement_tip_user_select', 'true')
                resolve()
              })
            } else {
              resolve()
              // Toast('请求用户协议出错！')
            }
          }).catch((error) => {
            console.log(error)
            Toast('请求用户协议出错！')
          });
          // http.post('/app/json/news/getNewsList', {values: 38}).then(res => {
          //   let data = res.data
          //   if (data.status == 0) {
          //     // this.integralList = data.data || []
          //     // Dialog({ message: '提示' });
          //   } else {
          //     this.$Toast(res.info)
          //   }
          // })
        } else {
          resolve()
        }
      } else {
        resolve()
      }
    })
  },
  agreementEvent: function (content, callback) {
    Agreement.open({
      initData: {
        content: content,
      },
      agreeEvent: () => {
        callback()
      },
      cancelEvent: () => {
        Dialog({
          title: '提示',
          message: '根据工信部最新通知，采集用户信息必须经过用户同意，给您带来的不便敬请谅解！',
          confirmButtonText: '知道了',
          className: 'dialog-big-message'
        }).then(() => {
          ProductInit.agreementEvent(content, callback)
        });
      }
    })
  },
  loadJsFile(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = src
      script.onerror = reject;
      script.onload = resolve;
      document.head.appendChild(script);
    })
  }
}

export default ProductInit
