// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Es6Promise from 'es6-promise'
require('es6-promise').polyfill()
Es6Promise.polyfill()
import Vue from 'vue'
import i18n from './locale'
//vuex
import store from './vuex/store'
import Vconsole from 'vconsole'
if (store.state.environment != 'production') {
  let vConsole = new Vconsole()
  Vue.use(vConsole)
}
console.log('store.state.environment',store.state.environment)



var sensors = require('sa-sdk-javascript'); 
sensors.init({
  server_url: 'https://datasink-ss-prod-linli.timesgroup.cn:9106/sa?project=llb_uat',
  is_track_single_page:true, // 单页面配置，默认开启，若页面中有锚点设计，需要将该配置删除，否则触发锚点会多触发 $pageview 事件
  use_client_time:true,
  send_type:'beacon',
  heatmap: {
     //是否开启点击图，default 表示开启，自动采集 $WebClick 事件，可以设置 'not_collect' 表示关闭。
     clickmap:'not_collect',
     //是否开启触达注意力图，not_collect 表示关闭，不会自动采集 $WebStay 事件，可以设置 'default' 表示开启。
     scroll_notice_map:'not_collect',
     get_vtrack_config:false,
  },
  app_js_bridge:true,
});

// sensors.quick('autoTrack'); //用于采集 $pageview 事件

Vue.prototype.$sensors = sensors



//路由
import router from './router'
console.log('----router---', router)
console.log('%c**** 12.14 v1.0 ****', 'color:#f0f');

// import Eruda from 'eruda'
// eruda.init()

//工具方法
import util from './utils/util'
Vue.prototype.$util = util

//工具方法
import config from './api/config'
Vue.prototype.$config = config

// 商城相关
import mallCommon from './utils/mall2'
Vue.prototype.$mallCommon = mallCommon

// 行为统计相关
import actionStatistics from './utils/actionStatistics'
Vue.prototype.$actionStatistics = actionStatistics

// user center 相关 js
import userCenter from './components/usercenter/js/userCenter'
Vue.prototype.$userCenter = userCenter

// keepalive 帮助
import keepaliveHelper from './utils/keepaliveHelper'
Vue.prototype.$keepaliveHelper = keepaliveHelper

//饿了么框架
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
Vue.use(MintUI)

// vant框架
import './config/vant-expand'

//自定义界面操作
import market from './utils/market'
Vue.prototype.$market = market

//和原生交互工具
import bridgefunc from './utils/bridgefunc'
Vue.prototype.$bridgefunc = bridgefunc

//等待框
import Loading from './components/Vendor/Loading/index'
Vue.prototype.$Loading = Loading
Vue.prototype.$STLoading = Loading

//http请求
import http from './utils/http'
Vue.prototype.$http = http

//http请求二次封装
import request from './utils/request'
Vue.prototype.$request = request

//alert 弹出框
import MessageBox from './components/Vendor/messagebox/index';
Vue.prototype.$MessageBox = MessageBox

//Toast提示
import Toast from './components/Vendor/toast/index'
Vue.prototype.$Toast = Toast

// 引入nav-top
import navtop from './components/commonui/nav-top/index'
Vue.use(navtop)

// 引入nav-content
import navcontent from './components/commonui/nav-content/index'
Vue.use(navcontent)

// 引入pop-view
import popview from './components/commonui/pop-view/index'
Vue.use(popview)


//引入moment
import moment from 'moment' //导入文件
Vue.prototype.$moment = moment; //赋值使用
moment.locale('zh-cn'); //需要汉化

//通用css
import './common/stylus/index.styl'

// 字体图标
import './common/font/iconfont.css'


//swipercss
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'vue-awesome-swiper/node_modules/swiper/dist/css/swiper.css'
Vue.use(VueAwesomeSwiper)

import 'lib-flexible/flexible'

import assign from 'lodash.assign'
Vue.prototype.$assign = assign
Vue.config.productionTip = false

// todo 页面多个地方需要定制化跳转，涉及到弹框，目前没有好的方式，后期有更好的方式再修改
import project from '../build/env'
window.PROJECT = project
import App from './App'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  i18n,
  router,
  store,
  render: h => h(App)
})