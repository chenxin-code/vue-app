import Vue from 'vue';

import ErrPage from './src/err-page'
const errPage = Vue.extend(ErrPage);
let instance;

let removeDom = event => {
  if (event.target.parentNode) {
    event.target.parentNode.removeChild(event.target);
  }
};

// pageType:
// noNav 没有顶部导航，不需要显示出上面的导航栏
// hasNav 没有顶部导航，不需要显示出上面的导航栏

// errType:
// NetError 网络错误
// NoProducts 没有商品列表
// NoAddress 没有地址列表
// NoCart    购物车没有列表
// NoOrder   没有订单


export default {
  open(options = {}) {

    if (!instance) {
      instance = new errPage();
    }
    instance.errType = options.errType ? options.errType : 'NetError';
    instance.pageType = options.pageType ? options.pageType : 'noNav';
    instance.btnCallBack = options.btnCallBack ? options.btnCallBack : function () {
      console.log('btnCallBack')
    };
    // if (instance.visible) return;
    instance.$mount();

    if (options.el){
      options.el.appendChild(instance.$el);
    } else {
      document.body.appendChild(instance.$el);
    }
    Vue.nextTick(() => {
      instance.visible = true;
    });
  },

  close() {
    if (instance) {
      instance.visible = false;
      // this.$el.removeDom();
    }
  }
};
