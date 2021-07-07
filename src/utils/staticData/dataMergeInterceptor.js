import Axios from "../http";
import Toast from "../../components/Vendor/toast";
import Store from '../../vuex/store'

const dataMergeInterceptor = {
  /**
   * valueData 存储数据，减少请求频率
   * UserSummary 存储接口数据：/app/json/user/getUserSummary
   * AppGlobalConfigData 存储全局Config数据
   */
  valueData: {},
  /**
   * apiInterceptorList 拦截接口以及取数据规则
   * valueDataKey 从 valueData 里面取数据的key
   * valueKey 从 上面 取出来的数据中的 具体数据的key
   * isStaticData 静态数据，全局js加载的
   * mustParams 参数必须一致，否则继续请求
   */
  apiInterceptorDic: {
    '/app/json/user/getUserInfo': {
      valueDataKey: 'UserSummary',
      valueKey: 'userInfo'
    },
    '/app/json/user_address/getDefaultAddress': {
      valueDataKey: 'UserSummary',
      valueKey: 'userDefaultAddress'
    },
    '/app/json/user/getLastReferrer': {
      valueDataKey: 'UserSummary',
      valueKey: 'userLastReferrer'
    },
    '/app/json/user/getUserWallet': {
      valueDataKey: 'UserSummary',
      valueKey: 'userWallet'
    },
    '/app/json/user/getUserBehalf': {
      valueDataKey: 'UserSummary',
      valueKey: 'userWallet'
    },
    '/app/json/app_cart/getCartCount': {
      valueDataKey: 'UserSummary',
      valueKey: 'cartCount'
    },
    '/app/json/message/getUnreadMsgCnt': {
      valueDataKey: 'UserSummary',
      valueKey: 'unreadMsgCnt'
    },
    '/app/json/user_rights/getUserRank': {
      valueDataKey: 'AppGlobalConfigData',
      valueKey: 'userRankList',
      isStaticData: true
    },
    '/app/json/app_dict/getDictByAlias': {
      valueDataKey: 'AppGlobalConfigData',
      valueKey: 'dictMap',
      subValueKey: 'rewards_group',
      isStaticData: true,
      mustParams: {
        alias: 'rewards_group'
      }
    },
    '/app/json/home/getOpenAd': {
      valueDataKey: 'AppGlobalConfigData',
      valueKey: 'appAdList',
      isStaticData: true
    },
  },
  /**
   * responseList 需要返回结果的回调
   * 只有在需要请求的时候才会出现这种
   */
  responseList: [],
  /**
   * dataLoaded 请求数据成功
   */
  dataLoaded: false,
  /**
   * dataLoaded 正在请求数据
   */
  dataLoading: false,
  /**
   * 匹配数据规则，返回不同的情况
   * @param url
   * @returns {number}
   * 0 不是需要拦截的数据请求，继续post请求数据
   * 1 数据以保存，并且是最新数据
   * 2 需要发送请求，并保存回调
   */
  matchRule: function (url, data) {
    let interceptorData = this.apiInterceptorDic[url]
    if (!interceptorData) {
      // 不是需要拦截的数据请求
      return 0
    }
    let mustParams = interceptorData.mustParams
    if (mustParams) {
      // 必要参数，如果参数不一致，那么不能算作同相同请求
      for (let key in mustParams) {
        if (data[key] != mustParams[key]) {
          return 0
        }
      }
    }
    let isStaticData = interceptorData.isStaticData
    if (isStaticData) {
      // 静态数据
      if (this.valueData.AppGlobalConfigData || window.AppGlobalConfigData) {
        this.valueData.AppGlobalConfigData = window.AppGlobalConfigData
        // 静态数据存在
        return 1
      } else {
        // 暂时还没返回全局数据，走原来的请求方式
        return 0
      }
    } else if (this.dataLoaded) {
      // 刚刚请求完毕，短时间内不再重新请求
      return 1
    } else {
      // 发送合并的数据请求
      return 2
    }
  },
  /**
   * 重写Axios post，以实现合并接口以及静态数据的直接返回。
   * @param url
   * @param data
   * @param config
   * @returns {*}
   */
  rewritePost: function (url, data = {}, config = {}) {
    let rule = this.matchRule(url, data)
    let interceptorData = this.apiInterceptorDic[url]
    switch (rule) {
      case 0:
        // 不是需要拦截的请求，走原来的请求方式
        config.method = 'post'
        config.url = url
        config.data = data
        return Axios.request(config);
        break;
      case 1:
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            let d = this.concatResponseData(interceptorData)
            console.log('直接返回', {
              'url': url,
              'data:': data,
              'response': d,
            })
            resolve(d)
          }, 20)
        })
        break;
      case 2:
        // 请求数据，并在返回数据的时候再回调
        console.log('发起请求', {
          'url': url,
          'data:': data
        })
        this.getDatas()
        return new Promise((resolve, reject) => {
          this.responseList.push({
            interceptorData: interceptorData,
            resolve: resolve,
            reject: reject
          })
        })
        break;
      default:
        // 不是需要拦截的请求，走原来的请求方式
        config.method = 'post'
        config.url = url
        config.data = data
        return Axios.request(config);
        break;
    }
  },
  /**
   * 获取所有数据
   */
  getDatas: function () {
    if (this.dataLoading == true) {
      return ;
    }
    this.dataLoading = true
    if (Store.state.login.token) {
      this.getUserSummary()
    }
  },
  /**
   * 请求合并后的用户数据
   */
  getUserSummary: function () {
    Axios.post('/app/json/user/getUserSummary', {
      deliveryType: '2',
      orderCategory: '0'
    }).then(res => {
      let data = res.data;
      if (data.status == 0) {
        let d = data.data
        this.valueData['UserSummary'] = d
        this.responseAllData()
        // this.getUserTable(d.userInfo.phone)
      } else {
        if (!this.valueData['UserSummary']) {
          Toast('请求用户数据失败请稍后尝试！')
          this.responseAllData(false)
        } else {
          this.responseAllData()
        }
      }
    }).catch(err => {
      if (!this.valueData['UserSummary']) {
        Toast('请求用户数据失败请稍后尝试！')
        this.responseAllData(false)
      } else {
        this.responseAllData()
      }
    })
  },
  //获取用户标签
  getUserTable:function(phone){
    Axios.post('/app/json/customer_service/findHeadInfoByList',{
      userId:phone,
      keyType:2,
    }).then(res=>{
      let data = JSON.parse(res.data.data);
      let arr = [];
      data.longTable.forEach(e=>{
        if(e.labelName != '证件号码' && e.labelName != '证件类型'){
          arr.push({label:e.labelName, value:e.labelValue?e.labelValue:'无'})
        }
      })
      Store.state.userLable = JSON.stringify(arr);
      console.log('Store.state.userLable',Store.state.userLable)
    })
  },
  /**
   * 回调所有回调
   * @param isSuccess 是否是成功之后的回调
   */
  responseAllData: function (isSuccess = true) {
    this.dataLoading = false
    setTimeout(() => {
      this.dataLoaded = false
    }, 5 * 1000)
    this.dataLoaded = true
    this.responseList.forEach(item => {
      if (isSuccess == false) {
        let reject = item.reject
        try {
          if(reject) reject()
        } catch (e) {
          console.error(e)
        }
      } else {
        let interceptorData = item.interceptorData
        let resolve = item.resolve
        try {
          resolve(this.concatResponseData(interceptorData))
        } catch (e) {
          console.error(e)
        }
      }
    })
  },
  /**
   * 拼接回调数据结构
   * @param interceptorData
   * @returns {{data: {result: string, data: *, status: number}}}
   */
  concatResponseData: function (interceptorData) {
    let valueDataKey = interceptorData.valueDataKey
    let valueKey = interceptorData.valueKey
    let data = this.valueData[valueDataKey][valueKey]
    let subValueKey = interceptorData.subValueKey
    if (subValueKey) {
      data = data[subValueKey]
    }
    return {
      data: {
        data: data,
        status: 0,
        result: "success"
      }
    }
  },
  /**
   * 获取请求数据的部分关键参数，尤其是商品详情
   * @returns {Array}
   */
  getRequestArgs: function () {
    let d = this.valueData['UserSummary']
    let arr = []
    if (d) {
      arr = [{
        isBirth: d.isBirth
      },{
        isOnceBind: d.isOnceBind
      },{
        isStaff: d.isStaff
      },{
        userLevel: d.userLevel
      },{
        specialMark1: d.specialMark1 || ''
      }]
    }
    return arr
  }
}

export default dataMergeInterceptor
