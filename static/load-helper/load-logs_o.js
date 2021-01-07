(function () {
  const bodies = document.getElementsByTagName('body')
  const body = bodies[0]

  let list = document.createElement('div')
  let close = document.createElement('div')

  function closeLogs() {
    if (list) {
      body.removeChild(list)
      body.removeChild(close)
    }
  }

  function showLogs() {
    let logs = window.load_helper_logs
    list.className = 'load_helper_logs_list'

    for (let i = 0; i < logs.length; i++) {
      let log = logs[i]
      let item = document.createElement('div')
      item.className = 'load_helper_logs_item'
      if (log.type == 'windowOnError') {
        item.innerHTML = `<p>type：${log.type}</p><p style="color: red;">errorMessage：${JSON.stringify(log.data.errorMessage)}</p><p>scriptURI：${JSON.stringify(log.data.scriptURI)}</p>`
      } else if (log.type == 'error') {
        item.innerHTML = `<p>type：${log.type}</p><p>data：${JSON.stringify(log.data)}</p>`
      } else {
        item.innerHTML = `<p>type：${log.type}</p><p>data：${JSON.stringify(log.data)}</p>`
      }
      list.appendChild(item)
    }

    close.className = 'load_helper_logs_close'
    close.innerHTML = 'X'
    close.addEventListener('click', closeLogs)
    body.appendChild(close)

    body.appendChild(list)
  }

  let logBtn = document.createElement('div')
  logBtn.addEventListener('click', showLogs)
  logBtn.className = 'load_helper_logs_btn'
  logBtn.innerHTML = `logs`
  body.appendChild(logBtn)

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
      .load_helper_logs_btn {
        position: absolute;
        right: 20px;
        bottom: 30px;
        font-size: 16px;
        text-align: center;
        width: 44px;
        height: 44px;
        line-height: 40px;
        z-index: 100;
        border: 2px solid #999;
        border-radius: 24px;
        color: #999;
        background-color: white;
      }
      .load_helper_logs_list {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        z-index: 101;
        overflow-y: auto;
        background-color: white;
      }
      .load_helper_logs_item {
        padding: 5px;
        border-bottom: 1px solid #ddd;
        line-height: 1.6;
        width: 100%;
      }
      .load_helper_logs_item p {
        width: 100%;
        word-break: break-all;
      }
      .load_helper_logs_close {
        position: absolute;
        right: 10px;
        top: 40px;
        font-size: 16px;
        line-height: 36px;
        width: 40px;
        text-align: center;
        color: #999;
        z-index: 102;
        border: 2px solid #999;
        border-radius: 21px;
      }
    `)
  }

  appendCss()
})()
