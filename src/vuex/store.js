import Vue from 'vue'
import Vuex from 'vuex'
import http from "../utils/http";
import bridgefunc from "../utils/bridgefunc";

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    version: '1.0.0',
    // protocolVersion: 2.0,
    webtype: '0', // -1 内容管理配置， 0 网页访问， 1 app， 2 公众号， 3 小程序， 4 e生活app， 5 支付宝，6 加油河北老app，7 掌厅app 8 企业微信
    etpAgentId: '', // 企业微信SDK授权使用
    etpAppId: '', // 企业微信SDK授权使用
    isAddToFavorites: -1, // 是否已收藏小程序 1 是
    firstEntryLocationPath: '', // 第一次进入的路由
    deployType: '1', // 1 常规，2 油惠通环境, 3 有路环境, 4 海油环境, 5 中免
    stateObj: {}, //微店状态查询数据
    channel: '', // 登录渠道
    peopleList: [], //门票出行人
    addPickupAddressType: 0, // 0 或者 为空，未设置过， 1 自动加入， 2 不加入
    // isSpecialPush: false, // 是否是push，需要作出不同的动画，此数据仅当辅助用，因为某些场景没法根据路由判断是否是前进
    list_guide_show: true, // 是否展示引导
    advertisementIndex: 0, //第几张广告
    barHeight: null,
    selectp: {
      lat: '39.941676',
      lng: '116.400513'
    },
    location: {
      selectType: '', // 0 默认的（不处理）， 1 登录， 2 首页， 3 个人信息
      login: {
        province: '',
        city: ''
      },
    },
    rfrCode: '', // 推荐码
    rfrCodeMap: {},
    refuelStationDetail: {},
    refuelStation: {
      selfOil: '', // 列表查询油品入参
      distLess: '', // 列表查询距离入参
      stationCode: '',
      stationName: '',
      posx: '',
      posy: '',
      phone: '',
      provinceName: '',
      cityCompName: '',
      address: '',
      introdection: '',
      distance: '',
      water: '',
      cleaning: '',
      toilet: '',
      maintain: '',
      food: '',
      hotWater: '',
      selfService: '',
      recharge: '',
      cvs: '',
      state: '',
      cadService: '',
      weighBridge: '',
      bacco: '',
      drinks: '',
      scenic: '',
      catering: '',
      hotel: '',
      bank: '',
    },
    card: {
      cardType: '',
      cityName: '',
      cardNo: '',
      totalBalance: '',
      pointBalance: '',
      reserveBalance: '',
      cardBalance: '',
    },
    orderPlace: {
      "id": '',
      "userId": '',
      "provinceId": "",
      "provinceName": "",
      "cityId": "",
      "cityName": "",
      "countryId": "",
      "countryName": "",
      "townId": "",
      "townName": "",
      "address": "",
      "isDefault": '',
      "receiverName": "",
      "mobile": "",
      "zipCode": "",
      "createTime": "",
      "wareId": "",
      "addressType": "",
      "wareName": ""
    },
    microSho: {
      deliverType: '',
      carts: [],
      groupbuyingCarts: [],
      screenType: null,
      storeCode: ''
    },
    storeCodeArr: {},
    recommendationSku: {
      skuList: []
    },
    mall2: {
      cartNum: 0,
      pickUpUser: '',
      recommend: '',
      // 全局选择自提还是配送
      staticDeliverType: '2',
      // 全局自提地址  id为空字符串没有   -1 是定位  其它是选择的地址
      zitiAddress: {
        id: ''
      },
      // 第一次进入自提，需要判断500米范围内是否有自提点
      pickupAddressChecked: false,
      // 全局的收货地址
      selectAddress: {
        // "id": '',
        "id": '',
        "userId": '',
        "provinceId": "",
        "provinceName": "",
        "cityId": "",
        "cityName": "",
        "countryId": "",
        "countryName": "",
        "townId": "",
        "townName": "",
        "address": "",
        "isDefault": '',
        "receiverName": "",
        "mobile": "",
        "zipCode": "",
        "createTime": "",
        "wareId": "",
        "addressType": "",
        "wareName": "",
        addressFull: ''
      },
      searchHistory: [],
      browsingHistory: [], // 里面的对象 {y：年，m：月，d：日，list：[skuId]}
      tripPeopleList: [],//出行人
      servicecontact: {//售后联系人
        contactname: '',
        contactphone: ''
      },
      // Behalf
      behalf: {},
      // 我的资产
      myAssets: {
        // 返回：surplusPoints;//剩余积分数量    couponNum;//券数量  cardNum;//卡数量  levSurplusPoints; //定级积分
        surplusPoints: '0',
        levSurplusPoints: '0',
        couponNum: '0',
        cardNum: '0',
        levelNo: '1001'
      },
      // 订单数目
      order: {
        backIndex: -1,
        orderCount_dzf: 0,
        orderCount_dfh: 0,
        orderCount_dsh: 0,
        orderCount_dth: 0,
      }
    },
    userInfo: {},
    login: {
      phone: '',
      // 记住的是MD5后的密码
      password: '',
      savePWD: '0',
      token: '',
      wxOpenid: '',
      bindCardState: '',
      faceID: false,
      facePwd: '',
      touchID: false,
      touchPwd: '',
      gestureID: false,
      gestureNumbers: undefined,
      gesturePwd: ''
    },
    // 这里存储百度坐标
    currentLocation: {
      posx: '',
      posy: ''
    },
    indexData: {
      province: '',
      city: '',
      selectedIndex: '',
      useSaveIndex: false,
      station: {
        address: "成都",
        id: '',
        state: "1",
        stationName: "",
      },
      msgNumber: 0
    },
    severTime: {
      //  服务器时间
      jetlag: 0,
      currentTime: 0
    },
    pushData: {},
    memberLevel: [
      // {
      //   "id": 1,
      //   "objectId": "",
      //   "listIndex": 0,
      //   "inAppId": "",
      //   "limitStart": "",
      //   "configId": 1,
      //   "rankCode": "1001",
      //   "name": "普卡",
      //   "pointAmount": 10,
      //   "rankIcon": "http://139.224.74.177:18801/download?uploadFile.id=32895",
      //   "cardImage": "http://139.224.74.177:18801/download?uploadFile.id=32896",
      //   "period": "1",
      //   "state": 1,
      //   "computePeriod": 1,
      //   "createTime": 1547091298000,
      //   "creator": "杜文洁-广州市时代邻里邦网络科技有限公司",
      // }
    ],
    commonArgs: {
      saveTime: undefined,
      data: {
        deviceId: ''
      }
    },
    clientWidth: 375,
    _products: null,
    payInfo: {
      isFreePayPwd: '', // 1 已开启小额免密 0  未开启
      freePayAmount: '' // 小额免密金额
    },
    globalConfig: {},
    tabLocation: {
      currentIndex: ''
    }, // 批量购油的我的页面订单列表 tab返回定位问题
    tabBeanLocation: {
      currentIndex: ''
    }, // 批量购油的我的页面金豆列表 tab返回定位问题
    identifyState: {
      idState: '', // 实名认证状态
      imageUrl: '', // 行驶证首页url
      plateNum: '', // 车牌号
      ownerName: '', // 所有人姓名
      vin: '', // 车辆识别代号
      engineNum: '', // 发动机号
      vehType: '', // 车辆类型
      brand: '', // 品牌车系
      brandModel: '', // 车型
      vehColor: '', // 车辆颜色
      blackCheckDriving: '', // 驾驶证认证验证身份证
      blackCheckVehicle: '', // 车辆行驶证认证验证身份证
    }, // 实名认证--认证状态以及行驶证信息暂存
    isPwdSet: { // 返利红包支付设置密码后暂存状态
      status: '', // 是否设置状态
      pwd: '' // 密码
    },
    userInvoice: null,
    vipUnitUser: {
      vipUnitUserCode: '',
      vipUnitUserId: '',
    }, // 批量购油大客户
    oilPayOrderList: [], // 加油支付订单列表
    needCardTips: '', // 加油卡绑定中办理加油卡提示弹框 （只弹出一次）
    noTips: '', // 加油卡绑定中不在提醒按钮
    oilPayBillInstructionTip: '', // 加油记录页面操作提示
    homePagePopupStep: '',
    pwdStates: { // 支付中心 各项密码 （手势，指纹，面部）
      facePwd: '',
      touchPwd: '',
      gestureNumbers: undefined,
      gesturePwd: ''
    },
    // 不存储的token信息
    // noSaveData: {
    //   routerData: {
    //     transitionName: '',
    //     routePathArrs: ''
    //   }
    // },
    yiDun: { // 易盾
      yidunInitLogin: '' // 一键登录
    }
  },
  getters: {
    webtype: state => {
      return state.webtype
    },
    userInfo: state => {
      return state.userInfo
    },
    location: state => {
      return state.location
    },
    login: state => {
      return state.login
    },
    orderPlace: state => {
      return state.orderPlace
    },
    clientWidth: state => {
      return state.clientWidth
    },
    getSelectAddress: state => {
      return state.mall2.selectAddress
    },
    getPickAddress: state => {
      return state.mall2.zitiAddress
    },
    selectp: state => {
      return state.selectp
    },
    payInfo: state => {
      return state.payInfo
    },
    tabLocation: state => {
      return state.tabLocation
    },
    identifyState: state => {
      return state.identifyState
    },
    getPutaggregate: state => {
      return state.stateObj
    },
    getpeople: state => {
      return state.peopleList
    },
    isPwdSet: state => {
      return state.isPwdSet
    },
    userInvoice: state => {
      return state.userInvoice
    },
    vipUnitUser: state => {
      return state.vipUnitUser
    },
    tabBeanLocation: state => {
      return state.tabBeanLocation
    },
    oilPayOrderList: state => {
      return state.oilPayOrderList
    },
    needCardTips: state => {
      return state.needCardTips
    },
    noTips: state => {
      return state.noTips
    },
    pwdStates: state => {
      return state.pwdStates
    },
    getGlobalConfig: state => {
      return state.globalConfig
    },
    getRecommendationSku: state => {
      return state.recommendationSku
    },
    getMicroSho: state => {
      return state.microSho
    },
    getStoreCodeArr: state => {
      return state.storeCodeArr
    },
    getYiDun: state => {
      return state.yiDun
    },
  },
  mutations: {
    setWebType: (state, info) => {
      state.webtype = info
    },
    setPayInfo: (state, info) => {
      state.payInfo = info
    },
    setGlobalConfig: (state, config) => {
      state.globalConfig = config
    },
    setTabLocation: (state, info) => {
      state.tabLocation = info
    },
    setIdentifyState: (state, info) => {
      state.identifyState = info
    },
    putaggregate: (state, param) => {
      state.stateObj = param
    },
    putpeople: (state, param) => {
      state.peopleList = param
    },
    setIsPwdSet: (state, info) => {
      state.isPwdSet = info
    },
    setUserInvoice: (state, info) => {
      state.userInvoice = info
    },
    setVipUnitUser: (state, info) => {
      state.vipUnitUser = info
    },
    setTabBeanLocation: (state, info) => {
      state.tabBeanLocation = info
    },
    setNeedCardTips: (state, info) => {
      state.needCardTips = info
    },
    setNoTips: (state, info) => {
      state.noTips = info
    },
    setPwdStates: (state, info) => {
      state.pwdStates = info
    },
    setStationInfo: (state, info) => {
      state.refuelStation = info
    },
    setRecommendationSku: (state, info) => {
      state.recommendationSku = info
    },
    setMicroSho: (state, info) => {
      return state.microSho = info
    },
    setStoreCodeArr: (state, info) => {
      return state.storeCodeArr[info.storeCode] = []
    },
    setRfrCodeMap: (state, info) => {
      return state.rfrCodeMap = info
    },
    setYiDunLogin: (state, info) => {
      state.yiDun.yidunInitLogin = info
    },
  },
  actions: {
    rfrCodeMapAction({state, commit}) {
      http.post('/app/json/user/getLastReferrer', {token: state.login.token}).then(res => {
          let data = res.data;
          if (data.status == 0) {
            commit('setRfrCodeMap', data.data || {})
            // 设置当前推荐码
            state.rfrCode = state.rfrCodeMap.myRfrCode || state.rfrCodeMap.lastReferrer || ''
            console.log('设置当前推荐码', state.rfrCode)
          }
          bridgefunc.vuexStorage()
        },
        err => {
          console.log(err)
        }
      )
    }
  }
})

export default store
