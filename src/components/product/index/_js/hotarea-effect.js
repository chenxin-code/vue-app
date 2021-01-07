/**
 * @description 热力数据与组件关联表
 * @author LiuYong <tel:15045009738>
 * @key xxx 模块的code值
 *  @key mName String 模块全名
 *  @key name String/Object rows中按钮名/带type情况
 *  @key btnEffect Array 按钮对照列表
 *    @key cKey String 按钮索引
 *    @key name String 按钮名
 */

export default {
  /* 独立组件 */
  'Header':{
    mName:'上导航(唯一)',
    btnEffect:[
      {cKey:'selectArea',name:'selectArea'},
      {cKey:'clickSearch',name:'clickSearch'},
      {cKey:'loginOut',name:'loginOut',imgUrl:'static/images/header/login-out.png'},
      {cKey:'showMore',name:'showMore',imgUrl:'static/images/header/more.png'},
      {cKey:'selectStation',name:'selectStation'},
      {cKey:'backNav',name:'backNav'},
      {cKey:'showMsg',name:'showMsg'},
      {cKey:'showScan',name:'showScan'},
      {cKey:'showShare',name:'showShare'},
      {cKey:'showQrcode',name:'showQrcode'},
      {cKey:'showService',name:'showService'},
      {cKey:'backNav',name:'backNav'},
    ],
  },
  /* 基础组件 */
  // 图片广告/导航
  'ImageAd':{
    mName:'图片广告/导航',
    name:{
      'lbt':'轮播图',
      'gndh':'功能导航',
      'yhyg':'一行一个',
      'lbdh':'列表导航',
    },
  },
  // 魔方
  'Rubik':{
    mName:'魔方',
    name:'魔方',
  },
  // 辅助组件
  'Auxiliary':{
    mName:'辅助组件',
  },
  // 我的
  'MyCenter':{
    mName:'我的',
    btnEffect:[
      {cKey:'changeHeaderImg',name:'changeHeaderImg'},
      {cKey:'interestsEvent',name:'interestsEvent'},
      {cKey:'paidMemberInterestsEvent',name:'paidMemberInterestsEvent'},
      {cKey:'toScan',name:'toScan'},
      {cKey:'toRules',name:'toRules'},
    ],
  },
  // 我的订单
  'MyOrder':{
    mName:'我的订单',
    btnEffect:[
      {cKey:'allOrderEvent',name:'allOrderEvent'},
      {cKey:'interestsEvent',name:'interestsEvent'},
    ],
  },
  // 今日油价
  'FuelPrices':{
    mName:'今日油价',
    btnEffect:[
      {cKey:'toFuelPricesPage',name:'toFuelPricesPage'},
    ],
  },
  // 我的资产
  'MyAssets':{
    mName:'我的资产',
  },
  // 秒杀活动
  'SecondsKill':{
    mName:'秒杀活动',
    btnEffect:[
      {cKey:'allSecondsKill',name:'allSecondsKill'},
    ],
  },
  // 附近自提点
  'PickupAddress':{
    mName:'附近自提点',
    btnEffect:[
      {cKey:'allShops',name:'allShops'},
      {cKey:'allStation',name:'allStation'},
    ],
  },
  // 我的积分
  'MyPoints':{
    mName:'我的积分',
    btnEffect:[
      {cKey:'mx',name:'mx'},
    ],
  },
  // 横滑组件
  'HScroll':{
    mName:'横滑组件',
    name:'横滑'
  },
  // 资讯组件
  'News':{
    mName:'资讯组件',
    btnEffect:[
      {cKey:'toNews',name:'新闻实事'},
    ],
  },
  // 流动封面
  'CoverFlow':{
    mName:'流动封面',
    name:'流动封面'
  },
  // 会员卡
  'MemberCard':{
    mName:'会员卡',
    btnEffect:[
      {cKey:'bindCard',name:'bindCard'},
      {cKey:'interestsEvent',name:'interestsEvent'},
      {cKey:'youbi',name:'youbi'},
      {cKey:'ponitdetail',name:'ponitdetail'},
    ],
  },
  // 电子券提醒
  'CouponsTag':{
    mName:'电子券提醒',
    btnEffect:[
      {cKey:'',name:'CouponsTag'},
    ],
  },
  // 会员级别
  'MemberLevels':{
    mName:'会员级别',
    btnEffect:[
      {cKey:'',name:'MemberLevels'},
    ],
  },
  // Tabs
  'TabsBlock':{
    mName:'Tabs',
    btnEffect:[
      {cKey:'',name:'TabsBlock'},
    ],
  },
  // 海油顶部组件
  'HYTop':{
    mName:'海油顶部组件',
    btnEffect:[
      {cKey:'benefitsClick_1',name:'benefitsClick_1'},
      {cKey:'goStar',name:'goStar'},
      {cKey:'toCode',name:'toCode'},
      {cKey:'benefitsClick_2',name:'benefitsClick_2'},
    ],
  },
  // 海油油站
  'HYStation':{
    mName:'海油油站',
    btnEffect:[
      {cKey:'',name:'HYStation'},
    ],
  },
  // 海油资讯
  'HYNews':{
    mName:'海油资讯',
    btnEffect:[
      {cKey:'moreNews',name:'moreNews'},
    ],
  },
  // 微店信息
  'WDInfo':{
    mName:'微店信息',
    btnEffect:[
      {cKey:'collection',name:'collection'},
      {cKey:'moreMicorShop',name:'moreMicorShop'},
    ],
  },
  // e生活顶部
  'ESHTop':{
    mName:'e生活顶部',
    btnEffect:[
      {cKey:'',name:'ESHTop'},
    ],
  },
  // e生活油站
  'ESHNearStation':{
    mName:'e生活油站',
    btnEffect:[
      {cKey:'more',name:'more'},
    ],
  },
  // e生活加油券
  'ESHDZJYQ':{
    mName:'e生活加油券',
    btnEffect:[
      {cKey:'oilcoupon',name:'oilcoupon'},
      {cKey:'orderlist',name:'orderlist'},
      {cKey:'oilcoupondetail',name:'oilcoupondetail'},
      {cKey:'supportstation',name:'supportstation'},
    ],
  },
  // e生活积分换券
  'ESHJFHQ':{
    mName:'e生活积分换券',
    btnEffect:[
      {cKey:'more',name:'more'},
    ],
  },
  // 自定义购买
  'BtnProduct':{
    mName:'自定义购买',
    btnEffect:[
      {cKey:'leftBtnEvent',name:'leftBtnEvent'},
      {cKey:'buyEvent',name:'buyEvent'},
      {cKey:'toAgreement',name:'toAgreement'},
    ],
  },
  // 好客顶部
  'HKTop':{
    mName:'好客顶部',
    btnEffect:[
      {cKey:'toProvince',name:'toProvince'},
      {cKey:'toLogin',name:'点我登录'},
      {cKey:'myhkd',name:'资产明细'},
      {cKey:'exchange',name:'权益领取'},
      {cKey:'orderlist',name:'我的订单'},
    ],
  },
  // 卡车翼家组件
  'CardProvincial':{
    mName:'卡车翼家组件',
    btnEffect:[
      {cKey:'addCardFun_1',name:'绑定柴油卡'},
      {cKey:'addCardFun_2',name:'立即认证'},
    ],
  },
  // // 今日油价
  // 'FuelPrices':{
  //   mName:'',
  //   btnEffect:[
  //     {cKey:'',name:''},
  //   ],
  // },
}
