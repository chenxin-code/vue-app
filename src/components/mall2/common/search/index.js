import Vue from 'vue';
import search from './search'
const Search = Vue.extend(search);

let instance;
export default {
  open(options = {}) {
    // 请注意，在实例化extends组件构造器时，传入属性必须是propsData、而不是props哦
    if (!instance) {
      instance = new Search();
    }
    instance.initData = options.initData;
    instance.searchEvent = options.searchEvent;
    instance.clearSearchHistory = options.clearSearchHistory;
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
