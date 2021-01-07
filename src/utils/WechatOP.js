/**
 * Created by steven on 2019/1/9.
 */
// import Vue from 'vue'
import Loading from '@/components/Vendor/Loading/index'
import Toast from '@/components/Vendor/toast/index'
import Config from '@/api/config'
import http from '@/utils/http'
import util from '@/utils/util'
import store from "../vuex/store";
import userCenter from '@/components/usercenter/js/userCenter'
import bridgefunc from "./bridgefunc";

let WechatOP = {

  deleteRedirectParas: function () {
    let href = window.location.href;
    // var codereg = new RegExp("(^|&)" + 'code' + "=([^&]*)(&|$)");
    var codereg = new RegExp("(^|&)" + 'code' + "=([^&]*)");
    var coder = window.location.search.substr(1).match(codereg);
    if (coder != null) {
      href = href.replace(coder[0], "");
    }

    var statereg = new RegExp("(^|&)" + 'state' + "=([^&]*)");
    var stater = window.location.search.substr(1).match(statereg);
    if (stater != null) {
      href = href.replace(stater[0], "");
    }
    var stateObj = {foo: "url"};
    window.history.replaceState(stateObj, "newpage", href);

  },
  getCodeUrl: function (callback) {
    Loading.open();
    let url = '/app/json/we_chat/getCodeUrl';
    let params1 = {
      redirectUrl: window.location.href
    };
    http.post(url, params1).then(res => {
      Loading.close();
      let data = res.data;
      if (data.status == 0) {
        let url = data.data;
        if (url.endsWith('#wechat_redirect') && !url.includes('connect_redirect')) {
          url = url.replace('#wechat_redirect', '&connect_redirect=1#wechat_redirect')
        }
        window.location.replace(url);
      } else {
        Toast(data.info)
      }
    }, error => {
      Loading.close();
      console.log('获取失败', error);
      Toast('获取数据失败')
    });
  },
  autoLogin: function (code, callback) {
    Loading.open();
    let url = '/app/json/we_chat/autoLogin';
    let params1 = {
      code: code
    };
    http.post(url, params1).then(res => {
      Loading.close();
      let data = res.data;
      if (data.status == 0) {
        userCenter.saveLoginData(data.data, true);
        callback();
      } else {
        store.state.login.token = '';
        if (data.errorCode == 1034) {//去绑定或者快速注册
          store.state.login.thirdUserId = data.info;
          callback();
        } else {
          Toast(data.info ? data.info : '微信授权登录失败');
        }
      }
    }, error => {
      Loading.close();
      store.state.login.token = '';
      console.log('获取失败', error);
    });
  },

  goWechat: function (callback) {
    store.state.barHeight = 0;
    if (store.state.login.token) {
      callback && callback()
    } else {
      let code = util.getUrlParam(window.location.href,'code');
      //如果有code 肯定重定向来的
      console.log('goWechat function', window.location.href);
      if (code) {
        store.state.login.code = code;
        //然后路径上把code删掉
        WechatOP.deleteRedirectParas();
        WechatOP.autoLogin(code, () => {
          callback && callback()
        });
      } else {
        bridgefunc.vuexStorage(() => {
          WechatOP.getCodeUrl()
        })
      }
    }
  }

};

export default WechatOP
