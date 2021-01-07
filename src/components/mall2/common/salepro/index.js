/**
 * Created by steven on 2018/11/12.
 */
import Vue from 'vue';
import sales from './salepro'
const salespro = Vue.extend(sales);

let instance;
export default {
  open(options = {}) {
    // 请注意，在实例化extends组件构造器时，传入属性必须是propsData、而不是props哦
    if (!instance) {
      instance = new salespro();
    }
    instance.listData = options.listData;
    instance.sureFunc = options.sureFunc;
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
