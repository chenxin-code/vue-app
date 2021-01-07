/**
 * Created by steven on 2018/7/12.
 */
import store from '../vuex/store'
import Http from './http'
import bridge from './bridgefunc'
import config from '../../src/api/config'
let  Version = {
  detectVersion: function (callBack) {
    let url = '/app/json/home/vueVersionGet?ver='+ (new Date).getTime();

    Http.get(url).then(res => {
        let versionInfo = res.data.data;
        if(store.state.version != versionInfo.version){
          let isForce = this._getIsNeedForce(versionInfo.forceversion);
          let downDic = {};
          downDic.downurl = versionInfo.downurl;
          downDic.version = versionInfo.version;
          downDic.isForce = isForce;
          bridge.downloadZip(downDic,function () {
            store.state.version = versionInfo.version;
            bridge.vuexStorage(function () {
              bridge.reloadWeb();
            });
          });
        }
        if (callBack){
          callBack();
        }
      },
      err => {
        if (callBack){
          callBack();
        }
      }
    )
  },
  _getIsNeedForce:function (forceversion) {
    let nowVArr = store.state.version.split('.');
    let forceArr = forceversion.split('.');
    let minLen = nowVArr.length < forceArr.length ? nowVArr.length : forceArr.length;
    let isForce = '0';
    for(let i = 0; i < minLen; i ++){
      let tempNow = nowVArr[i];
      let tempForce = forceArr[i];
      if(tempForce > tempNow){
        isForce = '1';
        break;
      }
    }
    return isForce;
  }
}

export default Version
