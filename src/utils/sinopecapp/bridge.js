// 掌厅提供的垃圾集成方案，自己拍脑袋想的，完全没有考虑封装性，疯狂吐槽，基于掌厅提供协议封装

const sinopecBridge = {
  myCallBack: null,
  revNativeValue: function (value) {
    if (this.myCallBack) {
      this.myCallBack(value)
      this.myCallBack = null
    }
  },
  sinopecapp_loadNative: function (method, param, callback) {
    if (callback) {
      this.myCallBack = callback
      window.revNativeValue = this.revNativeValue
    }
    let androidReg = /(Android)/i;
    let iosReg = /(iPhone|iPad|iPod|iOS)/i;
    if (androidReg.test(navigator.userAgent)) {
      return sinopecapp.sinopecapp_loadNative(method, param);
    } else if (iosReg.test(navigator.userAgent)) {
      return window.webkit.messageHandlers.sinopecapp_loadNative.postMessage({method, param});
    }
  }
}

export default sinopecBridge
