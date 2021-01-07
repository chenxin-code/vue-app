/**
 * Created by steven on 2019/1/11.
 */
import Vue from 'vue';
import scancoupon from './ScanCoupon'
const ScanCoupon = Vue.extend(scancoupon);
let instance;
export default {
  open(options = {}) {

    // 请注意，在实例化extends组件构造器时，传入属性必须是propsData、而不是props哦
    // if (!instance) {
      instance = new ScanCoupon();
    // }
    instance.couponCode = options.couponCode;
    instance.type = options.type;

    if (instance.visible) return;
    instance.$mount();
    document.body.appendChild(instance.$el);
    Vue.nextTick(() => {
      instance.open();
    });
  },

  close() {
    if (instance) {
      instance.visible = false;
      instance = null;
    }
  }
};
