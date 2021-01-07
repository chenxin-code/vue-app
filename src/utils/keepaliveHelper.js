var keepaliveHelper = {
  deleteCache: function (that) {
    if (that.$vnode.parent && that.$vnode.parent.componentInstance && that.$vnode.parent.componentInstance.cache) {
      if (that.$vnode.componentOptions) {
        let key = that.$vnode.key == null
          ? that.$vnode.componentOptions.Ctor.cid + (that.$vnode.componentOptions.tag ? `::${that.$vnode.componentOptions.tag}` : '')
          : that.$vnode.key;
        let cache = that.$vnode.parent.componentInstance.cache;
        let keys = that.$vnode.parent.componentInstance.keys;
        if (cache[key])
        {
          if (keys.length) {
            var index = keys.indexOf(key);
            if (index > -1) {
              keys.splice(index, 1);
            }
          }
          delete cache[key];
        }
      }
    }
    that.$destroy();
  },
  // 仅在app.vue里面使用，如果app.vue换了结构，可能导致奇怪的问题，慎用，请勿调用
  // 移除了除首页之外的所有缓存
  deleteOthers: function (that) {
    if (that.$children.length >= 2) {
      that = that.$children[1]
      if (that.$vnode.parent && that.$vnode.parent.componentInstance && that.$vnode.parent.componentInstance.cache) {
        if (that.$vnode.componentOptions) {
          let cache = that.$vnode.parent.componentInstance.cache;
          let keys = that.$vnode.parent.componentInstance.keys;
          console.log(keys)
          let keysLen = keys.length
          for (let i = 1; i < keysLen; i++) {
            let key = keys.splice(1, 1);
            delete cache[key];
          }
        }
      }
    }
  }
}

export default keepaliveHelper
