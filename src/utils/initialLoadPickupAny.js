/**
 * Created by liaoyingchao on 2019/03/01.
 */

import bridgefunc from './bridgefunc'
import store from "../vuex/store";
import http from './http'
import MessageBox from '@/components/Vendor/messagebox/index';
import userCenter from "../components/usercenter/js/userCenter";
import util from './util'
// 第一次加载自提商品或者购物车等等，我们需要判断500米内是否有自提点，如果有弹出提示切换
const initialLoadPickupAny = {
  checkIsInitialLoad: function (callback) {
    if (store.state.globalConfig.app_home_special_flag == 'cnooc') {
      callback()
      return ;
    }
    if (store.state.mall2.pickupAddressChecked == false) {
      store.state.mall2.pickupAddressChecked = true
      bridgefunc.vuexStorage()
      initialLoadPickupAny.getLocation(callback)
    } else {
      callback(null)
    }
  },
  getLocation: function (callback) {
    bridgefunc.getLocation((locationinfo)=>{
      //城市不为空的情况下
      if (locationinfo.city && locationinfo.city != '') {
        // let tempLocDic = util.bd_decrypt(locationinfo.longitude,locationinfo.latitude);
        store.state.currentLocation.posx = locationinfo.longitude;
        store.state.currentLocation.posy = locationinfo.latitude;

        initialLoadPickupAny.loadNeerPickupAddress(callback)
      } else {
        callback(null)
      }
    });
  },
  loadNeerPickupAddress: function (callback) {
    let url = '/app/json/user_address/searchSelfliftAddressList';
    let params1 = {
      posx: store.state.currentLocation.posx,
      posy: store.state.currentLocation.posy,
      // token: store.state.login.token,
      page: {
        index: 1,
        pageSize: 1
      }
    }
    http.post(url, params1).then(res => {
      let data = res.data;
      console.log('自提站点列表:', data);
      if (data.status == 0) {
        if (data.data && data.data.length > 0) {
          let address = data.data[0]
          initialLoadPickupAny.checkEqualAndDistance(address, callback)
        } else {
          callback(null)
        }
      } else {
        callback(null)
      }
    }, error => {
      callback(null)
      console.log('自提站点', error);
    });
  },
  checkEqualAndDistance: function (address, callback) {
    if (address.id != store.state.mall2.zitiAddress.id && address.distance < 500) {
      MessageBox.confirm('距离您最近的自提点是：' + address.storeName + ',是否切换到最近自提点', '提示').then(action => {
        console.log(action);
        initialLoadPickupAny.reSelectPickupAddress(address, callback)
      }).catch(action => {
        callback(null)
      });
    } else {
      callback(null)
    }
  },
  reSelectPickupAddress: function (address, callback) {
    store.state.mall2.zitiAddress = address;
    bridgefunc.vuexStorage(() => {
      callback(address)
    })
    if (store.state.login.token && store.state.login.token != '') {
      userCenter._addToMyPickupAddress(address.id)
      userCenter._setDefaultPickupAddress(address.id)
    }
  }
};
export default initialLoadPickupAny
