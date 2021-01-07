/**
 * Created by steven on 2019/5/28.
 */

import bridgefunc from './bridgefunc'
import store from "../vuex/store";

let queueArr = [];
const StorageQueue = {
  //存item
  setItem: function (key, value, callback) {
    queueArr.push({
      key: key,
      value: value,
      callback: callback,
      type: 'set'
    });
    if (queueArr.length == 1) {
      this.setItemOP(key, value, callback);
    }
  },

  setItemOP: function (key, value, callback) {
    let self = this;

    // 重写回调
    function reCallBack(result) {
      if (callback) {
        callback(result);
      }
      self.storageQueueOP();
    }

    let webtype = store.state.webtype;
    if (webtype == '1') {
      let jsonData = {};
      jsonData.type = 'storeitem'
      jsonData.key = key;
      jsonData.value = value;
      bridgefunc.callBridge('phonebridge', jsonData, reCallBack)

    } else {
      window.localStorage.setItem(key, value);
      if (reCallBack) {
        reCallBack();
      }
    }
  },

  getItem: function (key, callback) {
    queueArr.push({
      key: key,
      callback: callback,
      type: 'get'
    });
    if (queueArr.length == 1) {
      this.getItemOP(key, callback);
    }
  },

  getItemOP: function (key, callback) {
    let self = this;

    // 重写回调
    function reCallBack(result) {
      if (callback) {
        callback(result);
      }
      self.storageQueueOP();
    }

    let webtype = store.state.webtype;
    if (webtype == '1') {
      let jsonData = {};
      jsonData.type = 'getitem'
      jsonData.key = key;
      bridgefunc.callBridge('phonebridge', jsonData, reCallBack);
    } else {
      reCallBack(window.localStorage.getItem(key));
    }
  },

  storageQueueOP: function () {
    if (queueArr.length > 0) {
      queueArr.splice(0, 1);
      if (queueArr.length > 0) {
        let item = queueArr[0];
        if (item['type'] == 'get') {
          this.getItemOP(item['key'], item['callback']);
        } else if (item['type'] == 'set') {
          this.setItemOP(item['key'], item['value'], item['callback']);
        }
      }
    }
  },

};
export default StorageQueue
