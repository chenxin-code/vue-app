// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import "babel-polyfill";
import Es6Promise from "es6-promise";
require("es6-promise").polyfill();
Es6Promise.polyfill();
import Vue from "vue";
import i18n from "./locale";
//vuex
import store from "./vuex/store";
import Vconsole from "vconsole";

const { NODE_ENV } = process.env;
if (NODE_ENV !== "production") {
  let vConsole = new Vconsole();
  Vue.use(vConsole);
}

//路由
import router from "./router";
console.log("----router---", router);

// import Eruda from 'eruda'
// eruda.init()

//工具方法
import util from "./utils/util";
Vue.prototype.$util = util;

//工具方法
import config from "./api/config";
Vue.prototype.$config = config;

// 商城相关
import mallCommon from "./utils/mall2";
Vue.prototype.$mallCommon = mallCommon;

// 行为统计相关
import actionStatistics from "./utils/actionStatistics";
Vue.prototype.$actionStatistics = actionStatistics;

// user center 相关 js
import userCenter from "./components/usercenter/js/userCenter";
Vue.prototype.$userCenter = userCenter;

// keepalive 帮助
import keepaliveHelper from "./utils/keepaliveHelper";
Vue.prototype.$keepaliveHelper = keepaliveHelper;

//饿了么框架
import MintUI from "mint-ui";
import "mint-ui/lib/style.css";
Vue.use(MintUI);

// vant框架
import "./config/vant-expand";

//自定义界面操作
import market from "./utils/market";
Vue.prototype.$market = market;

//和原生交互工具
import bridgefunc from "./utils/bridgefunc";
Vue.prototype.$bridgefunc = bridgefunc;

//等待框
import Loading from "./components/Vendor/Loading/index";
Vue.prototype.$Loading = Loading;
Vue.prototype.$STLoading = Loading;

//http请求
import http from "./utils/http";
Vue.prototype.$http = http;

//http请求二次封装
import request from "./utils/request";
Vue.prototype.$request = request;

//alert 弹出框
import MessageBox from "./components/Vendor/messagebox/index";
Vue.prototype.$MessageBox = MessageBox;

//Toast提示
import Toast from "./components/Vendor/toast/index";
Vue.prototype.$Toast = Toast;

// 引入nav-top
import navtop from "./components/commonui/nav-top/index";
Vue.use(navtop);

// 引入nav-content
import navcontent from "./components/commonui/nav-content/index";
Vue.use(navcontent);

// 引入pop-view
import popview from "./components/commonui/pop-view/index";
Vue.use(popview);

//引入moment
import moment from "moment"; //导入文件
Vue.prototype.$moment = moment; //赋值使用
moment.locale("zh-cn"); //需要汉化

//通用css
import "./common/stylus/index.styl";

// 字体图标
import "./common/font/iconfont.css";

//swipercss
import VueAwesomeSwiper from "vue-awesome-swiper";
import "vue-awesome-swiper/node_modules/swiper/dist/css/swiper.css";
Vue.use(VueAwesomeSwiper);

import "lib-flexible/flexible";

import assign from "lodash.assign";
Vue.prototype.$assign = assign;
Vue.config.productionTip = false;


function wxenvironment() {
  let ua = window.navigator.userAgent.toLowerCase();
  return ua.match(/MicroMessenger/i) == "micromessenger";
}

Vue.prototype.$isWX = wxenvironment()

// todo 页面多个地方需要定制化跳转，涉及到弹框，目前没有好的方式，后期有更好的方式再修改
import project from "../build/env";
window.PROJECT = project;
import App from "./App";

/* eslint-disable no-new */
new Vue({
  el: "#app",
  i18n,
  router,
  store,
  render: h => h(App)
});
