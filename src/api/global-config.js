/**
 * @description 配置项
 */
import Http from '@/utils/http'
import bridgefunc from '@/utils/bridgefunc'
import Store from '@/vuex/store'
import { Toast } from 'vant'
import Cookie from 'js-cookie'
import { assign } from 'lodash'
const defaultConfig = {
  // 修改订单页->页面提示文字
  'OrderModification_TextPrompt':'',
  // 安徽生产环境，APP扫码领券范围
  'ahCouponRange':200,
  // 员工姓名
  'employeesName':'',
  // 在线签约->预授权金额是否显示
  'preAuthAmountViewPermission':false,
  // 在线签约->签约支付方 默认为工行ETC/305006
  'defaultPayWayModel': '305006',
  // 在线签约->是否开启隐藏推荐人 默认为开启/true
  'hideReferrer': true,
  // 签约管理->是否隐藏签约中数据项 默认开启/true
  'hideInSign':false,
  //
  "projectName": "有路营销平台",
  "province": "北京市",
  "city": "昌平区",
  "district": "",
  "longitude": "116.40",
  "latitude": "39.90",
  // 客服电话
  "customerService": "010-62669197",
  "technicalSupport": "北京尚博信科技有限公司",
  // 商户合作email
  "merchantEmail": "business@sunboxsoft.com",
  // 商户合作电话
  "merchantPhone": "010-62669197",
  // 虚拟支付列表
  "acctList": [],
  //  显示'原价' 1  还是划线 2
  priceShowType: 2,
  cut_price_strict:'',// 默认不显示发票，订单详情不显示按钮等砍价配置
  evaluate_show:'',// 河北评价后显示吐槽链接配置项 吐槽id
  query_index_evaluate:1,// 首页是否需要查询未评价订单，为1需要查询
}

// 因为用户协议之前不能访问任何协议，所以先走完init函数，再调用其他任何接口
const globalConfig = {
  getGlobalConfig: function () {
    return new Promise((resolve, reject) => {
      if (window.AppGlobalConfigData) {
        // 已存在全局静态数据
        getDictByAlias(AppGlobalConfigData.vueConfig,resolve,reject);
        return ;
      } else {
        let loaded = false
        // 给出加载静态js的回调
        window.app_global_js_loaded = () => {
          loaded = true
          if (window.AppGlobalConfigData) {
            // 已存在全局静态数据
            getDictByAlias(AppGlobalConfigData.vueConfig,resolve,reject);
            return ;
          }
          let requestParams = { params: {} }
          if (Store.state.channel) {
            requestParams.params.channel = Store.state.channel || ''
          }
          Http.get('/app/json/home/getVueConfig', requestParams).then(res => {
            if (res.data.status === 0) {
              if (Store.state.webtype != 8) {
                //请求石化钱包信息
                getDictByAlias(res.data.data, resolve, reject);
              } else {
                resolve()
              }
            } else {
              reject()
              Store.commit('setGlobalConfig', defaultConfig)
              Toast('获取配置失败')
            }
          }).catch((err) => {
            console.error(err)
            reject()
            Store.commit('setGlobalConfig', defaultConfig)
            Toast('获取配置失败')
          })
        }

        // js已经加载过了，所以不会调用回调函数，同时可能js错了，导致 AppGlobalConfigData 对象不存在，所以做了个容错
        if (window.app_global_js_loaded_mark) {
          window.app_global_js_loaded()
        } else {
          setTimeout(() => {
            if (window.app_global_js_loaded_mark != true) {
              window.app_global_js_loaded()
              window.app_global_js_loaded_mark = true
            }
          }, 500)
        }
      }
    })
  }
}

export default globalConfig

function getDictByAlias(resData,resolve,reject) {
  let paramsData = {
    alias: 'rewards_group' // 返利红包分组--字典表
  }
  Http.post('/app/json/app_dict/getDictByAlias', paramsData).then(res => {
    let data = res.data
    if (data.status == 0) {

      let result = accountSubs(resData, data.data)
      Store.commit('setGlobalConfig', assign({}, defaultConfig, result))
      bridgefunc.vuexStorage()
      resolve(resData);
      Cookie.set('global_config_date', Date.now())
    } else {
      reject()
      Store.commit('setGlobalConfig', defaultConfig)
    }
  }).catch((err) => {
    console.error(err)
    reject()
    Store.commit('setGlobalConfig', defaultConfig)
    Toast('获取子账号配置失败')
  })
}

/**
 * 账户相关数据初始化
 */
function accountSubs(resData, list) {
  let value = undefined;
  let subAccount = []

  // 突然这里孙哥他们改数据结构了 所以改动了
  for (var i = 0; i < list.length; i++) {
    let item = list[i]
    let dictAlias = item.dictAlias
    let arr = dictAlias.split(',')
    for (let j = 0; j < arr.length; j++) {
      item.dictAlias = arr[j]
      if (item.dictAlias == "200001") {
        value = list[i].dictValue;
      }
      subAccount.push(item)
    }
  }

  let result = formatConfig(resData);
  for (let i = 0; i < result.acctList.length; i++) {
    let item = result.acctList[i];
    if(item.acctType == 'Rewards'){
      item.displayName = value;
      item.subAccount = subAccount;
      break;
    }
  }

  return result
}

/**
 * 格式化数据
 * @param data
 */
function formatConfig(data) {
  let result = {}

  let accts = { 'acct.points': 'Points', 'acct.rewards_a': 'RewardsA', 'acct.rewards': 'Rewards', 'acct.emp_rewards': 'EmpRewards', 'acct.enterprise': 'Enterprise', 'acct.limit_wallet': 'LimitWallet', 'acct.elec': 'Elec' }
  //匹配商品列表  订单列表对应的字段
  let acctsMore = { 'Points': { 'listKey': 'points', 'orderKey': 'fixedPoints', 'orderDetailKey': 'pointsPrice' }, 'Rewards': { 'listKey': 'perDiscountRewardsPrice', 'orderKey': 'fixedRewards', 'orderDetailKey': 'rewardsPrice' }, 'EmpRewards': { 'listKey': 'perDiscountEmpRewardsPrice', 'orderKey': 'fixedEmpRewards', 'orderDetailKey': 'empRewardsPrice' }, 'Enterprise': { 'listKey': 'perDiscountEnterprisePrice', 'orderKey': 'fixedEnterprise', 'orderDetailKey': 'enterprisePrice' } };
  let values = {
    'display.name': 'displayName', 'priority': 'priority', 'display.unit': 'displayUnit', 'start_using': 'startUsing'
  }
  let obj = {}
  try {
    for (let key in data) {
      if (data.hasOwnProperty(key)) {
        if (data[key] === 'null' || data[key] === null) {
          data[key] = ''
        }
        let _key = key.substr(9)
        if (_key.includes('acct.')) {
          for (let acctsKey in accts) {
            if (_key.includes(acctsKey)) {
              for (let valuesKey in values) {
                if (_key.includes(valuesKey)) {
                  if (!obj[accts[acctsKey]]) {
                    obj[accts[acctsKey]] = {}
                  }
                  obj[accts[acctsKey]][values[valuesKey]] = data[key]
                  break
                }
              }
              obj[accts[acctsKey]] = Object.assign({}, obj[accts[acctsKey]], acctsMore[accts[acctsKey]]);
              break
            }
          }
        } else {
          _key = _key.replace(/\./g, '_')
          result[_key] = data[key]
        }
      }
    }
    result['acctList'] = []
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        obj[key]['acctType'] = key
        result['acctList'].push(obj[key])
      }
    }
  } catch (e) {
    console.log(e)
  }
  return result;

}
