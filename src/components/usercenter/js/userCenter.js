import http from "../../../utils/http";
import market from "../../../utils/market";
import store from '../../../vuex/store'
import bridgefunc from "../../../utils/bridgefunc";
import router from "../../../router/index";
import Cookie from 'js-cookie'
import Vue from 'vue'
import logCenter from "../../../utils/logCenter";
import mallCommon from "../../../utils/mall2";
import util from '../../../utils/util'
import Config from '../../../api/config'
import actionStatistics from "../../../utils/actionStatistics";

var userCenter = {

  requestList: [],
  loadingToken: false,
  updateTokenTimes: 0,
  updateTokenTime: 0,
  updateTokenFaild: function () {
    store.state.login.token = '';

    for (let i = 0; i < this.requestList.length; i++) {
      let resolve = this.requestList[i].resolve
      resolve(this.requestList[i].res)
    }

    bridgefunc.vuexStorage(function () {

      util.toLogin();
    })
  },
  // // 静默刷新token
  // silentUpdateToken: function (callBack) {
  //   let nstime = (new Date()).getTime()
  //   let stime = sessionStorage.getItem('Login_Save_Time')
  //   stime = parseInt(stime)
  //
  //   if (nstime < stime + 3600 * 1000) {
  //     console.log(nstime, stime + 3600 * 1000)
  //     if (callBack) {
  //       callBack(1)
  //     }
  //     return ;
  //   }
  //
  //   if (!store.state.login.token || store.state.login.token == '') {
  //     if (callBack) {
  //       callBack(0)
  //     }
  //   }
  //   let url = '/app/json/login/updateToken';
  //   let params = {
  //     token: store.state.login.token
  //   };
  //
  //   http.post(url, params).then(res => {
  //     let data = res.data;
  //     if (data.status == 0) {
  //       // 静默登陆，光存储数据不跳转页面
  //       userCenter.saveLoginData(data.data);
  //       if (callBack) {
  //         callBack(1)
  //       }
  //     } else {
  //       store.state.login.token = ''
  //       if (callBack) {
  //         callBack(0)
  //       }
  //     }
  //   }, err => {
  //     store.state.login.token = ''
  //     if (callBack) {
  //       callBack(0)
  //     }
  //   })
  // },
  loadLastData: function () {
    for (let i = 0; i < this.requestList.length; i++) {
      let item = this.requestList[i]
      let url = item.url
      let data = item.data
      if (data.token) {
        delete data['token']
      }
      let res = item.res
      let resolve = item.resolve
      http.post(url, data).then(res1 => {
        resolve(res1)
      }).catch(err => {
        resolve(res)
      })
    }
  },
  expireUpdateToken: function (res) {
    return new Promise((resolve, reject) => {
      let item = {
        res: res,
        url: res.config.url,
        resolve: resolve,
        reject: reject
      }
      if (res.config.method == 'post' && res.config.data) {
        let str = res.config.data
        str = str.split('=').length > 1 ? str.split('=')[1] : ''
        if (str == '') {
          item.data = {}
        } else {
          str = str.split('&')[0]
          str = decodeURIComponent(str)
          item.data = JSON.parse(str)
        }
      } else {
        item.data = {}
      }
      this.requestList.push(item)

      if (this.loadingToken) {
        return;
      }
      this.loadingToken = true;
      let nowT = (new Date()).getTime()
      if (nowT - userCenter.updateTokenTime < 1 * 60 * 1000) {
        // 多次1分钟之内
        userCenter.updateTokenTimes++
        if (userCenter.updateTokenTimes > 3) {
          // 大于3次直接失败，调用登录
          userCenter.updateTokenFaild()
          return;
        }
      } else {
        // 大于1分钟，时间设置为当前时间，请求次数设置为1
        userCenter.updateTokenTime = nowT
        userCenter.updateTokenTimes = 1
      }
      http.post('/app/json/login/updateToken', {
        token: store.state.login.token
      }).then(res => {
        let data = res.data;
        if (data.status == 0) {
          userCenter.saveLoginData(data.data, true);
          setTimeout(() => {
            this.loadLastData()
            this.loadingToken = false;
          }, 100)
        } else {
          userCenter.updateTokenFaild()
          this.loadingToken = false;
        }
      }).catch(err => {
        this.loadingToken = false;
        userCenter.updateTokenFaild()
      })
    })
  },
  updateToken: function () {

  },
  addTokenExpireRequest: function () {

  },

  loadTimes: 0,
  // app 进入 相关流程
  rootEvents: function () {
    // if (store.state.login.phone != '' && store.state.login.password != '') {
    //   // 静默登录
    //   // userCenter.silentLogin(null)
    // } else if (store.state.login.token != '') {
    //   // 同步用户地址
    //   userCenter._getUserLocalhistory()
    // } else {
    //
    // }
    // if (store.state.webtype == 4) {
    //   return ;
    // }
    if (store.state.login.token && store.state.login.token != '') {
      // 同步用户地址
      userCenter._getUserLocalhistory()
      userCenter._getUserBehalf()
    } else {
      userCenter._getNeerShop();
    }
  },
  // 静默登录
  silentLogin: function (callBack) {
    let url = '/app/json/login/login';
    let paramsData = {
      phone: store.state.login.phone,
      userPwd: store.state.login.password,
    };

    http.post(url, paramsData).then(res => {
      let data = res.data;
      if (data.status == 0) {
        // 静默登陆，光存储数据不跳转页面
        userCenter.saveLoginData(data.data);
        if (callBack) {
          callBack()
        }
      } else {
        // 记住的是MD5后的密码，登录失败之后，放弃已存储的错误密码
        // store.state.login.password = '';
      }
    }, err => {
    })
  },
  // 登陆之后, reload 之后跳转函数
  reloadEndPush: function () {
    if (store.state.login.token == '') {
      store.state.pushData = {};
      bridgefunc.vuexStorage(() => {
      })
      return;
    }
    if (!store.state.pushData) {
      return;
    }
    let pushData = store.state.pushData.pushData
    let pushType = store.state.pushData.pushType
    if (pushData != undefined && pushData != '' && pushType != undefined) {
      store.state.pushData = {};
      bridgefunc.vuexStorage(() => {
        userCenter.loginSucceedPush(pushData, pushType)
      })
    }
  },
  // 登陆之后跳转函数
  loginSucceedPush: function (pushData, pushType) {
    // pushType 0: push 1: 协议 2: 动态跳转页面
    if (pushType == 0) {
      router.push(pushData)
    } else if (pushType == 2) {
      market.dynamicNavEnter(pushData)
    } else if (pushType == 3) {
      market.enterClientFunc(pushData)
    } else if (pushType == 8) {
      market.enterGamesFunc(pushData)
    } else if (pushType == 5) {
      market.enterClientFunc(pushData)
    } else {
      bridgefunc.customPush(pushData)
    }
  },
  checkLogined: function (pushData, pushType) {
    if (store.state.login.token == '') {
      // if (store.state.login.phone != '' && store.state.login.password != '') {
      //   // userCenter.silentLogin(() => {
      //   //   // market.enterNav(item)
      //   //   userCenter.loginSucceedPush(pushData, pushType)
      //   // });
      //   router.push({
      //     path: '/usercenter/login',
      //   });
      //   return false
      // } else {
      if (pushData && pushData != undefined && pushType != null && pushType != undefined) {
        store.state.pushData.pushData = pushData
        store.state.pushData.pushType = pushType
        store.state.indexData.selectedIndex = ''
      }

      util.toLogin();

      // }
      return false
    }
    return true
  },
  // 退出登录
  loginOut: function (n = -1) {
    // 记录为一次退出
    actionStatistics.systemAction('160030')
    // 去掉用户相关的各种值
    store.state.login.token = '';
    store.state.userInfo.userId = '';
    store.state.mall2.cartNum = 0
    store.state.mall2.pickUpUser = ''
    store.state.login.password = '';
    // store.state.mall2.selectAddress.id = '-1'
    let oldSel = store.state.mall2.selectAddress
    let selectAddress = {
      "id": '-1',
      "userId": '',
      "provinceId": oldSel.provinceId,
      "provinceName": oldSel.provinceName,
      "cityId": oldSel.cityId,
      "cityName": oldSel.cityName,
      "countryId": oldSel.countryId,
      "countryName": oldSel.countryName,
      "townId": oldSel.townId,
      "townName": oldSel.townName,
      "address": "",
      "isDefault": '',
      "receiverName": "",
      "mobile": "",
      "zipCode": "",
      "createTime": "",
      "wareId": "",
      "addressType": "",
      "wareName": "",
      addressFull: oldSel.provinceName + oldSel.cityName + oldSel.countryName + oldSel.townName
    }
    bridgefunc.removeItem('SinopecOilInfo')
    bridgefunc.loginfinish()
    bridgefunc.removeItem('kNativeToken', () => {
      bridgefunc.setCookies({
        kNativeToken: '',
        usertoken: ''
      })
    })
    Cookie.set('usertoken', '', -1)
    store.state.mall2.selectAddress = selectAddress
    bridgefunc.vuexStorage(function () {
      if (store.state.webtype == 1) {
        setTimeout(() => {
          bridgefunc.resetPage({
            weburl: '/common',
          });
        }, 20)
      } else if (store.state.webtype == 3) {
        wx.miniProgram.reLaunch({url: `/pages/common/home/index`})
      } else {
        setTimeout(() => {
          let path = window.location.href.split('#')[0];
          path = path + "#/common"

          window.location.replace(path)
          window.location.reload(true);
        }, 20)
        // router.go(n)
        // setTimeout(() => {
        //   window.location.reload(true);
        // }, 50)
      }
    }, true)
  },
  // 存储登录后的用户信息
  saveLoginData: function (data, noGetAddress, updataToken = true) {
    if (data) {
      if (!data.logintype) {
        data.logintype = 1;
      }
      store.state.login.bindCardState = data.bindCardState
      store.state.login.phone = data.phone;
      console.log('updataToken', updataToken)
      if (updataToken) {
        // 这个为false
        console.log('存储token', data.token)
        store.state.login.token = data.token;
      }
      if (data.token) {
        store.dispatch('rfrCodeMapAction')
      }
      store.state.login.wxOpenid = data.wxOpenid;
      console.log('store.state.login', store.state.login)
      Vue.set(store.state, 'userInfo', data);
      bridgefunc.vuexStorage(() => {}, true)
      // 微信公众号里面把token 放到sessionStorage
      if (store.state.webtype == 2) {
        sessionStorage.setItem('mall2token', data.token);
      }
      Cookie.set('userPhone', data.phone, {path: '/'})
      if (!noGetAddress) {
        userCenter._getUserLocalhistory()
      }

      if (store.state.login.token != '') {
        let logBody = 'token：' + store.state.login.token + '<br/>';
        logCenter.addLog('获取token', logBody)
      }
    }
  },
  // 登录之后 刷新当前页面
  retsetToIndex: function (data, n = 1) {
    if (data) {
      if (!data.logintype) {
        data.logintype = 1;
      }
      userCenter.saveLoginData(data)

      // 给 app 回调，登陆成功
      bridgefunc.loginfinish()
      if (store.state.userInfo.idNumber) {
        let str = JSON.stringify({
          name: store.state.userInfo.realName,
          idCardNo: store.state.userInfo.idNumber
        })
        if (util.isIos()) {
          bridgefunc.setItem('SinopecOilInfo', str)
        } else {
          bridgefunc.setItem('SinopecOilInfo', encodeURIComponent(str))
        }
      } else {
        bridgefunc.removeItem('SinopecOilInfo')
      }
      // 需要使用存储的首页 index
      if (store.state.indexData.selectedIndex != '' && store.state.indexData.selectedIndex > -1) {
        store.state.indexData.useSaveIndex = true
      }
      bridgefunc.vuexStorage(function () {
        // 注册退到第几个层级
        if (n && n > 0) {
          router.go(-n);
        } else if (n === 0) {
          console.log('n === 0，不做处理')
        } else {
          router.go(-1)
        }
        setTimeout(() => {
          if (window.wechatFirstIn) {
            window.wechatFirstIn = null
            router.replace('/common')
          } else {
            Cookie.set('usertoken', '', -1)
            if (store.state.deployType == '2') {
              // 标记为刚刚登录过
              sessionStorage.setItem('just_login_reload', '1')
            }
            window.location.reload(true);
          }
        }, 50)
      }, true)
    } else {
      console.log('vuexStorage')
      bridgefunc.vuexStorage(function () {
        bridgefunc.resetPage({
          weburl: '/common',
        });
      }, true)
    }
  },
  // 添加我的自提点
  _addToMyPickupAddress: function (id) {
    if (store.state.addPickupAddressType == 2) {
      // 不自动加入
      return;
    }
    let url = '/app/json/user_address/addUserAddressSelflift';
    let params1 = {
      token: store.state.login.token,
      storeId: id
    }

    http.post(url, params1).then(res => {
    }, error => {
    });
  },
  // 设置默认自提点
  _setDefaultPickupAddress: function (id) {
    let url = '/app/json/user_address/addDefaultAddress';
    let params1 = {
      token: store.state.login.token,
      selfId: id
    }

    http.post(url, params1).then(res => {
    }, error => {
    });
  },
  // 获取 用户保存的地址信息
  _getUserLocalhistory: function (callback) {

    if (store.state.login.token == '') {
      return;
    }
    let url = '/app/json/user_address/getDefaultAddress';
    let paramsData = {
      token: store.state.login.token
    };
    http.post(url, paramsData).then(res => {
        let data = res.data;
        if (data.status == 0) {
          // 如果临时地址存在，就不请求了

          let delivery = data.data.delivery
          if (delivery != null && delivery != '') {
            store.state.mall2.selectAddress = delivery;
          } else {
            if (store.state.mall2.selectAddress.id != '-1') {
              store.state.mall2.selectAddress = {"id": ''}
              bridgefunc.getLocation((locationinfo) => {
                mallCommon.addressAnalysis(() => {
                }, locationinfo);
              })
            }
          }
          if (store.state.globalConfig.app_home_special_flag == 'cnooc') {
            if (callback) {
              callback();
            }
            return;
          }
          let self = data.data.self
          if (self != null && self != '') {
            let v = sessionStorage.getItem('RHY_Pickup_Address')
            if (v) {
              // 如果润滑油地址存在，就不使用了
              sessionStorage.removeItem('RHY_Pickup_Address')
            } else {
              store.state.mall2.zitiAddress = self;
            }
          } else {
            let v = sessionStorage.getItem('RHY_Pickup_Address')
            if (v) {
              // 如果润滑油地址存在，就不使用了
              sessionStorage.removeItem('RHY_Pickup_Address')
            } else {
              //  没有默认的自提点，给定位一个。
              userCenter._getNeerShop();
            }
          }
          userCenter._getCartCount()
        } else {
          // callback()
        }
        if (callback) {
          callback();
        }
      },
      err => {
        callback()
      }
    )
  },
  // 没有默认店铺的时候，定位一个最近的当默认店铺
  _getNeerShop: function () {

    if (store.state.globalConfig.delivertype_default == '2') {
      return ;
    }
    if (store.state.webtype == 8) {
      return false
    }
    // if (store.state.globalConfig.app_home_special_flag == 'cnooc') {
    //   return ;
    // }
    bridgefunc.getLocation((locationinfo) => {
      //城市不为空的情况下
      if (locationinfo.city && locationinfo.city != '') {
        // let tempLocDic = util.bd_decrypt(locationinfo.longitude,locationinfo.latitude);
        store.state.currentLocation.posx = locationinfo.longitude;
        store.state.currentLocation.posy = locationinfo.latitude;

        let url = '/app/json/user_address/getDefaultSelflift';
        let params1 = {
          posx: store.state.currentLocation.posx,
          posy: store.state.currentLocation.posy,
          page: {
            index: 1,
            pageSize: 1
          }
        }

        http.post(url, params1).then(res => {
          let data = res.data;
          if (data.status == 0) {
            let v = sessionStorage.getItem('RHY_Pickup_Address')
            if (v) {
              return;
            }
            let pAdress = data.data;
            if (pAdress) {
              store.state.mall2.zitiAddress = pAdress;
              if (store.state.login.token != '') {
                userCenter._addToMyPickupAddress(pAdress.id)
                userCenter._setDefaultPickupAddress(pAdress.id)
              }
            }
          } else {
          }
        }, error => {

        });
      }
    });
  },
  // 获取购物车数量
  _getCartCount: function () {
    if (store.state.login.token == '') {
      return
    }
    let url = '/app/json/app_cart/getCartCount';
    let paramsData = {
      token: store.state.login.token,
      //默认2是配送
      deliveryType: store.state.mall2.staticDeliverType
    };
    http.post(url, paramsData).then(
      res => {
        let data = res.data;
        if (data.status == 0) {
          store.state.mall2.cartNum = data.data
        } else {
        }
      },
      error => {
      }
    );
  },
  // 获取我的订单数目
  _getMyOrder: function () {
    let url = '/app/json/app_shopping_order/queryBadge';
    let paramsData = {
      token: store.state.login.token,
    };
    http.post(url, paramsData).then(
      res => {
        let data = res.data;
        if (data) {
          let countArr = data.data;
          if (countArr.length >= 4) {
            store.state.mall2.order.orderCount_dzf = countArr[0].count
            store.state.mall2.order.orderCount_dfh = countArr[1].count
            store.state.mall2.order.orderCount_dsh = countArr[2].count
            store.state.mall2.order.orderCount_dth = countArr[3].count
          }
        }
      },
      error => {
      }
    );
  },
  // 获取我的资产
  _getMyAssets: function () {
    let url = market.apiBaseURL() + '/app/json/user/getUserWallet';
    let paramsData = {
      token: store.state.login.token,
    };
    http.post(url, paramsData).then(
      res => {
        let data = res.data;
        if (data.status == 0) {
          store.state.mall2.myAssets = data.data
        }
      },
      error => {
      }
    );
  },
  // 获取我的权益相关的接口
  _getUserBehalf: function (callBack) {
    let url = '/app/json/user/getUserBehalf';
    let paramsData = {};
    http.post(url, paramsData).then(
      res => {
        let data = res.data;
        if (data.status == 0) {
          store.state.mall2.behalf = data.data
          if (callBack) callBack(data.data)
        }
      },
      error => {
      }
    );
  },
  // 获取会员级别信息
  getUserRank: function () {
    // if (window.AppGlobalConfigData) {
    //   // 静态全局数据
    //   store.state.memberLevel = AppGlobalConfigData.userRankList;
    //   bridgefunc.vuexStorage()
    //   return ;
    // }
    this.loadTimes++
    if (this.loadTimes > 3) {
      return
    }
    let url = "/app/json/user_rights/getUserRank";
    http.post(url, {}).then(
      res => {
        let data = res.data;
        if (data.status == 0 && data.data != '') {
          store.state.memberLevel = data.data;
          bridgefunc.vuexStorage()
        } else {
          this.getUserRank()
        }
      },
      error => {
        this.getUserRank()
      }
    );
  },
  //获取开屏广告
  advertisepageOpen: function () {
    // if (window.AppGlobalConfigData) {
    //   // 静态全局数据
    //   this.getAppAdFinished(AppGlobalConfigData.appAdList)
    //   return ;
    // }
    let url = '/app/json/home/getOpenAd';
    let params1 = {
      cityName: store.state.indexData.city,
      provinceName: store.state.indexData.province,
      adImgRatio: document.body.clientWidth + '*' + document.body.clientHeight
    }
    http.post(url, params1).then(res => {
      let data = res.data;
      if (data.status == 0) {
        let arr = data.data || [];
        this.getAppAdFinished(arr)
      } else {
        this.getAppAdFinished()
      }
    }, error => {
    });
  },
  /**
   * getAppAdFinished 获取广告结束
   * @param arr
   */
  getAppAdFinished: function (arr=[]) {
    if (!arr || arr.length == 0) {
      bridgefunc.advertisepage({'isOpen': 0});
      store.state.advertisementIndex = 0;
      bridgefunc.vuexStorage();
      return;
    }

    let advertisementIndex = store.state.advertisementIndex > (arr.length - 1) ? 0 : store.state.advertisementIndex;
    let advertisementInfo = arr[advertisementIndex];
    advertisementInfo['isOpen'] = 1;
    bridgefunc.advertisepage(advertisementInfo);
    store.state.advertisementIndex = advertisementIndex + 1;
    bridgefunc.vuexStorage();
  }
}

export default userCenter
