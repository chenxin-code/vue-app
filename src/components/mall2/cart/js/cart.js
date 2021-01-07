import Vue from 'vue'
import util from '../../../../utils/util'
import store from "../../../../vuex/store";
import market from "../../../../utils/market";

let cart = {
  getTopArr: function () {
    let arr = [
      {
        name: '配送',
        type: 2,
        hasShow: false,
        class: 'mall-peisong',
        occurArr: []
      },
      {
        name: '自提',
        type: 1,
        hasShow: false,
        class: 'mall-ziti',
        occurArr: []
      },
    ];

    if (store.state.globalConfig.app_home_special_flag == 'cnooc') {
      let dt = market.returnCnoocDeliveryType()
      if (dt == '2' || dt == '') {
        store.state.mall2.staticDeliverType = 2
        arr = [{
          name: '配送',
          type: 2,
          hasShow: false,
          class: 'mall-peisong',
          occurArr: []
        }];
      }
    }
    // if (store.state.globalConfig.delivertype_default == '1') {
    //   arr = [{
    //     name: '自提',
    //     type: 1,
    //     hasShow: false,
    //     class: 'mall-ziti',
    //     occurArr: []
    //   }];
    // } else if (store.state.globalConfig.delivertype_default == '2') {
    //   arr = [{
    //     name: '配送',
    //     type: 2,
    //     hasShow: false,
    //     class: 'mall-peisong',
    //     occurArr: []
    //   }];
    // }
    return arr;
  },

  dealCartList: function (arr) {
    for (let i = 0; i < arr.length; i++) {
      let occuritem = arr[i];
      occuritem.checked = true;

      for (let j = 0; j < occuritem.store.length; j++) {
        let storeitem = occuritem.store[j];
        storeitem.checked = this.judgeStoreIsSel(storeitem, false);
        if (!storeitem.checked) {
          occuritem.checked = false;
        }
        //接下来计算 每个活动的勾选的数目
        let activitys = storeitem.activity;
        for(let k = 0; k < activitys.length; k++ ){
          let activityItem = activitys[k];
          activityItem.number = this.getActivityNum(activityItem);
        }
      }
    }

    return arr;
  },
  getActivityNum:function(activityItem){
    let num = 0;
    for(let k = 0; k < activityItem.cart.length; k++ ){
      let cartItem = activityItem.cart[k];
      if(cartItem.isGift == 0 && cartItem.checked == 1){
        num += cartItem.number;
      }
    }
    return num;
  },
  judgeStoreIsSel: function (storeitem, isEditing) {
    let checkKey = this.getCheckKey(isEditing);

    for (let activityIndex = 0; activityIndex < storeitem.activity.length; activityIndex++) {
      let activityitem = storeitem.activity[activityIndex];
      for (let cartIndex = 0; cartIndex < activityitem.cart.length; cartIndex++) {
        let cartitem = activityitem.cart[cartIndex];
        if (!cartitem[checkKey]) {
          return false;
        }
      }
    }

    for (let activityIndex = 0; activityIndex < storeitem.noActivityCart.length; activityIndex++) {
      let cartitem = storeitem.noActivityCart[activityIndex];
      if (!cartitem[checkKey]) {
        return false;
      }
    }

    return true;

  },
  getItemAmount: function (amount, index) {
    let str = util.toDecimal2(amount)
    let arr = str.split('.')
    if (arr.length > index) {
      return arr[index]
    } else {
      return '00'
    }
    // if (amount) {
    //   let money = amount + '';
    //   let arr = [];
    //   if (money) {
    //     arr = money.split(".");
    //   }
    //   if (arr.length > index) {
    //     return arr[index]
    //   } else {
    //     return '00'
    //   }
    // } else {
    //   return '00'
    // }
  },

  getXZClass: function (isEditing, checked, dchecked) {
    if (isEditing) {
      if (dchecked) {
        return 'mall-xuanzhong theme_standard_font'
      } else {
        return 'mall-weixuanzhong theme_font_gray'
      }
    } else {
      if (checked) {
        return 'mall-xuanzhong theme_standard_font'
      } else {
        return 'mall-weixuanzhong theme_font_gray'
      }
    }
    return '';

  },
  getOccClass: function (isEditing, checked, dchecked) {
    if (isEditing) {
      if (dchecked) {
        return 'mall-xuanzhong theme_standard_font'
      } else {
        return 'mall-weixuanzhong theme_font_gray'
      }
    } else {
      if (checked) {
        return 'mall-xuanzhong theme_standard_font'
      } else {
        return 'mall-weixuanzhong theme_font_gray'
      }
    }
    return '';
  },
  setAllUnSel: function (arr) {
    for (let i = 0; i < arr.length; i++) {
      let occuritem = arr[i];
      Vue.set(occuritem, 'dchecked', false)
      for (let j = 0; j < occuritem.store.length; j++) {
        let storeitem = occuritem.store[j];
        Vue.set(storeitem, 'dchecked', false)

        for (let activityIndex = 0; activityIndex < storeitem.activity.length; activityIndex++) {
          let activityitem = storeitem.activity[activityIndex];
          for (let cartIndex = 0; cartIndex < activityitem.cart.length; cartIndex++) {
            let cartitem = activityitem.cart[cartIndex];
            Vue.set(cartitem, 'dchecked', false)
          }
        }
        for (let activityIndex = 0; activityIndex < storeitem.noActivityCart.length; activityIndex++) {
          let cartitem = storeitem.noActivityCart[activityIndex];
          Vue.set(cartitem, 'dchecked', false)
        }
      }
    }
    return arr;
  },

  setOccSel: function (occuritem, isEditing) {
    let checkKey = this.getCheckKey(isEditing);
    occuritem[checkKey] = !occuritem[checkKey];

    for (let j = 0; j < occuritem.store.length; j++) {
      let storeitem = occuritem.store[j];
      this.setStoreSel(storeitem, isEditing, occuritem[checkKey])
    }
  },
  setStoreSel: function (storeitem, isEditing, isSel, occuritem) {
    let checkKey = this.getCheckKey(isEditing);

    if (isSel == undefined) {
      isSel = !storeitem[checkKey];
    }
    storeitem[checkKey] = isSel;
    for (let activityIndex = 0; activityIndex < storeitem.activity.length; activityIndex++) {
      let activityitem = storeitem.activity[activityIndex];
      for (let cartIndex = 0; cartIndex < activityitem.cart.length; cartIndex++) {
        let cartitem = activityitem.cart[cartIndex];
        cartitem[checkKey] = isSel;
      }
    }
    for (let activityIndex = 0; activityIndex < storeitem.noActivityCart.length; activityIndex++) {
      let cartitem = storeitem.noActivityCart[activityIndex];
      cartitem[checkKey] = isSel;
    }
    //如果有occ 说明要向上检测
    if (occuritem) {
      this.resetOccurItem(occuritem, isEditing, isSel)
    }
  },
  resetOccurItem: function (occuritem, isEditing, isSel) {
    let checkKey = this.getCheckKey(isEditing);

    let occSel = true;
    if (isSel) {
      for (let j = 0; j < occuritem.store.length; j++) {
        let storeitem = occuritem.store[j];
        let isStoreSel = storeitem[checkKey];

        if (!isStoreSel) {
          occSel = false;
          break;
        }
      }

    } else {
      occSel = false;
    }
    occuritem[checkKey] = occSel;

  },
  setCartSel: function (cartitem, isEditing, storeitem, occuritem) {
    let checkKey = this.getCheckKey(isEditing);
    cartitem[checkKey] = !cartitem[checkKey];

    let isStoreSel = true;
    if (cartitem[checkKey]) {
      isStoreSel = this.judgeStoreIsSel(storeitem, isEditing);
    } else {
      isStoreSel = false;
    }
    storeitem[checkKey] = isStoreSel;
    this.resetOccurItem(occuritem, isEditing, isStoreSel);
  },

  getPayNum: function (occuritem, isEditing) {
    if (isEditing) {
      return 0;
    } else {
      let checkKey = this.getCheckKey(isEditing);
      let num = 0;
      for (let j = 0; j < occuritem.store.length; j++) {
        let storeitem = occuritem.store[j];
        for (let activityIndex = 0; activityIndex < storeitem.activity.length; activityIndex++) {
          let activityitem = storeitem.activity[activityIndex];
          for (let cartIndex = 0; cartIndex < activityitem.cart.length; cartIndex++) {
            let cartitem = activityitem.cart[cartIndex];
            if (cartitem[checkKey] && cartitem.isGift == '0') {
              num += cartitem.number;
            }
          }
        }
        for (let activityIndex = 0; activityIndex < storeitem.noActivityCart.length; activityIndex++) {
          let cartitem = storeitem.noActivityCart[activityIndex];
          if (cartitem[checkKey]) {
            num += cartitem.number;
          }
        }
      }
      return num;
    }
  },
  getCheckKey: function (isEditing) {
    if (isEditing) {
      return 'dchecked';
    } else {
      return 'checked';
    }
  },

  ///获取收单机构下 所有的项目
  getSelOccur: function (occuritem, isEditing, type) {
    let checkKey = this.getCheckKey(isEditing);

    let selArr = [];
    for (let j = 0; j < occuritem.store.length; j++) {
      let storeitem = occuritem.store[j];
      let arr = this.getSelStore(storeitem, isEditing, type);
      selArr = selArr.concat(arr);
    }
    if (type == 'update') {
      for (let i = 0; i < selArr.length; i++) {
        let item = selArr[i];
        item.checked = occuritem.checked?0:1;
      }
    }
    return selArr;
  },
//获取所有商铺下面商品的集合
  getSelStore: function (storeitem, isEditing, type) {
    let checkKey = this.getCheckKey(isEditing);

    let selArr = [];
    for (let activityIndex = 0; activityIndex < storeitem.activity.length; activityIndex++) {
      let activityitem = storeitem.activity[activityIndex];
      for (let cartIndex = 0; cartIndex < activityitem.cart.length; cartIndex++) {
        let cartitem = activityitem.cart[cartIndex];
        //更新要是所有
        if (cartitem[checkKey] || type == 'update') {
          selArr.push(this.revertCartitemToDic(cartitem, type,storeitem));
        }
      }
    }
    for (let activityIndex = 0; activityIndex < storeitem.noActivityCart.length; activityIndex++) {
      let cartitem = storeitem.noActivityCart[activityIndex];
      //更新要是所有
      if (cartitem[checkKey] || type == 'update') {
        selArr.push(this.revertCartitemToDic(cartitem, type,storeitem));
      }
    }

    return selArr;
  },
  //获取所有失效的集合
  getInvalidArr:function(arr){
    let selArr = [];
    for (let index = 0; index < arr.length; index++) {
      let cartitem = arr[index];
      selArr.push(this.revertCartitemToDic(cartitem, 'delete'));
    }
    return selArr;
  },
  revertCartitemToDic: function (cartitem, type, storeitem) {
    let dic = {};
    if (type == 'update') {
      dic = {
        skuId: cartitem.skuId,
        storeOuCode: cartitem.storeOuCode,
        checked: storeitem.checked ? 0 : 1,
        activityId:cartitem.activityId,
        isGift:cartitem.isGift
      }
      if (cartitem.currentSelfActivity && cartitem.currentSelfActivity != '' && cartitem.currentSelfActivity.mktActivityId && cartitem.currentSelfActivity.mktActivityId != '') {
        dic.selfActivityId = cartitem.currentSelfActivity.mktActivityId
      }
    } else if (type == 'pay') {
      dic = {
        id:cartitem.id,
        skuId: cartitem.skuId,
        storeOuCode: cartitem.storeOuCode,
        number:cartitem.number,
        activityId:cartitem.activityId,
        checked:cartitem.checked,
        isGift:cartitem.isGift
      }
      if (cartitem.currentSelfActivity && cartitem.currentSelfActivity != '' && cartitem.currentSelfActivity.mktActivityId && cartitem.currentSelfActivity.mktActivityId != '') {
        dic.selfActivityId = cartitem.currentSelfActivity.mktActivityId
      }
      // 特定处理，不参加活动的时候，的时候需要传-2
      if (cartitem.currentSelfActivity != null && cartitem.currentSelfActivity == '' && cartitem.selfActivity && cartitem.selfActivity != '' && cartitem.selfActivity.length > 0) {
        dic.selfActivityId = '-2'
      }
    }else if (type == 'delete') {
      dic = {
        skuId: cartitem.skuId,
        storeOuCode: cartitem.storeOuCode,
        isGift:cartitem.isGift,
        activityId:cartitem.activityId,
      }
    }
    return dic
  },

  // linkType  1去凑单  2再逛逛 3领赠品 4去换购  5赠品未满足  6换购未满足
  getActivityRightTitle:function (activityitem) {
    //没有完成条件
    if(activityitem.linkType == 1 || activityitem.linkType == 5 ||activityitem.linkType == 6){
      return '去凑单'
    }else if(activityitem.linkType == 2){
      return '再逛逛'
    }else if(activityitem.linkType == 3){
      let isHasGift = false;
      for(let i = 0; i < activityitem.cart.length; i++){
        let cartItem = activityitem.cart[i];
        if(cartItem.isGift == 1 ){
          isHasGift = true;
          break;
        }
      }
      if(isHasGift){
        return '重新领取';
      }else {
        return '领赠品';
      }
    }else if(activityitem.linkType == 4){
      let isHasHG = false;
      for(let i = 0; i < activityitem.cart.length; i++){
        let cartItem = activityitem.cart[i];
        if(cartItem.isGift == 2){
          isHasHG = true;
          break;
        }
      }
      if(isHasHG){
        return '重新领取';
      }else {
        return '去换购';
      }
    }
    //  什么也不显示
    return '再逛逛';
  },

  getGiftIsOnlyScan:function (activityInfo) {
    let isScan = true;
    //3选赠品  4选换购   这两个值 表示满足了条件
    if(activityInfo.linkType == 3 || activityInfo.linkType == 4){
      isScan = false;
    }
    return isScan;
  },
  getGiftType:function (activityInfo) {
    //1赠品  2换购
    let giftType = 1;
    if(activityInfo.linkType == 4 || activityInfo.linkType == 6){
      giftType = 2;
    }
    return giftType;
  }
}

export default cart
