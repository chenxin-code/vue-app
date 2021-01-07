import Vue from 'vue';
import photo from './choosePhoto'
const choosPhoto = Vue.extend(photo);
let instance;
export default {
  open(options = {}) {

    // 请注意，在实例化extends组件构造器时，传入属性必须是propsData、而不是props哦
    if (!instance) {
      instance = new choosPhoto();
    }
    instance.linkFunc = options.linkFunc;
    instance.token = options.token;
    instance.type = options.type;
    if (instance.visible) return;
    instance.$mount();
    document.body.appendChild(instance.$el);
    Vue.nextTick(() => {
      instance.visible = true;
    });
  },
  upload(options = {}) {

    // 请注意，在实例化extends组件构造器时，传入属性必须是propsData、而不是props哦
    if (!instance) {
      instance = new choosPhoto();
    }
    instance.linkFunc = options.linkFunc;
    instance.token = options.token;
    instance.type = options.type;
    instance.updateImg(options.imgData);
  },

  close() {
    if (instance) {
      instance.visible = false;
    }
  }
};
