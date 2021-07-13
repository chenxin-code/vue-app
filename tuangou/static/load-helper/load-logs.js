"use strict";

(function () {
  var bodies = document.getElementsByTagName('body');
  var body = bodies[0];
  var list = document.createElement('div');
  var close = document.createElement('div');

  function closeLogs() {
    if (list) {
      body.removeChild(list);
      body.removeChild(close);
    }
  }

  function showLogs() {
    var logs = window.load_helper_logs;
    list.className = 'load_helper_logs_list';

    for (var i = 0; i < logs.length; i++) {
      var log = logs[i];
      var item = document.createElement('div');
      item.className = 'load_helper_logs_item';

      if (log.type == 'windowOnError') {
        item.innerHTML = "<p>type\uFF1A".concat(log.type, "</p><p style=\"color: red;\">errorMessage\uFF1A").concat(JSON.stringify(log.data.errorMessage), "</p><p>scriptURI\uFF1A").concat(JSON.stringify(log.data.scriptURI), "</p>");
      } else if (log.type == 'error') {
        item.innerHTML = "<p>type\uFF1A".concat(log.type, "</p><p>data\uFF1A").concat(JSON.stringify(log.data), "</p>");
      } else {
        item.innerHTML = "<p>type\uFF1A".concat(log.type, "</p><p>data\uFF1A").concat(JSON.stringify(log.data), "</p>");
      }

      list.appendChild(item);
    }

    close.className = 'load_helper_logs_close';
    close.innerHTML = 'X';
    close.addEventListener('click', closeLogs);
    body.appendChild(close);
    body.appendChild(list);
  }

  var logBtn = document.createElement('div');
  logBtn.addEventListener('click', showLogs);
  logBtn.className = 'load_helper_logs_btn';
  logBtn.innerHTML = "logs";
  body.appendChild(logBtn);
  /**
   * 加载css
   */

  function loadCssCode(code) {
    var style = document.createElement('style');
    style.type = 'text/css';
    style.rel = 'stylesheet';
    style.appendChild(document.createTextNode(code));
    var head = document.getElementsByTagName('head')[0];
    head.appendChild(style);
  }
  /**
   * 拼接css
   */


  function appendCss() {
    loadCssCode("\n      .load_helper_logs_btn {\n        position: absolute;\n        right: 20px;\n        bottom: 30px;\n        font-size: 16px;\n        text-align: center;\n        width: 44px;\n        height: 44px;\n        line-height: 40px;\n        z-index: 100;\n        border: 2px solid #999;\n        border-radius: 24px;\n        color: #999;\n        background-color: white;\n      }\n      .load_helper_logs_list {\n        position: absolute;\n        left: 0;\n        right: 0;\n        top: 0;\n        bottom: 0;\n        z-index: 101;\n        overflow-y: auto;\n        background-color: white;\n      }\n      .load_helper_logs_item {\n        padding: 5px;\n        border-bottom: 1px solid #ddd;\n        line-height: 1.6;\n        width: 100%;\n      }\n      .load_helper_logs_item p {\n        width: 100%;\n        word-break: break-all;\n      }\n      .load_helper_logs_close {\n        position: absolute;\n        right: 10px;\n        top: 40px;\n        font-size: 16px;\n        line-height: 36px;\n        width: 40px;\n        text-align: center;\n        color: #999;\n        z-index: 102;\n        border: 2px solid #999;\n        border-radius: 21px;\n      }\n    ");
  }

  appendCss();
})();
