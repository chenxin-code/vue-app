import bridgefunc from "./bridgefunc";
import util from './util'

const logCenter = {
  // addLog 添加日志，入参：title 日志标题， body 日志内容
  addLog: function (title, body) {
    let dic = {
      title: title,
      time: util.getPayTime(),
      body: body
    };
    bridgefunc.writeLog(encodeURIComponent(JSON.stringify(dic)));
  },

  // 获取日志数组，入参：callBack 回调入参数组
  async getLogs(callBack) {
    let result = await bridgefunc.readLog();
    let tmp = decodeURIComponent(result)
    let logs = JSON.parse(tmp);
    let allLog = [];
    // 兼容 ios 和 android
    for(let k in logs) {
      allLog.push(JSON.parse(decodeURIComponent(logs[k])));
    }
    callBack(allLog);
  }
}

export default logCenter
