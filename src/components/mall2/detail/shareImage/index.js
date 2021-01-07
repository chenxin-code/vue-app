/**
 * Created by LiRui on 2019/8/5.
 */
import Vue from 'vue'
import Share from './share-image'
import router from '@/router'
import store from '@/vuex/store'

let instance

const initInstance = () => {
  instance = new (Vue.extend({router, store, ...Share}))()
  instance.$mount()
  document.getElementById('app').appendChild(instance.$el);
}

export default {
  show(options = {}) {
    if (!instance) {
      initInstance()
    }
    if (options) {
      instance.proData = options.proData
      instance.$mount()
    }
    instance.visible = true
  },
  hide() {
    if (instance) {
      instance.visible = false
      instance.$nextTick(() => {
        // document.getElementById('app').removeChild(instance.$el);
      })
    }
  }
}
