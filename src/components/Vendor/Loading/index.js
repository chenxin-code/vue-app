import Vue from 'vue';
import store from '@/vuex/store'
import load from './src/STLoading'
const Loading = Vue.extend(load);
let instance;
let loadingsArr = [];
export default {
  open(options = {}) {
    // 请注意，在实例化extends组件构造器时，传入属性必须是propsData、而不是props哦
    if (!instance) {
      instance = new Loading({store});
    }
    loadingsArr.push('loading');
    if (instance.visible) return;
    instance.$mount();
    document.body.appendChild(instance.$el);
    Vue.nextTick(() => {
      instance.visible = true;
    });
  },

  close() {
    if(loadingsArr.length > 0){
      loadingsArr.pop();
    }
    if (instance && loadingsArr.length == 0 ) {
      instance.visible = false;
    }
  }
};
