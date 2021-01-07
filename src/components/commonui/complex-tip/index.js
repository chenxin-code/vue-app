import Vue from 'vue';
import complextip from './complex-tip'
const ComplexTip = Vue.extend(complextip);
let instance;
export default {
  open(options = {}) {

    // 请注意，在实例化extends组件构造器时，传入属性必须是propsData、而不是props哦
    if (!instance) {
      instance = new ComplexTip();
    }
    instance.complexData = options.complexData;
    if (instance.visible) return;
    instance.$mount();
    document.body.appendChild(instance.$el);
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
