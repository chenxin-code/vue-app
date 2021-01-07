/**
 * Created by steven on 2018/11/12.
 */
import Vue from 'vue';
import giftlist from './giftlist'
const GiftList = Vue.extend(giftlist);

let instance;
export default {
  open(options = {}) {
    // 请注意，在实例化extends组件构造器时，传入属性必须是propsData、而不是props哦
    if (!instance) {
      instance = new GiftList();
    }
    instance.listData = options.listData;
    instance.activityId = options.activityId;
    instance.sureFunc = options.sureFunc;
    instance.isScan = options.isScan?options.isScan:false;
    //默认1 是满赠
    instance.giftType = options.giftType?options.giftType:1;
    if (instance.visible) return;
    instance.$mount();
    document.getElementById('app').appendChild(instance.$el);
    Vue.nextTick(() => {
      instance.visible = true;
    });
  },

  close() {
    if (instance) {
      instance.visible = false;
    }
  }
};
