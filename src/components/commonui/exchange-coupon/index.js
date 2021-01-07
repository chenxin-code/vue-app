/**
 * Created by steven on 2019/1/11.
 */
import Vue from 'vue';
import exchangecoupon from './exchange-coupon'
const ExchangeCoupon = Vue.extend(exchangecoupon);
let instance;
export default {
  open(options = {}) {

    // 请注意，在实例化extends组件构造器时，传入属性必须是propsData、而不是props哦
    // if (!instance) {
      instance = new ExchangeCoupon();
    // }
    instance.exchangeData = options.exchangeData;
    instance.exchangeSuccess = options.exchangeSuccess ? options.exchangeSuccess : function () {
      console.log('exchanges success!')
    };

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
