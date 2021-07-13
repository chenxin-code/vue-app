(function () {

  const loadMaxTime = 20
  const isShowLogs = true
  let logs = []

  const markConsole = window.console
  /**
   * 设置相关日志监听
   */
  function createListener() {
    let newLog = Object.create(markConsole)
    newLog.__proto__ = markConsole

    newLog.log = function () {
      logs.unshift({
        type: 'log',
        data: arguments
      })
      newLog.__proto__.log.call(this, ...arguments)
    }
    newLog.error = function () {
      logs.unshift({
        type: 'error',
        data: arguments
      })
      newLog.__proto__.error.call(this, ...arguments)
    }
    window.console = newLog

    window.onerror = function (errorMessage, scriptURI, lineNumber, columnNumber, errorObj) {
      logs.unshift( {
        type: 'windowOnError',
        data: {
          errorMessage: errorMessage,
          scriptURI: scriptURI,
          lineNumber: lineNumber,
          columnNumber: columnNumber,
          errorObj: errorObj
        }
      })
    }
  }

  /**
   * 移除日志监听
   */
  function removeListener() {
    clearInterval(timer)
    window.console = markConsole
    window.onerror = null
    removeLoading()
  }

  let over = null

  /**
   * 加载css
   */
  function loadCssCode(code){
    let style = document.createElement('style');
    style.type = 'text/css';
    style.rel = 'stylesheet';
    style.appendChild(document.createTextNode(code));
    let head = document.getElementsByTagName('head')[0];
    head.appendChild(style);
  }

  /**
   * 拼接css
   */
  function appendCss() {
    loadCssCode(`
      .load_helper_over {
        background-color: rgba(0,0,0,0.5);
        z-index: 1000;
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
      }
      .load_helper_loading {
        font-size: 2px;
        position: relative;
        margin-top: 45vh;
        margin-left: calc(50% - 20px);
        float: left;
        text-indent: -9999em;
        border-top: 0.05rem solid rgb(239,211,69);
        border-right: 0.05rem solid rgb(239,211,69);
        border-bottom: 0.05rem solid rgb(239,211,69);
        border-left: 0.05rem solid #12314A;
        -webkit-animation: load_helper_loading 1.1s infinite linear;
        animation: load_helper_loading 1.1s infinite linear;
      }
      .load_helper_loading,
      .load_helper_loading:after {
        border-radius: 50%;
        width: 40px;
        height: 40px;
      }
      .load_helper_version-div {
        position: absolute;
        top: 45vh;
        left: 0;
        margin-top: 55px;
        font-size: 12px;
        color: #aaaaaa;
        text-align: center;
        width: 100%;
      }
      @-webkit-keyframes load_helper_loading{
        0% {
          -webkit-transform: rotate(0deg);
          transform: rotate(0deg);
        }
        100% {
          -webkit-transform: rotate(360deg);
          transform: rotate(360deg);
        }
      }
      @keyframes load_helper_loading{
        0% {
          -webkit-transform: rotate(0deg);
          transform: rotate(0deg);
        }
        100% {
          -webkit-transform: rotate(360deg);
          transform: rotate(360deg);
        }
      }
    `)
  }

  /**
   * 展示loading
   */
  function showLoading() {
    appendCss()
    over = document.createElement('div')
    over.className = 'load_helper_over'
    over.innerHTML = `<div class="load_helper_loading"></div><div class="load_helper_version-div">新版本更新中...</div>`
    const bodies = document.getElementsByTagName('body')
    const body = bodies[0]
    body.appendChild(over)
  }

  /**
   * 移除loading
   */
  function removeLoading() {
    if (over) {
      const bodies = document.getElementsByTagName('body')
      const body = bodies[0]
      body.removeChild(over)
    }
  }

  /**
   * 添加log查看按钮
   */
  function addLogsJs() {
    window.load_helper_logs = logs
    let scriptNode = document.createElement('script')
    scriptNode.src = './static/load-helper/load-logs.js?ver=' + (new Date()).getTime()
    scriptNode.type = 'text/javascript'
    const bodies = document.getElementsByTagName('body')
    const body = bodies[0]
    body.appendChild(scriptNode)
  }

  // 设置监听
  createListener()
  let times = 0
  let timer = setInterval(() => {
    let loaded = sessionStorage.getItem('js_css_loaded');
    if (loaded) {
      // 已经加载，移除监听
      removeListener()
      return;
    }
    if (times >= loadMaxTime) {
      // 已经超时，移除监听
      removeListener();
      // 添加日志相关
      if (isShowLogs) addLogsJs();
      return;
    }
    if (times == 1) {
      // 显示loading
      showLoading()
      return ;
    }
    times++
  }, 1000)

})()
