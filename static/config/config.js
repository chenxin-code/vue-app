// 登录页面显示的名称
function conf_getProductName() {
  return '有路营销平台'
}

// 如果定位失败，默认的地址信息
function conf_getProductDefaultLocaltion() {
  return {
    province: '江西省',
    city: '南昌市',
    district: '',
    longitude: 115.864767,
    latitude: 28.6887544
  }
}

// 关于我们里面的信息项目
function conf_getAboutusInfo() {
  return {
    // 客服电话
    customerService: '010-62669197',
    // 商户合作电话
    merchantPhone: '010-62669197',
    // 商户合作电话
    merchantEmail: 'business@sunboxsoft.com',
    // 技术支持
    technicalSupport: '北京尚博信科技有限公司'
  }
}

// 数字账户相关信息
function conf_digitalAccountList() {
  return [
    {
      // acctTypeCode: 3, //
      acctType: "Points", // 虚拟支付类型 key
      displayName: "积分", // 虚拟支付类型 value
      // unitGainPerUnit: 1,
      // unitGainUnitCount: 10,
      // unitDeductionStep: 1000,
      displayUnit: "个", // 支付单位
      priority: 1 // 支付优先级
    },
    {
      acctTypeCode: 8,
      acctType: "Rewards",
      unitGainPerUnit: 100,
      unitGainUnitCount: 1000,
      unitDeductionEnable: false,
      unitDeductionStep: 1000,
      displayName: "返利红包",
      displayUnit: "元",
      priority: 2
    },
    {
      acctTypeCode: 9,
      acctType: "EmpRewards",
      unitGainPerUnit: 100,
      unitGainUnitCount: 1000,
      unitDeductionEnable: false,
      unitDeductionStep: 1000,
      displayName: "油豆",
      displayUnit: "个",
      priority: 3
    }
  ]
}

// 域名配置，微信和app相关的域名
function conf_productUrl() {
  return {
    // 面向app的域名或者ip
    normalUrl: 'http://tbdapp.deepermobile.com',
    // 面向微信的域名或者ip
    wechatUrl: 'http://tbdwechat.deepermobile.com'
  }
}
