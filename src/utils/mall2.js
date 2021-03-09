import http from "./http";
import store from '../vuex/store'
import bridgefunc from "./bridgefunc";
import Toast from '@/components/Vendor/toast/index'
import jsonp from 'jsonp'
import Config from '@/api/config'
import { result } from "lodash";
import appLocalstorage from '@zkty-team/x-engine-module-localstorage'

var mallCommon = {
  // 孙哥价格处理（返回结构不一样，0.0）
  dataProcessing: function (item) {
    let amount = item.payAmount + ''
    item.dpedData = this.getPriceData(amount);
  },

  getPriceData:function(amount){
    let arr = amount.split(".");
    let dpedData = {
      integer: '',
      decimals: '',
    }
    if (arr) {
      if (arr.length == 1) {
        dpedData.integer = arr[0]
        dpedData.decimals = '00'
      } else if (arr.length == 2) {
        dpedData.integer = arr[0]
        dpedData.decimals = arr[1]
        if (dpedData.decimals.length < 2) {
          dpedData.decimals = dpedData.decimals + '0'
        }
      }
    }
    return dpedData;
  },
  // 柴总价格处理（返回结构不一样，0.0）
  priceFromItem: function (item) {
    let dpedData = {
      integer: '0',
      decimals: '00',
      linePrice: '0.00'
    }
    let salePrice = item.salePrice + '';
    dpedData.linePrice = salePrice
    // if (salePrice == 'undefined') {
    //   salePrice = item.price + '';
    // }

    let activityPrice = item.activityPrice + '';
    // if (item.points && item.points != '') {
    //   activityPrice = item.perDiscountPrice + '';
    // }
    for (let i = 0; i < store.state.globalConfig.acctList.length; i++) {
      let accitem = store.state.globalConfig.acctList[i];
      let temp = item[accitem.listKey];
      if(temp && temp != ''){
        //商品列表 有第三方支付的时候 价格取perDiscountPrice
        activityPrice = item.perDiscountPrice + '';
        item.activityPrice = activityPrice;
        break;
      }
    }
    let arr = activityPrice.split('.');
    if (arr) {
      if (arr.length == 1) {
        dpedData.integer = arr[0]
        if (dpedData.integer == '') {
          dpedData.integer = '0'
        }
        dpedData.decimals = '00'
      } else if (arr.length == 2) {
        dpedData.integer = arr[0]
        dpedData.decimals = arr[1]
        if (dpedData.decimals.length < 2) {
          dpedData.decimals = dpedData.decimals + '0'
        }
      }
    }
    return dpedData;
  },

  //是否显示价格
  getShowPrice: function (item, type) {

    let isPoints = false;
    let price = item.tPrice;
    //取三方支付的key
    let key = 'listKey';

    for (let i = 0; i < store.state.globalConfig.acctList.length; i++) {
      let accitem = store.state.globalConfig.acctList[i];
      let temp = item[accitem[key]];
      if(temp){
        isPoints = true;
        break;
      }
    }
    //积分行数
    if (item.type == 'listdouble') {
      if (isPoints) {
        return false
      } else {
        return true;
      }
    }
    //有三方 且 活动价为0 的情况下  隐藏价格
    if ((price == 0 || price == '') && isPoints) {
      return false;
    } else {
      return true;
    }
  },
  // 添加搜索历史
  pushSearchHistory: function (str) {
    if (str == '') {
      return
    }
    let arr = []
    arr.push(str)
    for (let i = 0; i < store.state.mall2.searchHistory.length; i++) {
      let hstr = store.state.mall2.searchHistory[i]
      if (hstr != str) {
        arr.push(hstr)
        if (arr.length > 9) {
          break
        }
      }
    }
    store.state.mall2.searchHistory = arr;
    bridgefunc.vuexStorage()
  },

  commonLocalStorage (skuId, deliverType, result) {
    console.log('2222222', skuId, deliverType, result)
    let curTime = store.state.severTime.currentTime
    let cDate = new Date(curTime * 1000);
    let y = cDate.getFullYear(), m = cDate.getMonth() + 1, d = cDate.getDate();
  
    let arr = []
    let total = 0
    let browsingHistory = [];
    if (!result || result == '' || result == 'null' || result == undefined) {
  
    } else {
      let jsonString = result;
      let jsonData = JSON.parse(decodeURIComponent(jsonString))
      browsingHistory = jsonData
    }
  
    if (browsingHistory.length > 0) {
      let fitem = browsingHistory[0]
      if (y == fitem.y && m == fitem.m && d == fitem.d) {
        total++;
        for (let i = 0; i < browsingHistory.length; i++) {
          if (total > 100) {
            break;
          }
          let odItem = browsingHistory[i];
          let dItem = {
            y: odItem.y,
            m: odItem.m,
            d: odItem.d,
            list: []
          };
          if (i == 0) {
            dItem.list.push({
              skuId: skuId,
              deliverType: deliverType,
            })
          }
          let ol = odItem.list;
          for (let j = 0; j < ol.length; j++) {
            if (total > 100) {
              break;
            }
            let oskuD = ol[j]
            if (oskuD.skuId != skuId) {
              dItem.list.push(oskuD)
              total++;
            }
          }
          arr.push(dItem)
        }
      } else {
        arr.push({
          y: y,
          m: m,
          d: d,
          list: [{
            skuId: skuId,
            deliverType: deliverType,
          }]
        })
        total++;
        for (let i = 0; i < browsingHistory.length; i++) {
          if (total > 100) {
            break;
          }
          let odItem = browsingHistory[i];
          let dItem = {
            y: odItem.y,
            m: odItem.m,
            d: odItem.d,
            list: []
          };
          let ol = odItem.list;
          for (let j = 0; j < ol.length; j++) {
            if (total > 100) {
              break;
            }
            let oskuD = ol[j]
            if (oskuD.skuId != skuId) {
              dItem.list.push({
                skuId: oskuD.skuId,
                deliverType: deliverType,
              })
            }
          }
          arr.push(dItem)
        }
      }
    } else {
      arr.push({
        y: y,
        m: m,
        d: d,
        list: [{
          skuId: skuId,
          deliverType: deliverType,
        }]
      })
    }
    browsingHistory = arr;
    let jsonString1 = encodeURIComponent(JSON.stringify(browsingHistory))
    if (store.state.webtype == '1') {
      appLocalstorage
      .set({
        key: "browsingHistory",
        value: jsonString1,
        isPublic: true,
      })
      .then((res) => {
      });
    } else {
      bridgefunc.setItem('browsingHistory', jsonString1, () => {
      })
    }
  },
  // 添加浏览记录
  pushBrowsingHistory: function (skuId, deliverType) {
    if (skuId == '') {
      return
    }
    console.log('kkkkkkkkkk', store.state.webtype)
    if (store.state.webtype == '2' || store.state.webtype == '3') {
      bridgefunc.getItem('browsingHistory', (result) => {
        this.commonLocalStorage(skuId, deliverType, result)
      })
    } else {
      appLocalstorage
      .get({
        key: "browsingHistory",
        isPublic: true,
      })
      .then((res) => {
        this.commonLocalStorage(skuId, deliverType, res)
      });
    }
    // let curTime = store.state.severTime.currentTime
    // let cDate = new Date(curTime * 1000);
    // let y = cDate.getFullYear(), m = cDate.getMonth() + 1, d = cDate.getDate();

    // let arr = []
    // let total = 0
    // let browsingHistory = [];
    // bridgefunc.getItem('browsingHistory', (result) => {
    //   if (!result || result == '' || result == 'null' || result == undefined) {

    //   } else {
    //     let jsonString = result;
    //     let jsonData = JSON.parse(decodeURIComponent(jsonString))
    //     browsingHistory = jsonData
    //   }

    //   if (browsingHistory.length > 0) {
    //     let fitem = browsingHistory[0]
    //     if (y == fitem.y && m == fitem.m && d == fitem.d) {
    //       total++;
    //       for (let i = 0; i < browsingHistory.length; i++) {
    //         if (total > 100) {
    //           break;
    //         }
    //         let odItem = browsingHistory[i];
    //         let dItem = {
    //           y: odItem.y,
    //           m: odItem.m,
    //           d: odItem.d,
    //           list: []
    //         };
    //         if (i == 0) {
    //           dItem.list.push({
    //             skuId: skuId,
    //             deliverType: deliverType,
    //           })
    //         }
    //         let ol = odItem.list;
    //         for (let j = 0; j < ol.length; j++) {
    //           if (total > 100) {
    //             break;
    //           }
    //           let oskuD = ol[j]
    //           if (oskuD.skuId != skuId) {
    //             dItem.list.push(oskuD)
    //             total++;
    //           }
    //         }
    //         arr.push(dItem)
    //       }
    //     } else {
    //       arr.push({
    //         y: y,
    //         m: m,
    //         d: d,
    //         list: [{
    //           skuId: skuId,
    //           deliverType: deliverType,
    //         }]
    //       })
    //       total++;
    //       for (let i = 0; i < browsingHistory.length; i++) {
    //         if (total > 100) {
    //           break;
    //         }
    //         let odItem = browsingHistory[i];
    //         let dItem = {
    //           y: odItem.y,
    //           m: odItem.m,
    //           d: odItem.d,
    //           list: []
    //         };
    //         let ol = odItem.list;
    //         for (let j = 0; j < ol.length; j++) {
    //           if (total > 100) {
    //             break;
    //           }
    //           let oskuD = ol[j]
    //           if (oskuD.skuId != skuId) {
    //             dItem.list.push({
    //               skuId: oskuD.skuId,
    //               deliverType: deliverType,
    //             })
    //           }
    //         }
    //         arr.push(dItem)
    //       }
    //     }
    //   } else {
    //     arr.push({
    //       y: y,
    //       m: m,
    //       d: d,
    //       list: [{
    //         skuId: skuId,
    //         deliverType: deliverType,
    //       }]
    //     })
    //   }
    //   browsingHistory = arr;
    //   let jsonString1 = encodeURIComponent(JSON.stringify(browsingHistory))
    //   bridgefunc.setItem('browsingHistory', jsonString1, () => {
    //   })
    // })
  },
  nearAddress: function (callBack, locationinfo) {
    let url = 'https://api.map.baidu.com/place/v2/search?query='+'楼$座$门$区$村$栋$店$馆$厅'+'&radius=3000&output=json&page_size=1&ak='+Config.mapak+'&location='+locationinfo.latitude+','+locationinfo.longitude;
    console.log(url)
    jsonp(url, null, (err, data) => {
      if (err) {
        console.log(err)
        Toast('获取具体定位失败')
      } else {
        console.log(data.results)
        if (data.results.length > 0) {
          let location = data.results[0]
          let locationinfo = {
            province: location.province,
            city: location.city,
            district: location.area,
            longitude: location.location.lng,
            latitude: location.location.lat,
            address: location.address + location.name,
            name: location.name
          }
          if (location.city == location.province) {
            locationinfo.city = location.area
            locationinfo.district = ''
          }
          this.pureLocationAnalysis(callBack, locationinfo)
        }
      }
    })
  },
  pureLocationAnalysis: function (callBack, locationinfo) {
    let address = {
      id: '',
      provinceId: '',
      provinceName: '',
      cityId: '',
      cityName: '',
      countryId: '',
      countryName: '',
      townId: '',
      townName: '',
      posx: locationinfo.longitude,
      posy: locationinfo.latitude,
      address: locationinfo.address,
      area: locationinfo.name
    }
    let url = '/app/json/area/loadAddresByDetail';
    let province = '';
    if (locationinfo.province.indexOf("省") != -1 || locationinfo.province.indexOf("市") != -1) {
      province = locationinfo.province.substring(0, locationinfo.province.length - 1);
    } else {
      province = locationinfo.province
    }
    let city = '';
    if (locationinfo.city.indexOf("区") != -1 || locationinfo.city.indexOf("市") != -1) {
      city = locationinfo.city.substring(0, locationinfo.city.length - 1);
    } else {
      city = locationinfo.city
    }
    let arr = ['1_' + province, '2_' + city];
    if (locationinfo.district) {
      arr.push('3_' + locationinfo.district);
    }
    let paramsData = {
      areaDetail: arr
    };
    http.post(url, paramsData).then(
      res => {
        let data = res.data;
        if (data.status == 0) {
          let resAddress = data.data
          if (resAddress.length < 2) {
            return;
          }
          address.id = '';
          for (let i = 0; i < resAddress.length; i++) {
            let item = resAddress[i]
            if (item.level == 1) {
              address.provinceId = item.id
              address.provinceName = item.name
            } else if (item.level == 2) {
              address.cityId = item.id
              address.cityName = item.name
            } else if (item.level == 3) {
              address.countryId = item.id
              address.countryName = item.name
            } else if (item.level == 4) {
              address.townId = item.id
              address.townName = item.name
            }
          }
          if (callBack) {
            callBack(address);
          }
          return;
        } else {
          if (callBack) {
            callBack(address);
          }
        }
      },
      error => {
        if (callBack) {
          callBack(address);
        }
      }
    );
  },
  addressAnalysis: function (callBack, locationinfo) {
    /*  if (that.$store.state.mall2.selectAddress.id > 0) {
        return ;
      } */
    if(!locationinfo){
      if (callBack) {
        callBack(false);
      }
      return;
    }
    let url = '/app/json/area/loadAddresByDetail';
    let province = '';
    if (locationinfo.province.indexOf("省") != -1 || locationinfo.province.indexOf("市") != -1) {
      province = locationinfo.province.substring(0, locationinfo.province.length - 1);
    } else {
      province = locationinfo.province
    }
    let city = '';
    if (locationinfo.city.indexOf("区") != -1 || locationinfo.city.indexOf("市") != -1) {
      city = locationinfo.city.substring(0, locationinfo.city.length - 1);
    } else {
      city = locationinfo.city
    }
    let arr = ['1_' + province, '2_' + city];
    if (locationinfo.district) {
      arr.push('3_' + locationinfo.district);
    }
    let paramsData = {
      areaDetail: arr
    };
    http.post(url, paramsData).then(
      res => {
        let data = res.data;
        if (data.status == 0) {
          let resAddress = data.data
          if (resAddress.length < 2) {
            return;
          }
          let address = {
            provinceId: '',
            provinceName: '',
            cityId: '',
            cityName: '',
            countryId: '',
            countryName: '',
            townId: '',
            townName: ''
          }
          address.id = '-1';
          for (let i = 0; i < resAddress.length; i++) {
            let item = resAddress[i]
            if (item.level == 1) {
              address.provinceId = item.id
              // store.state.indexData.provinceId = item.id
              address.provinceName = item.name
            } else if (item.level == 2) {
              address.cityId = item.id
              // store.state.indexData.cityId = item.id
              address.cityName = item.name
            } else if (item.level == 3) {
              address.countryId = item.id
              address.countryName = item.name
            } else if (item.level == 4) {
              address.townId = item.id
              address.townName = item.name
            }
          }
          if (store.state.mall2.selectAddress.id > 1) {
            if (callBack) {
              callBack(true, address);
            }
            return;
          }
          address.addressFull = address.provinceName + address.cityName + address.countryName + address.townName
          store.state.mall2.selectAddress = address;
          bridgefunc.vuexStorage();
          if (callBack) {
            callBack(true, address);
          }
        } else {
          if (callBack) {
            callBack(false);
          }
        }
      },
      error => {
        if (callBack) {
          callBack(false);
        }
      }
    );
  },
  //是否存在未满足的活动
  isExistCanNotAttendActivity:function (occur, showToast = false) {
    for (let i = 0; i < occur.length; i++) {
      let occurItem = occur[i];
      for (let j = 0; j < occurItem.store.length; j++) {
        let storeItem = occurItem.store[j];
        for (let k = 0; k < storeItem.noActivityCart.length; k++) {
          let noActivityCartItem = storeItem.noActivityCart[k];

          if(noActivityCartItem.canNotAttendActivity && noActivityCartItem.canNotAttendActivity.length){
            if (showToast) {
              Toast({message:'部分商品不能参加活动，将按原价购买',duration:2500});
            }
            return true;
          }
        }
      }
    }
    return false;
  },
  accTypeToName: function (accType, subType = null) {
    let digitalAccountList = store.state.globalConfig.acctList
    
    for (let i = 0; i < digitalAccountList.length; i++) { // 变量主账号
      let accItem =  digitalAccountList[i]
      if (accItem.acctType == accType) { // 主账号acctype 跟 传入的 匹配
        let subAccount = accItem.subAccount
        if (subType && subAccount && subAccount.length > 0) { // 如果存在子账号，并且传入的subType 不为空，继续变量子账号 名称
          for (let j = 0; j < subAccount.length; j++) {
            let subItem = subAccount[j]
            if (subItem.dictAlias == subType) {
              return subItem.dictValue
            }
          }
        }

        return accItem.displayName
      }
    }

    return '没有匹配到名称'
  },
  getOccurShowPrice:function(occurData){
    if(occurData.payAmount > 0){
      return true;
    }
    let isHasVartualMoney = false;
    for (let i = 0; i < occurData.digitalList.length; i++) {
      let digital = occurData.digitalList[i];
      let value = this.getTotalUsePoints(digital);
      if(value){
        isHasVartualMoney = true;
        break;
      }
    }
    return !isHasVartualMoney;
  },
  getFirstVartualIndex:function(occurData){
    for (let i = 0; i < occurData.digitalList.length; i++) {
      let digital = occurData.digitalList[i];
      let value = this.getTotalUsePoints(digital);
      if(value){
        return i;
      }
    }
    return -1;
  },
  getTotalUsePoints: function (digital) {
    let points = 0;
    //固定的积分商品  或 使用积分抵扣
    if (digital.payDigital > digital.fixedDigital) {
      points = digital.userCanUseDigital + digital.fixedDigital;
    } else {
      points = digital.fixedDigital;
    }
    return points;
  },
  getTotalUnitStr: function (acctType) {
    let arr = store.state.globalConfig.acctList;
    for (let i = 0; i < arr.length; i++) {
      let item = arr[i];
      if (item.acctType == acctType) {
        return item.displayName;
      }
    }
    return "积分";
  },
// 根据自提点的id去得到自提点
  getSysStoreById: function (pickupId, callback) {
    let url = '/app/json/user_address/getSysStoreById';
    let paramsData = {
      id: pickupId
    };
    http.post(url, paramsData).then(
      res => {
        let data = res.data;
        if (data.status == 0) {
          // this.$store.state.mall2.zitiAddress = ;
          if (callback) {
            callback(data.data)
          }
        } else {
          Toast(data.info);
        }
      },
      error => {
        Toast('请求数据失败！')
      }
    );
  },
}

export default mallCommon
