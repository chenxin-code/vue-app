"use strict";

(function () {
  // 写在head 开头位置，确保先加载这个
  var headNode = document.getElementsByTagName('head')[0];

  if (!headNode) {
    return;
  }

  var channel = '';
  var path = window.location.href;
  var arr = path.split('channel=');

  if (arr.length == 2) {
    channel = arr[1].split('&')[0];
  }

  function jsloaded() {
    if (window.app_global_js_loaded_mark) {
      return;
    } // 如果 存在加载之后的回调，直接调用回调函数。


    if (window.app_global_js_loaded) {
      window.app_global_js_loaded();
    }

    window.app_global_js_loaded_mark = true;
  }

  var scriptNode = document.createElement('script');
  scriptNode.src = '/appcontent/js/home/appGlobal.js?channel=' + channel;
  scriptNode.type = 'text/javascript';
  scriptNode.onload = jsloaded;
  scriptNode.onerror = jsloaded;
  headNode.appendChild(scriptNode);
})();
