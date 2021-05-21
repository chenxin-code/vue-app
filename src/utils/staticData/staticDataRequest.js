import config from "../../api/config";

const _headContainer = document.getElementsByTagName('head')[0]
let _requestingArray = {}

class DataRequestJsonp {
  constructor(url, funcName) {
    this.url = url || ''
    this.funcName = funcName
    let scriptNode = document.createElement('script')
    url += (~url.indexOf('?') ? '&' : '?') + 'callback=' + funcName;
    scriptNode.src = url
    scriptNode.type = 'text/javascript'

    this.myTimer = setTimeout(() => {
      this.callCallback({
        status: 1,
        info: '网络加载较慢！'
      })
      this.clearup()
    }, 10*1000)

    window[funcName] = (res) => {
      this.callCallback({
        status: 0,
        data: res,
        info: ''
      })
      this.clearup()
    }

    scriptNode.onerror = () => {
      this.callCallback({
        status: 1,
        info: '网络加载较慢！'
      })
      this.clearup()
    }

    this.scriptNode = scriptNode
    _headContainer.appendChild(this.scriptNode)
  }

  then(func) {
    this.callbackFunc = func
  }

  callCallback (d) {
    setTimeout(() => {
      this.callbackFunc(d)
    }, 0)
  }

  clearup() {
    if (this.myTimer) {
      clearTimeout(this.myTimer)
    }
    this.myTimer = null
    this.scriptNode.src = ''
    // delete _requestingArray[this.funcName]
    _headContainer.removeChild(this.scriptNode)
    // window[this.funcName] && delete window[this.funcName]
  }
}

const staticDataRequest = {
  /**
   * @param url 请求url
   * @param funcName 请求回调名称，得写死，确保能缓存
   * @param args 有序数组
   * @returns {DataRequestJsonp} 返回请求对象
   */
  request(url, funcName, args = []) {
    if (!url) {
      throw new Error('url 不能为空')
    }
    if (url.indexOf('http') != 0) {
      url = config.baseURL + url
    }
    args.forEach(item => {
      if (typeof item === 'object') {
        for (const key in item) {
          url += (~url.indexOf('?') ? '&' : '?')
          url += key + '=' + item[key]
        }
      }
    })

    let req = new DataRequestJsonp(url, funcName)
    // 去掉移除重复
    // if (_requestingArray[funcName]) {
    //   _requestingArray[funcName].cancel()
    //   delete _requestingArray[funcName]
    // }
    // _requestingArray[funcName] = req
    return req
  },
  cancelAll() {
    // _requestingArray.forEach((key, req) => {
    //   req.cancel()
    // })
    // _requestingArray = {}
  }
}

export default staticDataRequest
