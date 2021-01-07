import Vue from 'vue';
import DatetimePicker from './datetime-picker'
const datetimepicker = Vue.extend(DatetimePicker);
let instance;
export default {
  open(options = {}) {

    // 请注意，在实例化extends组件构造器时，传入属性必须是propsData、而不是props哦
    if (!instance) {
      instance = new datetimepicker();
    }
    instance.options = options;
    instance.selectedDateTime = options.selectedDateTime || function () {
      console.log('没有传入回调函数')
    }
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
