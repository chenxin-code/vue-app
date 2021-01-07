/**
 * Created by steven on 2019/1/11.
 */
import Vue from 'vue';
import exchangepop from './exchange-pop'
const ExchangePop = Vue.extend(exchangepop);
let instance;
export default {
  open(options = {}) {

    // 请注意，在实例化extends组件构造器时，传入属性必须是propsData、而不是props哦
    // if (!instance) {
      instance = new ExchangePop();
    // }
    instance.exchangeData = options.exchangeData;
    instance.sureEvent = options.sureEvent ? options.sureEvent : function () {
      console.log('sure event!')
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
