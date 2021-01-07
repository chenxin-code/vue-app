import Vue from 'vue';
import coupon from './coupon'
const Coupon = Vue.extend(coupon);

let instance;
export default {
  open(options = {}) {
    // 请注意，在实例化extends组件构造器时，传入属性必须是propsData、而不是props哦
    if (!instance) {
      instance = new Coupon();
    }
    instance.initData = options.initData;
    if (instance.initData.type == 'use') {
      instance.selectedCoupon = options.selectedCoupon;
      this.initCouponList(instance.initData.userCanUseCoupon, instance.initData.freightCoupon, instance.initData.userCanUseWhenNotSelectCoupon)
    } else {
      instance.getedCoupon = options.getedCoupon;
      instance.couponProducts = options.couponProducts;
    }
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
  },
  initCouponList: function (userCanUseCoupon, freightCoupon = [], userCanUseWhenNotSelectCoupon = []) {
    if (userCanUseWhenNotSelectCoupon) {
      for (let i = 0; i < userCanUseWhenNotSelectCoupon.length; i++) {
        userCanUseWhenNotSelectCoupon[i].selected = false;
        userCanUseWhenNotSelectCoupon[i].disable = true;
        userCanUseCoupon.push(userCanUseWhenNotSelectCoupon[i])
      }
    }

    instance.initData.userCanUseCoupon = JSON.parse(JSON.stringify(userCanUseCoupon));
    instance.initData.freightCoupon = JSON.parse(JSON.stringify(freightCoupon));
    instance.initData.userCanUseWhenNotSelectCoupon = userCanUseWhenNotSelectCoupon;
  },
  reloadSelectedCoupon(userCanUseCoupon, freightCoupon = [], userCanUseWhenNotSelectCoupon = []) {
    // this.initCouponList(userCanUseCoupon, freightCoupon, userCanUseWhenNotSelectCoupon)
    let arr = []
    for (let i = 0; i < instance.initData.userCanUseCoupon.length; i++) {
      let couNo = instance.initData.userCanUseCoupon[i].couNo
      for (let j = 0; j < userCanUseCoupon.length; j++) {
        let couNo1 = userCanUseCoupon[j].couNo
        if (couNo == couNo1) {
          instance.initData.userCanUseCoupon[i].selected = userCanUseCoupon[j].selected;
          instance.initData.userCanUseCoupon[i].disable = false;
          arr.push(instance.initData.userCanUseCoupon[i])
        }
      }
      if (userCanUseWhenNotSelectCoupon) {
        for (let j = 0; j < userCanUseWhenNotSelectCoupon.length; j++) {
          let couNo1 = userCanUseWhenNotSelectCoupon[j].couNo
          if (couNo == couNo1) {
            instance.initData.userCanUseCoupon[i].selected = false;
            instance.initData.userCanUseCoupon[i].disable = true;
            arr.push(instance.initData.userCanUseCoupon[i])
          }
        }
      }
    }

    instance.initData.userCanUseCoupon = JSON.parse(JSON.stringify(arr));
    instance.initData.freightCoupon = JSON.parse(JSON.stringify(freightCoupon));
    instance.initData.userCanUseWhenNotSelectCoupon = userCanUseWhenNotSelectCoupon;
  }
};
