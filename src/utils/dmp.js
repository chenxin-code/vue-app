import http from './http'
import store from "../vuex/store";

const eventCode = {
  json: {
    webType: '', // 0 网页端，1 app，2 公众号，3 小程序
    deviceType: '', // 1 ios， 2 android
    deviceId: '', //设备号
    openId: '', // openId，公众号和小程序访问都有
    userId: '',
    actions: [
      {
        t: '', // 行为类型
        tm: '', // 行为时间 时间戳 精确到秒
        ly: '', // 路由
        args: '', //参数
        skuId: '',//sku Id
        atvId: '', //activity Id
        mdlId: '', //配置页面，按钮Id
        pgId: '', //页面id
        pgCode: '', //页面code
        area: '', // 地区
      }
    ]
  },
  types: [
    {
      type: '100000',
      name: '路由行为'
    },
    {
      type: '110000',
      name: '登录行为',
      subs: [
        {
          type: '110010',
          name: '账号登录',
        },
        {
          type: '110020',
          name: '手机号验证码登录',
        },
        {
          type: '110030',
          name: '微信登录',
        },
        {
          type: '110040',
          name: '支付宝登录',
        },
        {
          type: '110050',
          name: '注册登录',
        },
        {
          type: '110060',
          name: '微信公众号登录',
        },
        {
          type: '110070',
          name: '微信小程序登录',
        }
      ]
    },
    {
      type: '120000',
      name: '商品详情'
    },
    {
      type: '130000',
      name: '商品列表',
      subs: [
        {
          type: '130010',
          name: '普通列表'
        },
        {
          type: '130020',
          name: '活动列表'
        },
        {
          type: '130030',
          name: '秒杀列表'
        }
      ]
    },
    {
      type: '140000',
      name: '配置页面按钮统计',
      subs: [
        {
          type: '140010',
          name: '首页'
        },
        {
          type: '140020',
          name: '二级页面'
        }
      ]
    },
    {
      type: '150000',
      name: '分享页面访问',
      subs: [
        {
          type: '150010',
          name: '商品'
        },
        {
          type: '150020',
          name: '商品列表'
        }
      ]
    },
    {
      type: '160000',
      name: '系统事件',
      subs: [
        {
          type: '160010',
          name: 'app启动'
        },
        {
          type: '160020',
          name: '回到前台'
        },
        {
          type: '160030',
          name: '退出'
        },
        {
          type: '160040',
          name: '退出'
        }
      ]
    },
  ],
  EV_APP_LOGIN: {
    code: 'EV_APP_LOGIN',
    name: 'APP登录'
  },
  EV_APP_START: {
    code: 'EV_APP_START',
    name: 'App启动'
  },
  EV_APP_BK_AWAKE: {
    code: 'EV_APP_BK_AWAKE',
    name: 'App后台唤醒'
  },
  EV_APP_CLICK: {
    code: 'EV_APP_CLICK',
    name: 'App点击'
  },
  EV_APP_SEARCH: {
    code: 'EV_APP_SEARCH',
    name: 'App检索'
  },
  EV_APP_BROWSER: {
    code: 'EV_APP_BROWSER',
    name: '浏览'
  },
  EV_APP_EXIT: {
    code: 'EV_APP_EXIT',
    name: '退出APP'
  },
  EV_APP_INSTALL: {
    code: 'EV_APP_INSTALL',
    name: 'App激活'
  },
  EV_APP_STAY: {
    code: 'EV_APP_STAY',
    name: 'APP视区停留'
  },
  EV_ORDER_CANCEL: {
    code: 'EV_ORDER_CANCEL',
    name: '取消订单'
  },
  EV_ORDER_SUBMIT: {
    code: 'EV_ORDER_SUBMIT',
    name: '提交订单'
  },
  EV_ORDER_PAY: {
    code: 'EV_ORDER_PAY',
    name: '支付订单'
  },
  EV_ORDER_PAY_DETAIL: {
    code: 'EV_ORDER_PAY_DETAIL',
    name: '支付订单详情'
  },
  EV_WARES_COLLECT: {
    code: 'EV_WARES_COLLECT',
    name: '商品收藏'
  },
  EV_MODEL_CLICK: {
    code: 'EV_MODEL_CLICK',
    name: '模块点击'
  },
  EV_SIGNUP: {
    code: 'EV_SIGNUP',
    name: '注册'
  },
  EV_WARES_DETAIL: {
    code: 'EV_WARES_DETAIL',
    name: '浏览商品详情'
  },
  EV_CLICK_BANNER: {
    code: 'EV_CLICK_BANNER',
    name: '点击Banner'
  },
  EV_COUPON_ACTIVATE: {
    code: 'EV_COUPON_ACTIVATE',
    name: '激活优惠券'
  },
  EV_RETURN_APPLY: {
    code: 'EV_RETURN_APPLY',
    name: '申请退货'
  },
  EV_LOGIN: {
    code: 'EV_LOGIN',
    name: '登录'
  },
  EV_SHORTURL_REDIRECT: {
    code: 'EV_SHORTURL_REDIRECT',
    name: '短连接跳转'
  },
  EV_CONTACT: {
    code: 'EV_CONTACT',
    name: '联系客服'
  },
  EV_APP_CHANNEL_MATCH: {
    code: 'EV_APP_CHANNEL_MATCH',
    name: '访问渠道追踪'
  },
  EV_WARES_COMMENT: {
    code: 'EV_WARES_COMMENT',
    name: '评价商品'
  },
  EV_INVITE: {
    code: 'EV_INVITE',
    name: '邀请好友'
  },
  EV_RECEIVE_COUPON: {
    code: 'EV_RECEIVE_COUPON',
    name: '领取优惠券'
  },
  EV_APP_WARES_SHARE: {
    code: 'EV_APP_WARES_SHARE',
    name: '分享商品'
  },
  EV_APP_ADDTO_CART: {
    code: 'EV_APP_ADDTO_CART',
    name: '加入购物车'
  }
}

