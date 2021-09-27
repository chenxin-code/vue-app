import http from "./http";
import utils from "./util";
import store from "../vuex/store";

let actionStatistics = {
  lyenums: [
    {
      "path": "/entrance",
      "redirect": "/common",
      "enum": 100010
    },
    {/**/
      "path": "/mall2test",
      "name": "商城测试",
      "enum": 100020
    },
    {
      "path": "/test",
      "name": "商城测试",
      "enum": 100030
    },
    {
      "path": "/mall2/categories",
      "name": "商品分类",
      "enum": 200000
    },
    {
      "path": "/mall2/list/",
      "name": "商品列表",
      "enum": 200010
    },
    {
      "path": "/mall2/collection",
      "name": "我的收藏",
      "enum": 200020
    },
    {
      "path": "/mall2/detail/",
      "name": "商品详情",
      "enum": 200030
    },
    {
      "path": "/mall2/ticketlist",
      "name": "日期型商品列表",
      "enum": 200040
    },
    {
      "path": "/mall2/ticketdetail",
      "name": "日期型商品详情",
      "enum": 200050
    },
    {
      "path": "/mall2/placeorder",
      "name": "填写订单",
      "enum": 200060
    },
    {
      "path": "/mall2/fillorder",
      "name": "立即下单",
      "enum": 200070
    },
    {
      "path": "/mall2/newlyperson",
      "name": "新增出行人",
      "enum": 200080
    },
    {
      "path": "/mall2/cart",
      "name": "购物车",
      "enum": 200090
    },
    {
      "path": "/mall2/orderlist",
      "name": "订单列表",
      "enum": 200100
    },
    {
      "path": "/mall2/orderdetail",
      "name": "订单详情",
      "enum": 200110
    },
    {
      "path": "/mall2/logistics",
      "name": "物流详情",
      "enum": 200120
    },
    {
      "path": "/mall2/choosesertype",
      "name": "选择售后类型",
      "enum": 200140
    },
    {
      "path": "/mall2/returninggoods",
      "name": "退货",
      "enum": 200150
    },
    {
      "path": "/mall2/services",
      "name": "售后服务",
      "enum": 200160
    },
    {
      "path": "/mall2/submitsuccess",
      "name": "提交成功",
      "enum": 200170
    },
    {
      "path": "/mall2/detailservice",
      "name": "查看详情",
      "enum": 200180
    },
    {
      "path": "/mall2/serviceindex",
      "name": "我的售后",
      "enum": 200190
    },
    {
      "path": "/mall2/comment",
      "name": "评价晒单",
      "enum": 200200
    },
    {
      "path": "/mall2/commentcenter",
      "name": "评价中心",
      "enum": 200210
    },
    {
      "path": "/mall2/commentdetail",
      "name": "评价详情",
      "enum": 200220
    },
    {
      "path": "/mall2/checkstand",
      "name": "收银台",
      "enum": 200230
    },
    {
      "path": "/mall2/paysuccess",
      "name": "订单支付结果",
      "enum": 200240
    },
    {
      "path": "/checkout",
      "name": " 收银台 ",
      "enum": 200250
    },
    {
      "path": "/mall2/couponlist",
      "name": "优惠券",
      "enum": 200260
    },
    {
      "path": "/mall2/seckilllist",
      "name": "秒杀商城",
      "enum": 200270
    },
    {
      "path": "/mall2/shop",
      "name": "店铺",
      "enum": 200280
    },
    {
      "path": "/mall2/browsinglist",
      "name": "浏览记录",
      "enum": 200290
    },
    {
      "path": "/mall2/purchase",
      "name": "采购列表",
      "enum": 200300
    },
    {
      "path": "/mall2/purchasedetail",
      "name": " 商品详情 ",
      "enum": 200310
    },
    {
      "path": "/mall2/purchaseplace",
      "name": " 填写订单 ",
      "enum": 200320
    },
    {
      "path": "/mall2/submitFinished",
      "name": " 提交完成 ",
      "enum": 200330
    },
    {
      "path": "/mall2/purchaseorderlist",
      "name": "大宗采购订单",
      "enum": 200340
    },
    {
      "path": "/mall2/purchaseorderdetail",
      "name": " 订单详情 ",
      "enum": 200350
    },
    {
      "path": "/mall2/scanbuyindex",
      "name": "扫码购物",
      "enum": 200360
    },
    {
      "path": "/mall2/scanbuyproduct",
      "name": "扫码购物商品",
      "enum": 200370
    },
    {
      "path": "/mall2/scanbuyplaceorder",
      "name": "购物袋",
      "enum": 200380
    },
    {
      "path": "/mall2/scanbuypaysuccess",
      "name": "支付成功",
      "enum": 200390
    },
    {
      "path": "/mall2/scanbuywxlist",
      "name": "购物袋",
      "enum": 200400
    },
    {
      "path": "/electronic-wallet",
      "name": "电子钱包",
      "enum": 200410
    },
    {
      "path": "/bill",
      "name": "账单",
      "enum": 200420
    },
    {
      "path": "/bill-details",
      "name": "账单明细",
      "enum": 200430
    },
    {
      "path": "/wallet-recharge",
      "name": "账单明细",
      "enum": 200440
    },
    {
      "path": "/pay-success",
      "name": "账单明细",
      "enum": 200450
    },
    {
      "path": "/refund-application",
      "name": "退款申请",
      "enum": 200460
    },
    {
      "path": "/application-history",
      "name": "申请历史",
      "enum": 200470
    },
    {
      "path": "/application-result",
      "name": "退款申请",
      "enum": 200480
    },
    {
      "path": "/problems",
      "name": "退款申请",
      "enum": 200490
    },
    {
      "path": "/coupon_market",
      "name": "券集市",
      "enum": 200500
    },
    {
      "path": "/coupon_list2",
      "name": "优惠券",
      "enum": 200510
    },
    {
      "path": "/mallOrder",
      "name": "商品订单",
      "meta": {
        "title": "商品订单",
        "keepAlive": false
      },
      "enum": 200520
    },
    {
      "path": "/cardOrder",
      "name": "加油卡订单",
      "meta": {
        "title": "加油卡订单",
        "keepAlive": false
      },
      "enum": 200530
    },
    {
      "path": "/mall2/mycoupon",
      "name": "我的优惠券",
      "enum": 400000
    },
    {
      "path": "/mall2/integralinfo",
      "name": "积分",
      "enum": 400010
    },
    {
      "path": "/mall2/win_record",
      "name": "中奖纪录",
      "enum": 400020
    },
    {
      "path": "/mall2/recommen_details",
      "name": "我推荐的人",
      "enum": 400030
    },
    {
      "path": "/mall2/integralstrategy",
      "name": "积分攻略",
      "enum": 400040
    },
    {
      "path": "/mall2/integralhistory",
      "name": "积分历程",
      "enum": 400050
    },
    {
      "path": "/mall2/addresslist",
      "name": "收货地址",
      "enum": 400060
    },
    {
      "path": "/mall2/addaddress",
      "name": "新建收货人",
      "enum": 400070
    },
    {
      "path": "/mall2/mypickupaddress",
      "name": "我的自提点",
      "enum": 400080
    },
    {
      "path": "/mall2/selfliftingsite",
      "name": "自提站点",
      "enum": 400090
    },
    {
      "path": "/usercenter/codeverify",
      "name": "短信验证",
      "enum": 400100
    },
    {
      "path": "/usercenter/motionlaunch",
      "name": "手势登录",
      "enum": 400110
    },
    {
      "path": "/usercenter/register",
      "name": "注册",
      "enum": 400120
    },
    {
      "path": "/usercenter/setgesture",
      "name": "设置手势密码",
      "enum": 400130
    },
    {
      "path": "/usercenter/login",
      "name": "登录",
      "enum": 400140
    },
    {
      "path": "/usercenter/justlogin",
      "name": "登录",
      "enum": 400150
    },
    {
      "path": "/usercenter/setting",
      "name": "设置",
      "enum": 400160
    },
    {
      "path": "/usercenter/aqgl",
      "name": "安全管理",
      "enum": 400170
    },
    {
      "path": "/usercenter/device",
      "name": "设备管理",
      "enum": 400180
    },
    {
      "path": "/usercenter/choseway",
      "name": "选择验证方式",
      "enum": 400190
    },
    {
      "path": "/usercenter/passwordlogin",
      "name": "登录密码验证",
      "enum": 400200
    },
    {
      "path": "/usercenter/codelogin",
      "name": "短信验证",
      "enum": 400210
    },
    {
      "path": "/usercenter/updatephone",
      "name": "修改手机号",
      "enum": 400220
    },
    {
      "path": "/usercenter/userinfo",
      "name": "会员资料",
      "enum": 400230
    },
    {
      "path": "/usercenter/updatehead",
      "name": "选择图像",
      "enum": 400240
    },
    {
      "path": "/usercenter/tygl",
      "name": "通用管理",
      "enum": 400250
    },
    {
      "path": "/usercenter/bindwechat",
      "name": "微信绑定",
      "enum": 400260
    },
    {
      "path": "/usercenter/bindalipay",
      "name": "支付宝绑定",
      "enum": 400270
    },
    {
      "path": "/usercenter/bindphone",
      "name": "绑定",
      "enum": 400280
    },
    {
      "path": "/usercenter/suggest",
      "name": "意见反馈",
      "enum": 400290
    },
    {
      "path": "/usercenter/suggestlist",
      "name": "历史反馈",
      "enum": 400300
    },
    {
      "path": "/usercenter/aboutus",
      "name": "关于我们",
      "enum": 400310
    },
    {
      "path": "/usercenter/setpassword",
      "name": "设置登录密码",
      "enum": 400320
    },
    {
      "path": "/usercenter/updatepassword",
      "name": "修改登录密码",
      "enum": 400330
    },
    {
      "path": "/usercenter/forgetpassword",
      "name": "忘记登录密码",
      "enum": 400340
    },
    {
      "path": "/usercenter/downloadshare",
      "name": "下载分享",
      "enum": 400350
    },
    {
      "path": "/usercenter/downloadsharenew",
      "name": "下载分享",
      "enum": 400360
    },
    {
      "path": "/usercenter/referralcode",
      "name": "我的推荐人",
      "enum": 400370
    },
    {
      "path": "/usercenter/minecode",
      "name": "我的推荐码",
      "enum": 400380
    },
    {
      "path": "/usercenter/myqrcode",
      "name": "我的会员码",
      "enum": 400390
    },
    {
      "path": "/usercenter/loginbinding",
      "name": "登录绑定",
      "enum": 400400
    },
    {
      "path": "/usercenter/loginbindingpw",
      "name": "注册绑定",
      "enum": 400410
    },
    {
      "path": "/usercenter/minehasrecommed",
      "name": "我推荐的人",
      "enum": 400420
    },
    {
      "path": "/usercenter/agreement",
      "name": "注册协议",
      "enum": 400430
    },
    {
      "path": "/usercenter/msgcenterlist",
      "name": "消息",
      "enum": 400440
    },
    {
      "path": "/usercenter/msglist",
      "name": "消息",
      "enum": 400450
    },
    {
      "path": "/usercenter/msgdetail",
      "name": "消息详情",
      "enum": 400460
    },
    {
      "path": "/usercenter/recommendcode",
      "name": "我的推荐码",
      "enum": 400470
    },
    {
      "path": "/usercenter/rebatebonus",
      "name": "石化钱包",
      "enum": 400480
    },
    {
      "path": "/usercenter/rebatebonuslist",
      "name": "石化钱包",
      "enum": 400490
    },
    {
      "path": "/usercenter/rebatebonusdetails",
      "name": "石化钱包",
      "enum": 400500
    },
    {
      "path": "/usercenter/pay-results",
      "name": "石化钱包",
      "enum": 400510
    },
    {
      "path": "/usercenter/oilbean",
      "name": "我的豌豆",
      "enum": 400520
    },
    {
      "path": "/usercenter/rule",
      "name": "规则说明",
      "enum": 400530
    },
    {
      "path": "/usercenter/payset",
      "name": "支付设置",
      "enum": 400540
    },
    {
      "path": "/usercenter/nosetpwd",
      "name": "设置支付密码",
      "enum": 400550
    },
    {
      "path": "/usercenter/forgetPwd",
      "name": "忘记支付密码",
      "enum": 400560
    },
    {
      "path": "/usercenter/densityfreeset",
      "name": "小额免密",
      "enum": 400570
    },
    {
      "path": "/usercenter/changefreenum",
      "name": "选择免密金额",
      "enum": 400580
    },
    {
      "path": "/usercenter/identityyz",
      "name": "身份验证",
      "enum": 400590
    },
    {
      "path": "/usercenter/successopenfree",
      "name": "身份验证",
      "enum": 400600
    },
    {
      "path": "/usercenter/myprize",
      "name": "我的奖品",
      "enum": 400610
    },
    {
      "path": "/usercenter/activitylist",
      "name": "活动列表",
      "enum": 400620
    },
    {
      "path": "/usercenter/activitydetails",
      "name": "活动详情",
      "enum": 400630
    },
    {
      "path": "/usercenter/thirdlogin",
      "name": "幸福石化企业号登录",
      "enum": 400640
    },
    {
      "path": "/usercenter/hx-qrcode",
      "name": "易捷会员码",
      "enum": 400650
    },
    {
      "path": "/usercenter/bills",
      "name": "月度账单",
      "enum": 400660
    },
    {
      "path": "/usercenter/billdetail",
      "name": "月度账单",
      "enum": 400670
    },
    {
      "path": "/usercenter/loginbindqrcode",
      "name": "推荐绑定",
      "enum": 400680
    },
    {
      "path": "/usercenter/preregistration",
      "name": "用户预注册",
      "enum": 400690
    },
    {
      "path": "/get_coupon",
      "name": "领券中心",
      "enum": 400700
    },
    {
      "path": "/get_coupon_detail",
      "name": "我的电子券",
      "enum": 400710
    },
    {
      "path": "/coupon_list",
      "name": "优惠券",
      "enum": 400720
    },
    {
      "path": "/coupon_detail",
      "name": "优惠券详情",
      "meta": {
        "keepAlive": false,
        "title": "我的优惠券"
      },
      "enum": 400730
    },
    {
      "path": "/coupon_detail2",
      "name": "优惠券详情",
      "meta": {
        "keepAlive": false,
        "title": "我的优惠券"
      },
      "enum": 400740
    },
    {
      "path": "/answer_starts",
      "name": "answer_starts",
      "enum": 600000
    },
    {
      "path": "/answer",
      "name": "每日答题",
      "enum": 600010
    },
    {
      "path": "/ticket_starts",
      "name": "ticket_starts",
      "enum": 600020
    },
    {
      "path": "/subject",
      "name": "问券调查",
      "enum": 600030
    },
    {
      "path": "/rule",
      "name": "规则说明",
      "enum": 600040
    },
    {
      "path": "/questionlist",
      "name": "问券列表",
      "enum": 600050
    },
    {
      "path": "/historylist",
      "name": "历史问券",
      "enum": 600060
    },
    {
      "path": "/questionDetail",
      "name": "问券调查",
      "enum": 600070
    },
    {
      "path": "/answerlist",
      "name": "问券列表",
      "enum": 600080
    },
    {
      "path": "/answerHistory",
      "name": "历史问券",
      "enum": 600090
    },
    {
      "path": "/answerDetail",
      "name": "每日答题",
      "enum": 600100
    },
    {
      "path": "/qq-recharge",
      "name": "QQ充值",
      "meta": {
        "title": "QQ充值",
        "keepAlive": false
      },
      "enum": 600110
    },
    {
      "path": "/phone-bill-recharge",
      "name": "话费充值",
      "meta": {
        "title": "话费充值",
        "keepAlive": false
      },
      "enum": 600120
    },
    {
      "path": "/recharge-bill",
      "name": "充值账单",
      "meta": {
        "title": "充值账单",
        "keepAlive": false
      },
      "enum": 600130
    },
    {
      "path": "/institutional-choice",
      "name": "机构选择",
      "meta": {
        "title": "机构选择",
        "keepAlive": false
      },
      "enum": 600140
    },
    {
      "path": "/flow-recharge",
      "name": "流量充值",
      "meta": {
        "title": "流量充值",
        "keepAlive": false
      },
      "enum": 600150
    },
    {
      "path": "/video-recharge",
      "name": "视频充值",
      "meta": {
        "title": "视频充值",
        "keepAlive": false
      },
      "enum": 600160
    },
    {
      "path": "/video-index",
      "name": "视频充值",
      "meta": {
        "title": "视频充值搜索",
        "keepAlive": false
      },
      "enum": 600170
    },
    {
      "path": "/play-recharge",
      "name": "游戏充值",
      "meta": {
        "title": "游戏充值",
        "keepAlive": false
      },
      "enum": 600180
    },
    {
      "path": "/life-pay",
      "name": "生活缴费",
      "meta": {
        "title": "生活缴费",
        "keepAlive": false
      },
      "enum": 600190
    },
    {
      "path": "/life-violation-pay",
      "name": "life-violation-pay",
      "meta": {
        "title": "收银台",
        "keepAlive": false
      },
      "enum": 600200
    },
    {
      "path": "/life-pay-success",
      "name": "life-pay-success",
      "meta": {
        "title": "支付成功",
        "keepAlive": false
      },
      "enum": 600210
    },
    {
      "path": "/new-recharge-account",
      "name": "新增缴费账户",
      "meta": {
        "title": "新增缴费账户",
        "keepAlive": false
      },
      "enum": 600220
    },
    {
      "path": "/edit-account",
      "name": "常用缴费",
      "meta": {
        "title": "常用缴费编辑页面",
        "keepAlive": false
      },
      "enum": 600230
    },
    {
      "path": "/nothing-paybill",
      "name": "无缴费账单",
      "meta": {
        "title": "无缴费账单",
        "keepAlive": false
      },
      "enum": 600240
    },
    {
      "path": "/address",
      "name": "地址选择",
      "meta": {
        "title": "地址选择",
        "keepAlive": false
      },
      "enum": 600250
    },
    {
      "path": "/recharge-bill-details",
      "name": "账单详情",
      "meta": {
        "title": "账单详情",
        "keepAlive": false
      },
      "enum": 600260
    },
    {
      "path": "/no-apply-card",
      "name": "no-apply-card",
      "meta": {
        "keepAlive": true,
        "title": "默认未申请卡"
      },
      "enum": 600270
    },
    {
      "path": "/applyed-card",
      "name": "applyed-card",
      "meta": {
        "keepAlive": false,
        "title": "办卡进度"
      },
      "enum": 600280
    },
    {
      "path": "/apply-card",
      "name": "apply-card",
      "meta": {
        "keepAlive": false,
        "title": "办卡申请"
      },
      "enum": 600290
    },
    {
      "path": "/apply-card-guide",
      "name": "apply-card-guide",
      "meta": {
        "keepAlive": false,
        "title": "办卡指南"
      },
      "enum": 600300
    },
    {
      "path": "/traffic-ticket-index",
      "name": "traffic-ticket-index",
      "meta": {
        "title": "违章缴费",
        "keepAlive": false
      },
      "enum": 600310
    },
    {
      "path": "/add-car-index",
      "name": "add-car-index",
      "meta": {
        "title": "添加车辆",
        "keepAlive": false
      },
      "enum": 600320
    },
    {
      "path": "/violation-query",
      "name": "violation-query",
      "meta": {
        "title": "违章查询",
        "keepAlive": false
      },
      "enum": 600330
    },
    {
      "path": "/violation-details",
      "name": "violation-details",
      "meta": {
        "title": "违章处理",
        "keepAlive": false
      },
      "enum": 600340
    },
    {
      "path": "/violation-ticket",
      "name": "violation-ticket",
      "meta": {
        "title": "罚单代缴",
        "keepAlive": false
      },
      "enum": 600350
    },
    {
      "path": "/violation-pay",
      "name": "violation-pay",
      "meta": {
        "title": "收银台",
        "keepAlive": false
      },
      "enum": 600360
    },
    {
      "path": "/pay-success",
      "name": "pay-success",
      "meta": {
        "title": "支付成功",
        "keepAlive": false
      },
      "enum": 600370
    },
    {
      "path": "/taiping-insurance",
      "name": "taiping-insurance",
      "meta": {
        "title": "车辆保险",
        "keepAlive": false
      },
      "enum": 600380
    },
    {
      "path": "/vehicle-insurance",
      "name": "vehicle-insurance",
      "meta": {
        "title": "车辆保险",
        "keepAlive": false
      },
      "enum": 600390
    },
    {
      "path": "/my-insurance-policy",
      "name": "my-insurance-policy",
      "meta": {
        "title": "我的保单",
        "keepAlive": false
      },
      "enum": 600400
    },
    {
      "path": "/insurance-policy-details",
      "name": "insurance-policy-details",
      "meta": {
        "title": "详情",
        "keepAlive": false
      },
      "enum": 600410
    },
    {
      "path": "/recharge/recharge-card",
      "name": "易捷卡",
      "meta": {
        "title": "充值卡",
        "keepAlive": true
      },
      "enum": 600420
    },
    {
      "path": "/recharge/card-details",
      "name": "充值卡详情",
      "meta": {
        "title": "充值卡详情",
        "keepAlive": true
      },
      "enum": 600430
    },
    {
      "path": "/recharge/recharge-result",
      "name": "充值卡-充值结果",
      "meta": {
        "title": "充值结果",
        "keepAlive": false
      },
      "enum": 600440
    },
    {
      "path": "/recharge/recharge-details",
      "name": "充值详情-充值卡",
      "meta": {
        "title": "充值详情",
        "keepAlive": false
      },
      "enum": 600450
    },
    {
      "path": "/recharge/transaction-details",
      "name": "交易明细",
      "meta": {
        "title": "交易明细",
        "keepAlive": false
      },
      "enum": 600460
    },
    {
      "path": "/recharge/recharge-count",
      "name": "计次卡",
      "meta": {
        "title": "计次卡",
        "keepAlive": false
      },
      "enum": 600470
    },
    {
      "path": "/recharge/count-card-details",
      "name": "计次卡详情",
      "meta": {
        "title": "计次卡详情",
        "keepAlive": false
      },
      "enum": 600480
    },
    {
      "path": "/recharge/count-details",
      "name": "充值详情-计次卡",
      "meta": {
        "title": "充值详情",
        "keepAlive": false
      },
      "enum": 600490
    },
    {
      "path": "/recharge/count-result",
      "name": "计次卡-充值结果",
      "meta": {
        "title": "充值结果",
        "keepAlive": false
      },
      "enum": 600500
    },
    {
      "path": "/recharge/my-card",
      "name": "我的卡包",
      "meta": {
        "title": "我的卡包",
        "keepAlive": false
      },
      "enum": 600510
    },
    {
      "path": "/assistantindex",
      "name": "发票助手",
      "meta": {
        "title": "发票助手",
        "keepAlive": false
      },
      "enum": 600520
    },
    {
      "path": "/assistantindex_detail",
      "name": "详情",
      "meta": {
        "title": "发票助手详情",
        "keepAlive": false
      },
      "enum": 600530
    },
    {
      "path": "/stay",
      "name": "stay",
      "enum": 600540
    },
    {
      "path": "/stayDetail",
      "name": "stayDetail",
      "enum": 600550
    },
    {
      "path": "/Invoiced",
      "name": "Invoiced",
      "enum": 600560
    },
    {
      "path": "/taitou",
      "name": "taitou",
      "meta": {
        "title": "编辑抬头",
        "keepAlive": false
      },
      "enum": 600570
    },
    {
      "path": "/taitouList",
      "name": "抬头列表",
      "meta": {
        "title": "查看抬头列表",
        "keepAlive": false
      },
      "enum": 600580
    },
    {
      "path": "/historyInvoice",
      "name": "历史发票",
      "meta": {
        "title": "历史发票",
        "keepAlive": false
      },
      "enum": 600590
    },
    {
      "path": "/historyDetail",
      "name": "历史发票",
      "meta": {
        "title": "历史发票详情",
        "keepAlive": true
      },
      "enum": 600600
    },
    {
      "path": "/modifyEmail",
      "name": "修改邮箱",
      "meta": {
        "title": "修改接收邮箱",
        "keepAlive": false
      },
      "enum": 600610
    },
    {
      "path": "/historyorderList",
      "name": "历史订单列表",
      "meta": {
        "title": "历史订单列表",
        "keepAlive": true
      },
      "enum": 600620
    },
    {
      "path": "/historyorderListDetail",
      "name": "历史订单列表详情",
      "meta": {
        "title": "历史订单列表详情",
        "keepAlive": false
      },
      "enum": 600630
    },
    {
      "path": "/orderList",
      "name": "订单列表",
      "meta": {
        "title": "订单列表",
        "keepAlive": true
      },
      "enum": 600640
    },
    {
      "path": "/orderListDetail",
      "name": "订单列表详情",
      "meta": {
        "title": "订单列表详情",
        "keepAlive": false
      },
      "enum": 600650
    },
    {
      "path": "/invoiceSelfIndex",
      "name": "自助开票",
      "meta": {
        "title": "自助开票",
        "keepAlive": false
      },
      "enum": 600660
    },
    {
      "path": "/appOrder",
      "name": "APP加油订单",
      "meta": {
        "title": "APP加油订单",
        "keepAlive": false
      },
      "enum": 600670
    },
    {
      "path": "/openinvoiceDetail",
      "name": "自助开票",
      "meta": {
        "title": "下一步订单自助开票",
        "keepAlive": true
      },
      "enum": 600680
    },
    {
      "path": "/openInvoice",
      "name": "已开发票列表",
      "enum": 600690
    },
    {
      "path": "/invoicing",
      "name": "invoicing",
      "meta": {
        "title": "扫码开票",
        "keepAlive": false
      },
      "enum": 600700
    },
    {
      "path": "/invalid",
      "name": "invalid",
      "meta": {
        "title": "扫码状态",
        "keepAlive": false
      },
      "enum": 600710
    },
    {
      "path": "/open-invoice",
      "name": "open-invoice",
      "enum": 600720
    },
    {
      "path": "/stationto",
      "name": "加油站导航",
      "enum": 600730
    },
    {
      "path": "/searchmore",
      "name": "搜索",
      "enum": 600740
    },
    {
      "path": "/oilstationlist",
      "name": "",
      "enum": 600750
    },
    {
      "path": "/oilstationdetail",
      "name": "油站详情",
      "enum": 600760
    },
    {
      "path": "/minemsgcenter",
      "name": "消息",
      "enum": 600770
    },
    {
      "path": "/minemsgcenterdetails",
      "name": "消息详情",
      "enum": 600780
    },
    {
      "path": "/refuelinfo",
      "name": "选择加油信息",
      "enum": 600790
    },
    {
      "path": "/refuelorder",
      "name": "支付订单",
      "enum": 600800
    },
    {
      "path": "/selectelticket",
      "name": "我的电子券",
      "enum": 600810
    },
    {
      "path": "/refuelorderdetail",
      "name": "支付结果",
      "enum": 600820
    },
    {
      "path": "/refuelstationlist",
      "name": "附近加油站",
      "enum": 600830
    },
    {
      "path": "/oilrecord",
      "name": "加油记录",
      "enum": 600840
    },
    {
      "path": "/oilrecorddetail",
      "name": "加油详情",
      "enum": 600850
    },
    {
      "path": "/refuelcardselect",
      "name": "加油订单支付",
      "enum": 600860
    },
    {
      "path": "/RefuelSelectOilGun",
      "name": "加油",
      "enum": 600870
    },
    {
      "path": "/cityselector/",
      "name": "选择地区",
      "enum": 600880
    },
    {
      "path": "/nearstation",
      "name": "选择油站",
      "enum": 600890
    },
    {
      "path": "/test",
      "name": "Test",
      "enum": 600900
    },
    {
      "path": "/common2/",
      "name": "二级页面",
      "enum": 600920
    },
    {
      "path": "/common",
      "name": "首页",
      "enum": 600910
    },
    {
      "path": "/latestprice",
      "name": "今日油价",
      "enum": 600930
    },
    {
      "path": "/logs",
      "name": "日志",
      "enum": 600940
    },
    {
      "path": "/imageadmove",
      "name": "应用排序",
      "enum": 600950
    },
    {
      "path": "/refuelingCard",
      "name": "加油卡绑定",
      "enum": 600960
    },
    {
      "path": "/addCard",
      "name": "选择加油卡",
      "enum": 600970
    },
    {
      "path": "/oilMoney",
      "name": "油币",
      "enum": 600980
    },
    {
      "path": "/explains",
      "name": "加油卡油币",
      "enum": 600990
    },
    {
      "path": "/chongquerys",
      "name": "充值查询",
      "enum": 601000
    },
    {
      "path": "/queryers",
      "name": "查询结果",
      "enum": 601010
    },
    {
      "path": "/recharge",
      "name": "加油卡充值",
      "enum": 601020
    },
    {
      "path": "/rechargeer",
      "name": "加油卡充值二",
      "enum": 601030
    },
    {
      "path": "/company-card",
      "name": "单位卡",
      "meta": {
        "title": "单位卡",
        "keepAlive": false
      },
      "enum": 601040
    },
    {
      "path": "/binding-company-card",
      "name": "单位油卡绑定",
      "meta": {
        "title": "单位油卡绑定",
        "keepAlive": false
      },
      "enum": 601050
    },
    {
      "path": "/binding-companyCard-record",
      "name": "绑卡申请记录",
      "meta": {
        "title": "绑卡申请记录",
        "keepAlive": true
      },
      "enum": 601060
    },
    {
      "path": "/bind-oil-card",
      "name": "加油卡绑定",
      "enum": 601070
    },
    {
      "path": "/rights-and-interests",
      "name": "权益",
      "enum": 601080
    },
    {
      "path": "/flashPayment",
      "name": "加油闪付",
      "enum": 601090
    },
    {
      "path": "/chooseBill",
      "name": "选择账单",
      "enum": 601100
    },
    {
      "path": "/firmOrder",
      "name": "加油支付凭证",
      "enum": 601110
    },
    {
      "path": "/firmDetail",
      "name": "加油支付凭证详情",
      "enum": 601120
    },
    {
      "path": "/firmHistoryDetail",
      "name": "加油支付凭证详情",
      "enum": 601130
    },
    {
      "path": "/payOrder",
      "name": "确认账单",
      "enum": 601140
    },
    {
      "path": "/oil-pay/order-list",
      "name": "订单",
      "enum": 601150
    },
    {
      "path": "/my_group",
      "name": "我的拼团",
      "meta": {
        "title": "我的拼团",
        "keepAlive": false
      },
      "enum": 601160
    },
    {
      "path": "/group_detail",
      "name": "拼团详情",
      "meta": {
        "title": "拼团详情",
        "keepAlive": false
      },
      "enum": 601170
    },
    {
      "path": "/grouplist",
      "name": "拼团",
      "meta": {
        "title": "拼团",
        "keepAlive": false
      },
      "enum": 601180
    },
    {
      "path": "/groupproduct",
      "name": " 商品详情 ",
      "meta": {
        "title": "商品详情",
        "keepAlive": false
      },
      "enum": 601190
    },
    {
      "path": "/groupplaceorder",
      "name": "团购下订单",
      "meta": {
        "title": "团购下订单",
        "keepAlive": true
      },
      "enum": 601200
    },
    {
      "path": "/buy-bill-list",
      "name": "buy-bill-list",
      "meta": {
        "title": "撞单列表",
        "keepAlive": false
      },
      "enum": 601210
    },
    {
      "path": "/buy-bill-details",
      "name": "buy-bill-details",
      "meta": {
        "title": "撞单详情",
        "keepAlive": false
      },
      "enum": 601220
    },
    {
      "path": "/buy-bill-results",
      "name": "buy-bill-results",
      "meta": {
        "title": "撞单结果",
        "keepAlive": false
      },
      "enum": 601230
    },
    {
      "path": "/buy-bill-record",
      "name": "buy-bill-record",
      "meta": {
        "title": "撞单记录",
        "keepAlive": false
      },
      "enum": 601240
    },
    {
      "path": "/buy-bill-success",
      "name": "buy-bill-success",
      "meta": {
        "title": "撞单成功",
        "keepAlive": false
      },
      "enum": 601250
    },
    {
      "path": "/grab-bill-list",
      "name": "grab-bill-list",
      "meta": {
        "title": "抢单列表",
        "keepAlive": false
      },
      "enum": 601260
    },
    {
      "path": "/grab-bill-details",
      "name": "grab-bill-details",
      "meta": {
        "title": "抢单详情",
        "keepAlive": false
      },
      "enum": 601270
    },
    {
      "path": "/grab-bill-results",
      "name": "grab-bill-results",
      "meta": {
        "title": "抢单结果",
        "keepAlive": false
      },
      "enum": 601280
    },
    {
      "path": "/grab-bill-record",
      "name": "grab-bill-record",
      "meta": {
        "title": "抢单记录",
        "keepAlive": false
      },
      "enum": 601290
    },
    {
      "path": "/grab-bill-success",
      "name": "grab-bill-record",
      "meta": {
        "title": "抢单成功失败",
        "keepAlive": false
      },
      "enum": 601300
    },
    {
      "path": "/appointment-bill-list",
      "name": "buy-bill-list",
      "meta": {
        "title": "约单列表",
        "keepAlive": false
      },
      "enum": 601310
    },
    {
      "path": "/appointment-bill-details",
      "name": "buy-bill-list",
      "meta": {
        "title": "约单详情",
        "keepAlive": false
      },
      "enum": 601320
    },
    {
      "path": "/appointment-bill-results",
      "name": "buy-bill-list",
      "meta": {
        "title": "约单详情",
        "keepAlive": false
      },
      "enum": 601330
    },
    {
      "path": "/appointment-bill-record",
      "name": "buy-bill-list",
      "meta": {
        "title": "约单记录",
        "keepAlive": false
      },
      "enum": 601340
    },
    {
      "path": "/appointment-bill-success",
      "name": "buy-bill-list",
      "meta": {
        "title": "待确定",
        "keepAlive": false
      },
      "enum": 601350
    },
    {
      "path": "/buy-oil-index",
      "name": "buy-oil-index",
      "meta": {
        "title": "首页",
        "keepAlive": true
      },
      "enum": 601360
    },
    {
      "path": "/users-bind",
      "name": "users-bind",
      "meta": {
        "title": "单位用户绑定",
        "keepAlive": false
      },
      "enum": 601370
    },
    {
      "path": "/batch-buy-oil",
      "name": "batch-buy-oil",
      "meta": {
        "title": "批量购油",
        "keepAlive": false
      },
      "enum": 601380
    },
    {
      "path": "/buy-oil-results",
      "name": "buy-oil-results",
      "meta": {
        "title": "订单提交",
        "keepAlive": false
      },
      "enum": 601390
    },
    {
      "path": "/buy-oil-order-list",
      "name": "buy-oil-order-list",
      "meta": {
        "title": "购油订单列表",
        "keepAlive": false
      },
      "enum": 601400
    },
    {
      "path": "/buy-oil-order-details",
      "name": "buy-oil-order-details",
      "meta": {
        "title": "购油订单详情",
        "keepAlive": false
      },
      "enum": 601410
    },
    {
      "path": "/bean-exchange-list",
      "name": "bean-exchange-list",
      "meta": {
        "title": "购油订单列表",
        "keepAlive": false
      },
      "enum": 601420
    },
    {
      "path": "/bean-exchange-details",
      "name": "bean-exchange-details",
      "meta": {
        "title": "购油订单详情",
        "keepAlive": false
      },
      "enum": 601430
    },
    {
      "path": "/coupon-list",
      "name": "coupon-list",
      "meta": {
        "title": "优惠券",
        "keepAlive": false
      },
      "enum": 601440
    },
    {
      "path": "/appointment-oil",
      "name": "appointment-oil",
      "meta": {
        "title": "预约提油",
        "keepAlive": false
      },
      "enum": 601450
    },
    {
      "path": "/appointment-oil-results",
      "name": "appointment-oil-results",
      "meta": {
        "title": "预约提油",
        "keepAlive": false
      },
      "enum": 601460
    },
    {
      "path": "/not-mention",
      "name": "not-mention",
      "meta": {
        "title": "已售未提",
        "keepAlive": false
      },
      "enum": 601470
    },
    {
      "path": "/have-mention",
      "name": "have-mention",
      "meta": {
        "title": "已售已提",
        "keepAlive": false
      },
      "enum": 601480
    },
    {
      "path": "/buy-oil-record",
      "name": "buy-oil-record",
      "meta": {
        "title": "购油记录",
        "keepAlive": false
      },
      "enum": 601490
    },
    {
      "path": "/mention-oil-record",
      "name": "mention-oil-record",
      "meta": {
        "title": "提油记录",
        "keepAlive": false
      },
      "enum": 601500
    },
    {
      "path": "/buy-oil-login",
      "name": "buy-oil-login",
      "meta": {
        "title": "直分销登录",
        "keepAlive": false
      },
      "enum": 601510
    },
    {
      "path": "/bill-information",
      "name": "bill-information",
      "meta": {
        "title": "账单信息",
        "keepAlive": false
      },
      "enum": 601520
    },
    {
      "path": "/bill-details",
      "name": "bill-details",
      "meta": {
        "title": "账单详情",
        "keepAlive": false
      },
      "enum": 601530
    },
    {
      "path": "/set-pwd",
      "name": "set-pwd",
      "meta": {
        "title": "密码设置",
        "keepAlive": false
      },
      "enum": 601540
    },
    {
      "path": "/return-goods",
      "name": "return-goods",
      "meta": {
        "title": "退货",
        "keepAlive": true
      },
      "enum": 601550
    },
    {
      "path": "/return-goods-details",
      "name": "return-goods-details",
      "meta": {
        "title": "详情",
        "keepAlive": false
      },
      "enum": 601560
    },
    {
      "path": "/micro_sho/add_merchandise",
      "name": "选货市场",
      "meta": {
        "title": "选货市场",
        "keepAlive": true
      },
      "enum": 601570
    },
    {
      "path": "/micro_sho/detail/",
      "name": "商品详情",
      "meta": {
        "title": "商品详情",
        "keepAlive": true
      },
      "enum": 601580
    },
    {
      "path": "/micro_sho/ticket_detail",
      "name": "商品详情",
      "meta": {
        "title": "商品详情",
        "keepAlive": true
      },
      "enum": 601590
    },
    {
      "path": "/micro_sho/shareDetail/",
      "name": "分享商品详情",
      "meta": {
        "title": "分享商品详情",
        "keepAlive": false
      },
      "enum": 601600
    },
    {
      "path": "/micro_sho/shareTicketDetail",
      "name": "分享商品详情",
      "meta": {
        "title": "分享商品详情",
        "keepAlive": false
      },
      "enum": 601610
    },
    {
      "path": "/micro_sho/commodity_management",
      "name": "商品管理",
      "meta": {
        "title": "商品管理",
        "keepAlive": false
      },
      "enum": 601620
    },
    {
      "path": "/micro_sho/order_management",
      "name": "订单管理",
      "meta": {
        "title": "订单管理",
        "keepAlive": false
      },
      "enum": 601630
    },
    {
      "path": "/micro_sho/openIndex",
      "name": "micro_sho/openIndex",
      "meta": {
        "title": "开通微店",
        "keepAlive": false
      },
      "enum": 601640
    },
    {
      "path": "/micro_sho/microshop_register",
      "name": "micro_sho/microshop_register",
      "meta": {
        "title": "",
        "keepAlive": false
      },
      "enum": 601650
    },
    {
      "path": "/micro_sho/myshopIndex",
      "name": "micro_sho/myshopIndex",
      "meta": {
        "title": "我的微店首页",
        "keepAlive": false
      },
      "enum": 601660
    },
    {
      "path": "/micro_sho/profit",
      "name": "micro_sho/profit",
      "meta": {
        "title": "微店收益",
        "keepAlive": false
      },
      "enum": 601670
    },
    {
      "path": "/micro_sho/profitlist",
      "name": "micro_sho/profitlist",
      "meta": {
        "title": "年度收益排名",
        "keepAlive": false
      },
      "enum": 601680
    },
    {
      "path": "/micro_sho/microshopqrcode",
      "name": "micro_sho/microshopqrcode",
      "meta": {
        "title": "我的微店",
        "keepAlive": false
      },
      "enum": 601690
    },
    {
      "path": "/micro_sho/renovation",
      "name": "micro_sho/renovation",
      "meta": {
        "title": "店铺装修",
        "keepAlive": false
      },
      "enum": 601700
    },
    {
      "path": "/micro_sho/modifyintroduction",
      "name": "micro_sho/modifyintroduction",
      "meta": {
        "title": "修改店铺简介",
        "keepAlive": false
      },
      "enum": 601710
    },
    {
      "path": "/micro_sho/modifyname",
      "name": "micro_sho/modifyname",
      "meta": {
        "title": "修改店铺名称",
        "keepAlive": false
      },
      "enum": 601720
    },
    {
      "path": "/micro_sho/preview",
      "name": "micro_sho/preview",
      "meta": {
        "title": "店铺预览",
        "keepAlive": false
      },
      "enum": 601730
    },
    {
      "path": "/micro_sho/shop_around",
      "name": "逛微店",
      "meta": {
        "title": "逛微店",
        "keepAlive": true
      },
      "enum": 601740
    },
    {
      "path": "/micro_sho/best_sellers_list",
      "name": "热推商品",
      "meta": {
        "title": "热推商品",
        "keepAlive": true
      },
      "enum": 601750
    },
    {
      "path": "/micro_sho/cart",
      "name": "购物车",
      "meta": {
        "title": "购物车",
        "keepAlive": false
      },
      "enum": 601760
    },
    {
      "path": "/micro_sho/microshop_list",
      "name": "员工微店",
      "meta": {
        "title": "员工微店",
        "keepAlive": false
      },
      "enum": 601770
    },
    {
      "path": "/group_ticket/home",
      "name": "开团抢神券",
      "meta": {
        "title": "开团抢神券",
        "keepAlive": false
      },
      "enum": 601780
    },
    {
      "path": "/group_ticket/rules",
      "name": "活动规则",
      "meta": {
        "title": "活动规则",
        "keepAlive": false
      },
      "enum": 601790
    },
    {
      "path": "/group_ticket/my_vouchers",
      "name": "我的拼团",
      "meta": {
        "title": "我的拼团",
        "keepAlive": false
      },
      "enum": 601800
    },
    {
      "path": "/group_ticket/group_detail/",
      "name": "详情",
      "meta": {
        "title": "详情",
        "keepAlive": false
      },
      "enum": 601810
    },
    {
      "path": "/group_ticket/recommend/list",
      "name": "券商品列表",
      "meta": {
        "title": "券商品列表",
        "keepAlive": false
      },
      "enum": 601820
    },
    {
      "path": "/vocational_certification/home",
      "name": "职业认证",
      "meta": {
        "title": "职业认证",
        "keepAlive": false
      },
      "enum": 601830
    },
    {
      "path": "/vocational_certification/authentication",
      "name": "职业认证",
      "meta": {
        "title": "职业认证",
        "keepAlive": false
      },
      "enum": 601840
    },
    {
      "path": "/vocational_certification/feedback",
      "name": "认证反馈",
      "meta": {
        "title": "认证反馈",
        "keepAlive": false
      },
      "enum": 601850
    },
    {
      "path": "/vocational_certification/group",
      "name": "职业认证",
      "meta": {
        "title": "职业认证",
        "keepAlive": false
      },
      "enum": 601860
    },
    {
      "path": "/member_distribution/profit",
      "name": "member_distribution/profit",
      "meta": {
        "title": "会员分销我的收益",
        "keepAlive": false
      },
      "enum": 601870
    },
    {
      "path": "/member_distribution/profitDetail",
      "name": "member_distribution/profitDetail",
      "meta": {
        "title": "会员分销我的收益明细",
        "keepAlive": false
      },
      "enum": 601880
    },
    {
      "path": "/my-ebay",
      "name": "我的易贝",
      "meta": {
        "title": "我的易贝",
        "keepAlive": false
      },
      "enum": 601890
    },
    {
      "path": "/my-oil-bay",
      "name": "我的油贝",
      "meta": {
        "title": "我的油贝",
        "keepAlive": false
      },
      "enum": 601900
    },
    {
      "path": "/help-instructions",
      "name": "帮助说明",
      "meta": {
        "title": "帮助说明",
        "keepAlive": false
      },
      "enum": 601910
    },
    {
      "path": "/user_center/activitiesList",
      "name": "user_center/activitiesList",
      "meta": {
        "title": "营销活动列表",
        "keepAlive": false
      },
      "enum": 601920
    },
    {
      "path": "/user_center/activities_history",
      "name": "user_center/activities_history",
      "meta": {
        "title": "营销历史活动列表",
        "keepAlive": false
      },
      "enum": 601930
    },
    {
      "path": "/user_center/activities_detail",
      "name": "user_center/activities_detail",
      "meta": {
        "title": "营销活动详情",
        "keepAlive": true
      },
      "enum": 601940
    },
    {
      "path": "/user_center/activities_record",
      "name": "user_center/activities_record",
      "meta": {
        "title": "营销参与记录",
        "keepAlive": false
      },
      "enum": 601950
    },
    {
      "path": "/wxmp/mnp-qrcode",
      "name": "我的会员码",
      "meta": {
        "title": "我的会员码",
        "keepAlive": false
      },
      "enum": 601960
    },
    {
      "path": "/wxmp/emp-qrcode",
      "name": "员工推荐码",
      "meta": {
        "title": "员工推荐码",
        "keepAlive": false
      },
      "enum": 601970
    },
    {
      "path": "/user_center/salary",
      "name": "员工薪酬",
      "meta": {
        "title": "员工薪酬",
        "keepAlive": false
      },
      "enum": 601980
    },
    {
      "path": "/jane/index",
      "name": "jane/index",
      "meta": {
        "title": "极简支付首页",
        "keepAlive": false
      },
      "enum": 601990
    },
    {
      "path": "/jane/signing",
      "name": "jane/signing",
      "meta": {
        "title": "签约",
        "keepAlive": false
      },
      "enum": 602000
    },
    {
      "path": "/jane/label_management",
      "name": "jane/label_management",
      "meta": {
        "title": "标签管理",
        "keepAlive": false
      },
      "enum": 602010
    },
    {
      "path": "/jane/labelDetail",
      "name": "jane/labelDetail",
      "meta": {
        "title": "标签管理详情",
        "keepAlive": false
      },
      "enum": 602020
    },
    {
      "path": "/jane/record_query",
      "name": "jane/record_query",
      "meta": {
        "title": "记录查询",
        "keepAlive": false
      },
      "enum": 602030
    },
    {
      "path": "/jane/contractDetail",
      "name": "jane/contractDetail",
      "meta": {
        "title": "记录查询",
        "keepAlive": false
      },
      "enum": 602040
    },
    {
      "path": "/jane/vouchersDetail",
      "name": "jane/vouchersDetail",
      "meta": {
        "title": "加油支付凭证详情",
        "keepAlive": false
      },
      "enum": 602050
    },
    {
      "path": "/jane/payList",
      "name": "jane/payList",
      "meta": {
        "title": "更多加油记录",
        "keepAlive": false
      },
      "enum": 602060
    },
    {
      "path": "/jane/complete",
      "name": "jane/complete",
      "meta": {
        "title": "签约成功",
        "keepAlive": false
      },
      "enum": 602070
    },
    {
      "path": "/jane/janeView",
      "name": "签约",
      "meta": {
        "title": "签约",
        "keepAlive": false
      },
      "enum": 602080
    },
    {
      "path": "/certification",
      "name": "certification",
      "meta": {
        "title": "认证",
        "keepAlive": false
      },
      "enum": 602090
    },
    {
      "path": "/audit-results",
      "name": "audit-results",
      "meta": {
        "title": "审核结果",
        "keepAlive": false
      },
      "enum": 602100
    },
    {
      "path": "/real-name-authentication",
      "name": "real-name-authentication",
      "meta": {
        "title": "实名认证",
        "keepAlive": false
      },
      "enum": 602110
    },
    {
      "path": "/driving-certification",
      "name": "driving-certification",
      "meta": {
        "title": "驾驶认证",
        "keepAlive": false
      },
      "enum": 602120
    },
    {
      "path": "/vehicle-certification",
      "name": "vehicle-certification",
      "meta": {
        "title": "车辆认证",
        "keepAlive": false
      },
      "enum": 602130
    },
    {
      "path": "/bind-car",
      "name": "bind-car",
      "meta": {
        "title": "添加车辆",
        "keepAlive": false
      },
      "enum": 602140
    },
    {
      "path": "/vehicle-authentication",
      "name": "vehicle-authentication",
      "meta": {
        "title": "行驶认证",
        "keepAlive": false
      },
      "enum": 602150
    },
    {
      "path": "/share-gift/share",
      "name": "分享有礼",
      "meta": {
        "title": "分享有礼",
        "keepAlive": false
      },
      "enum": 602160
    },
    {
      "path": "/share-gift/share-list",
      "name": "分享有礼",
      "meta": {
        "title": "分享有礼",
        "keepAlive": false
      },
      "enum": 602170
    },
    {
      "path": "/mall2/headlines",
      "name": "小石头条",
      "enum": 602180
    },
    {
      "path": "/mall2/headlinesdetails",
      "name": "详情",
      "enum": 602190
    },
    {
      "path": "/mall2/membershipinterests",
      "name": "会员权益",
      "enum": 602200
    },
    {
      "path": "/mall2/ranking_list",
      "name": "排行榜",
      "enum": 602210
    }
  ],
  actionenums: [
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
        },
        {
          type: '140030',
          name: '首页底部导航事件'
        },
        {
          type: '140040',
          name: '二级页面底部导航事件'
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
          name: 'app跳失'
        }
      ]
    },
    {
      type: '170000',
      name: '游戏链接访问',
      subs: []
    },
    {
      type: '180000',
      name: '跳失事件',
      subs: []
    },
  ],
  // statistics: [
  //   {
  //     "name": '接口访问次数',
  //     "enum": 3000
  //   },
  //   {
  //     "name": '接口访问成功次数',
  //     "enum": 3010
  //   },
  //   {
  //     "name": '接口访问失败次数',
  //     "enum": 3020
  //   }
  // ],
  // actionData: {
  //   webType: '', // 0 网页端，1 app，2 公众号，3 小程序
  //   deviceType: '', // 1 ios， 2 android
  //   deviceId: '', //设备号
  //   openId: '', // openId，公众号和小程序访问都有
  //   userId: '',
  //   actions: [
  //     {
  //       t: '', // 行为类型
  //       tm: '', // 行为时间 时间戳 精确到秒
  //       ly: '', // 路由
  //       args: '', //参数
  //       skuId: '',//sku Id
  //       atvId: '', //activity Id
  //       mdlId: '', //配置页面，按钮Id
  //       pgId: '', //页面id
  //       pgCode: '', //页面code
  //       area: '', // 地区
  //     }
  //   ]
  // },
  storedActions: [],
  storedTime: 0,
  storePush: function (d) {
    if (this.storedActions.length == 0) {
      if (sessionStorage.getItem('KEY_Stored_Actions')) {
        this.storedActions = JSON.parse(sessionStorage.getItem('KEY_Stored_Actions'))
      }
    }
    this.storedActions.push(d)
    sessionStorage.setItem('KEY_Stored_Actions', JSON.stringify(this.storedActions))
    if (this.storedTime == 0) {
      this.storedTime = (new Date()).getTime() / 1000
    } else if ((new Date()).getTime() / 1000 > this.storedTime + 60 * 2) {
      this.storedTime = 0
      this.uploadAction()
    } else {

    }
  },
  routeAction: function (t, toPath, args, pgcode='') {
    if (this.appTSTimer) {
      clearTimeout(this.appTSTimer)
    }
    let toLyEnum = null
    // console.log(toPath)
    for (let i = 0; i < this.lyenums.length; i++) {
      let lyenum = this.lyenums[i]
      if (toPath.indexOf(lyenum.path) == 0) {
        toLyEnum = lyenum
        break;
      }
    }
    if (toLyEnum) {
      this.commonAction(t, toLyEnum.enum, JSON.stringify(args), '', '', '', pgcode, pgcode, '')
    }
  },
  gameAction: function (t, args) {
    this.commonAction(t, '', args, '', '', '', '', '', '')
  },
  listAction: function (t, args, atvId) {
    this.commonAction(t, '', args, '', atvId, '', '', '', '')
  },
  detailAction: function (t, args, skuId) {
    this.commonAction(t, '', args, skuId, '', '', '', '', '')
  },
  loginAction: function (t, args, area) {
    this.commonAction(t, '', args, '', '', '', '', '', area)
  },
  appTSTimer: null,
  systemAction: function (t) {
    // debugger
    if (t == '160010') {
      if (this.appTSTimer) {
        clearTimeout(this.appTSTimer)
      }
      this.appTSTimer = setTimeout(() => {
        // debugger
        this.commonAction('160040', '', '', '', '', '', '', '', '')
      }, 10 * 1000)
    }
    this.commonAction(t, '', '', '', '', '', '', '', '')
  },
  commonAction: function (t, ly = '', args = '', skuId = '', atvId = '', mdlId = '', pgId = '', pgCode = '', area = '') {
    let d = {
      t: t, // 行为类型
      tm: parseInt((new Date()).getTime() / 1000), // 行为时间 时间戳 精确到秒
      ly: ly, // 路由
      args: args, //参数
      skuId: skuId,//sku Id
      atvId: atvId, //activity Id
      mdlId: mdlId, //配置页面，按钮Id
      pgId: pgId, //页面id
      pgCode: pgCode, //页面code
      area: area, // 地区
    }
    this.storePush(d)
  },
  saveAction: function () {

  },
  uploadAction: function () {
    let num = this.storedActions.length
    http.post('/app/json/app_data_stats/incrData', {
      webType: store.state.webtype,
      deviceType: utils.isIos() ? '1' : '2',
      deviceId: store.state.commonArgs.data.deviceId,
      openId: store.state.login.wxOpenid,
      actions: this.storedActions
    }).then(
      res => {
        let data = res.data;
        if (data.status == 0) {
          // 裁剪掉上传的部分。
          this.storedActions = this.storedActions.slice(num)
          sessionStorage.setItem('KEY_Stored_Actions', JSON.stringify(this.storedActions))
        }
      }, error => {
        console.log(error);
      }
    )
  }
}

export default actionStatistics;
