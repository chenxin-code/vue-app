"use strict";

(function () {
  var loadMaxTime = 20;
  var isShowLogs = true;
  var logs = [];
  var markConsole = window.console;
  /**
   * 设置相关日志监听
   */

  function createListener() {
    var newLog = Object.create(markConsole);
    newLog.__proto__ = markConsole;

    newLog.log = function () {
      var _newLog$__proto__$log;

      logs.unshift({
        type: 'log',
        data: arguments
      });

      (_newLog$__proto__$log = newLog.__proto__.log).call.apply(_newLog$__proto__$log, [this].concat(Array.prototype.slice.call(arguments)));
    };

    newLog.error = function () {
      var _newLog$__proto__$err;

      logs.unshift({
        type: 'error',
        data: arguments
      });

      (_newLog$__proto__$err = newLog.__proto__.error).call.apply(_newLog$__proto__$err, [this].concat(Array.prototype.slice.call(arguments)));
    };

    window.console = newLog;

    window.onerror = function (errorMessage, scriptURI, lineNumber, columnNumber, errorObj) {
      logs.unshift({
        type: 'windowOnError',
        data: {
          errorMessage: errorMessage,
          scriptURI: scriptURI,
          lineNumber: lineNumber,
          columnNumber: columnNumber,
          errorObj: errorObj
        }
      });
    };
  }
  /**
   * 移除日志监听
   */


  function removeListener() {
    clearInterval(timer);
    window.console = markConsole;
    window.onerror = null;
    removeLoading();
  }

  var over = null;
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
    loadCssCode("\n      .load_helper_over {\n        background-color: rgba(0,0,0,0.5);\n        z-index: 1000;\n        width: 100%;\n        height: 100%;\n        position: absolute;\n        left: 0;\n        top: 0;\n      }\n      .load_helper_loading {\n        font-size: 2px;\n        position: relative;\n        margin-top: 45vh;\n        margin-left: calc(50% - 20px);\n        float: left;\n        text-indent: -9999em;\n        border-top: 0.05rem solid rgb(239,211,69);\n        border-right: 0.05rem solid rgb(239,211,69);\n        border-bottom: 0.05rem solid rgb(239,211,69);\n        border-left: 0.05rem solid #12314A;\n        -webkit-animation: load_helper_loading 1.1s infinite linear;\n        animation: load_helper_loading 1.1s infinite linear;\n      }\n      .load_helper_loading,\n      .load_helper_loading:after {\n        border-radius: 50%;\n        width: 40px;\n        height: 40px;\n      }\n      .load_helper_version-div {\n        position: absolute;\n        top: 45vh;\n        left: 0;\n        margin-top: 55px;\n        font-size: 12px;\n        color: #aaaaaa;\n        text-align: center;\n        width: 100%;\n      }\n      @-webkit-keyframes load_helper_loading{\n        0% {\n          -webkit-transform: rotate(0deg);\n          transform: rotate(0deg);\n        }\n        100% {\n          -webkit-transform: rotate(360deg);\n          transform: rotate(360deg);\n        }\n      }\n      @keyframes load_helper_loading{\n        0% {\n          -webkit-transform: rotate(0deg);\n          transform: rotate(0deg);\n        }\n        100% {\n          -webkit-transform: rotate(360deg);\n          transform: rotate(360deg);\n        }\n      }\n    ");
  }
  /**
   * 展示loading
   */


  function showLoading() {
    appendCss();
    over = document.createElement('div');
    over.className = 'load_helper_over';
    over.innerHTML = "<div class=\"load_helper_loading\"></div><div class=\"load_helper_version-div\">\u65B0\u7248\u672C\u66F4\u65B0\u4E2D...</div>";
    var bodies = document.getElementsByTagName('body');
    var body = bodies[0];
    body.appendChild(over);
  }
  /**
   * 移除loading
   */


  function removeLoading() {
    if (over) {
      var bodies = document.getElementsByTagName('body');
      var body = bodies[0];
      body.removeChild(over);
    }
  }
  /**
   * 添加log查看按钮
   */


  function addLogsJs() {
    window.load_helper_logs = logs;
    var scriptNode = document.createElement('script');
    scriptNode.src = './static/load-helper/load-logs.js?ver=' + new Date().getTime();
    scriptNode.type = 'text/javascript';
    var bodies = document.getElementsByTagName('body');
    var body = bodies[0];
    body.appendChild(scriptNode);
  } // 设置监听


  createListener();
  var times = 0;
  var timer = setInterval(function () {
    var loaded = sessionStorage.getItem('js_css_loaded');

    if (loaded) {
      // 已经加载，移除监听
      removeListener();
      return;
    }

    if (times >= loadMaxTime) {
      // 已经超时，移除监听
      removeListener(); // 添加日志相关

      if (isShowLogs) addLogsJs();
      return;
    }

    if (times == 1) {
      // 显示loading
      showLoading();
      return;
    }

    times++;
  }, 1000);
})();
