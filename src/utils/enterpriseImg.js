/**
 * Created by steven on 2019/7/25.
 */

import  store from '../vuex/store'
function  enterpriseImg(imgName){
  let provinceName = undefined;
  if(store.state.globalConfig.province == '海南省'){
    provinceName = 'hainan'
  }

  if(provinceName){
    let src = 'static/enterpriseImg/'+provinceName+'/'+imgName;
    return src;
  }else {
    return null;
  }
}

export  default enterpriseImg;
