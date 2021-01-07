/**
 * Created by steven on 2019/1/18.
 */
import Vue from 'vue';
import AdvertisementClass from './Advertisement'
const Advertisement = Vue.extend(AdvertisementClass);
let instance;

export default {
  open(options = {}) {

    if (!instance) {
      instance = new Advertisement();
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
      // delete  instance;
    }
  }
};
