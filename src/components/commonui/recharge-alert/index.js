import Vue from 'vue';

import ralert from './src/recharge-alert'
const Alert = Vue.extend(ralert);
let instance;
export default {
  open(options = {}) {

    // 请注意，在实例化extends组件构造器时，传入属性必须是propsData、而不是props哦
    if (!instance) {
      instance = new Alert();

    }
    if (instance.visible) return;
    for(let key in options){
      instance[key] =options[key];
    }

    instance.$mount();
    document.body.appendChild(instance.$el);
    Vue.nextTick(() => {
      instance.visible = true;
    });
  },

  updateSureMsg(sureMsg){
    if (instance) {
      instance.suremsg = sureMsg
    }
  },
  updateSurebg(surebg){
    if (instance) {
      instance.surebg = surebg;
    }
  },
  changeDisabel(disabel){
    if (instance) {
      instance.disabel = disabel;
    }
  },

  close() {
    if (instance) {
      instance.visible = false;
    }
  }
};
