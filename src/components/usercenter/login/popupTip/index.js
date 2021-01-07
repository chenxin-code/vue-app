import Vue from 'vue';
import popupTip from './popupTip'
const PopupTip = Vue.extend(popupTip);

let instance;
export default {
  open(options = {}) {
    console.log('options',options)
    instance = new PopupTip();
    instance.cancellationText = options.cancellationText;
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
