/**
 * Created by steven on 2019/1/11.
 */
import Vue from 'vue';
import vertify from './common-verify'
const Vertify = Vue.extend(vertify);
let instance;
export default {
  open(options = {}) {

    // 请注意，在实例化extends组件构造器时，传入属性必须是propsData、而不是props哦
    // if (!instance) {
      instance = new Vertify();
    // }
    instance.paras = options.paras;
    instance.type = options.type;
    instance.sureFunc = options.sureFunc;
    instance.vertifyCancelEvent = options.vertifyCancelEvent;

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