let dmpData = {
  trackId: '',
  appCode: '',
  userCode: '',
  userName: '',
  IsWifi: '',
  isLoginId: '',
  isFirstDay: '',
  isFirstTime: '',
}

let dmp = {
  createTrackId: function () {
    var timestamp = Date.parse(new Date());
    return timestamp + '-' + 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  },
  getCurrentTimeFmt(fmt) {
    let now = new Date();
    let o = {
      "M+": now.getMonth() + 1, //月份
      "d+": now.getDate(), //日
      "h+": now.getHours(), //小时
      "m+": now.getMinutes(), //分
      "s+": now.getSeconds(), //秒
      "q+": Math.floor((now.getMonth() + 3) / 3), //季度
      "S": now.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt))
      fmt = fmt.replace(RegExp.$1, (now.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt))
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
  },
  getParams: function (evItem) {
    let params = {
      appCode: 'the_test_app',
      eventCode: evItem.code,
      eventName: evItem.name,
      pageUrl: window.location.href,
      actionDate: this.getCurrentTimeFmt('yyyy-MM-dd hh:mm:ss')
    }
    return params;
  },
  getElementAttr: function (elment) {
    let id = elment.getAttribute('id');
  },
  uploadTrack: function (eventKey) {
    let evItem = eventCode[eventKey];
    let url = '/app/json/dmp/sendDataToDmp';
    let params1 = this.getParams(evItem);
    let params2 = [params1];
    let token = store.state.login.token;
    let params3 = {
      token: token,
      rows: encodeURI(JSON.stringify(params2))
    }
    http.post(url, params3).then(
      res => {
        let data = res.data;
        console.log(data);
      },
      error => {
        console.log(error);
      }
    );
  }
}

export default dmp
