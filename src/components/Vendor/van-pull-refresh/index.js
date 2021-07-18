import Vue from 'vue';
import  toast from './src/toast.vue'
const ToastConstructor = Vue.extend(toast);
let toastPool = [];

let getAnInstance = () => {
  if (toastPool.length > 0) {
    let instance = toastPool[0];
    toastPool.splice(0, 1);
    return instance;
  }
  return new ToastConstructor({
    el: document.createElement('div')
  });
};

let returnAnInstance = instance => {
  if (instance) {
    toastPool.push(instance);
  }
};

let removeDom = event => {
  if (event.target.parentNode) {
    event.target.parentNode.removeChild(event.target);
  }
};

ToastConstructor.prototype.close = function() {
  this.visible = false;
  this.$el.addEventListener('transitionend', removeDom);
  this.closed = true;
  returnAnInstance(this);
};

let Toast = (options = {}) => {
  let message = typeof options === 'string' ? options : options.message;
  // 临时处理
  // 后台出错会返回一大堆东西，优化处理为友好提示
  if (message.length > 200) {
    message = '系统请求错误，请稍后重试！'
  } else if (message == '') {
    return;
  }

  let duration = options.duration || 2000;
  let instance = getAnInstance();
  instance.closed = false;
  clearTimeout(instance.timer);
  instance.message = message;
  instance.position = options.position || 'bottom';
  instance.className = options.className || '';
  instance.iconClass = options.iconClass || '';

  document.body.appendChild(instance.$el);
  Vue.nextTick(function() {
    instance.visible = true;
    instance.$el.removeEventListener('transitionend', removeDom);
    ~duration && (instance.timer = setTimeout(function() {
      if (instance.closed) return;
      instance.close();
    }, duration));
  });
  return instance;
};

export default Toast;
