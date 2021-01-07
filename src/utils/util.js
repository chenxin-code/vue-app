/**
 * Created by lirui on 2018/1/4.
 */
import Cookie from 'js-cookie'
import store from '../vuex/store'
import router from "../router";
import Config from "../api/config";
import Toast from "../components/Vendor/toast";
import {Dialog} from "vant";
import http from "./http";
import Loading from '@/components/Vendor/Loading/index'
import bridgefunc from "./bridgefunc";
import userCenter from "../components/usercenter/js/userCenter";
import MessageBox from '@/components/Vendor/messagebox/index';
import wechatOP from './WechatOP'
import md5String from "./md5";
import Watchman from "./watchman";


const dev = process.env.NODE_ENV !== 'production'


var utils = {
  getUrlParam: function (url, name) {
    let reg = new RegExp('([?]|&)' + name + "=([^&]*)(&|$)");
    let r = url.substr(1).match(reg);
    if (r != null) {
      return decodeURIComponent(r[2]);
    }
    return '';
  },
  replaceH5Img(str) {
    str = str.replace(/(<img[^>]*>)|(<img[^>]*><\/img>)/g, function (match, capture) {
      if (match.indexOf('style') < 0) {
        // 没有style 就添加一个
        return match.replace(/<\s*img/, '<img style=""');
      } else {
        // 有style 就不做处理 直接返回
        return match
      }
    })
    str = str.replace(/<img[^>]*>/gi, function (match, capture) {
      return match.replace(/style\s*?=\s*?([‘"])[\s\S]*?\1/ig, 'style="width:100%;height:auto;margin:0 auto;margin-top:5px; display:block;border-radius:5px;"') // 替换style
    })
    console.log('htmlstr', str)
    return str
  },
  // 检查身份证是否合法
  IDCardCheck(num) {
    num = num.toUpperCase();
    //身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X。
    if (!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(num))) {
      console.log('输入的身份证号长度不对，或者号码不符合规定！\n15位号码应全为数字，18位号码末位可以为数字或X。');
      return false;
    }
    //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
    //下面分别分析出生日期和校验位
    var len, re;
    len = num.length;
    if (len == 15) {
      re = new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/);
      var arrSplit = num.match(re);

      //检查生日日期是否正确
      var dtmBirth = new Date('19' + arrSplit[2] + '/' + arrSplit[3] + '/' + arrSplit[4]);
      var bGoodDay;
      bGoodDay = (dtmBirth.getYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
      if (!bGoodDay) {
        console.log('输入的身份证号里出生日期不对！');
        return false;
      } else {
        //将15位身份证转成18位
        //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
        var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
        var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
        var nTemp = 0, i;
        num = num.substr(0, 6) + '19' + num.substr(6, num.length - 6);
        for (i = 0; i < 17; i++) {
          nTemp += num.substr(i, 1) * arrInt[i];
        }
        num += arrCh[nTemp % 11];
        return true;
      }
    }
    if (len == 18) {
      re = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/);
      var arrSplit = num.match(re);

      //检查生日日期是否正确
      var dtmBirth = new Date(arrSplit[2] + "/" + arrSplit[3] + "/" + arrSplit[4]);
      var bGoodDay;
      bGoodDay = (dtmBirth.getFullYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
      if (!bGoodDay) {
        // alert(dtmBirth.getYear());
        //  alert(arrSplit[2]);
        console.log('输入的身份证号里出生日期不对！');
        return false;
      } else {
        //检验18位身份证的校验码是否正确。
        //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
        var valnum;
        var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
        var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
        var nTemp = 0, i;
        for (i = 0; i < 17; i++) {
          nTemp += num.substr(i, 1) * arrInt[i];
        }
        valnum = arrCh[nTemp % 11];
        if (valnum != num.substr(17, 1)) {
          console.log('18位身份证的校验码不正确！'); //应该为： + valnum
          return false;
        }
        return true;
      }
    }
    return false;
  },
  //  检查手机号码是否正确
  checkMobile: function (str) {
    let reg = /^1[23456789]\d{9}$/;
    if (reg.test(str)) {
      return true;
    }
    return false
  },
  // 密码输入规则
  // pwdRule: function (str) {
  //
  // },
  removeWidthAndHeight: function (str) {
    str = str.replace(/width=+(\s*[^ ][^>]*)|height=+(\s*[^ ][^>]*)/g, "");
    return str
  },
  checkAddressCode: function (str) {
    let reg = /[0-9]{6}$/;
    if (reg.test(str)) {
      return true;
    }
    return false
  },
  checkMail: function (str) {
    var reg = new RegExp("^[A-Za-z0-9]+([._\\-]*[A-Za-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");
    if (reg.test(str)) {
      return true;
    }
    return false
  },
  pwdPlaceholder() {
    if (store.state.globalConfig.ComplexPwd == 1) {
      return '密码须同时含大小写加数字且至少8位';
    } else {
      return '密码必须由6-20位数字加字母组成';
    }
  },
  checkPassWord(password, isNeedToast = true, isBlankRetrun = false) {

    if (isBlankRetrun && (!password || !password.length)) {
      return;
    }
    let result = checkFunc();
    if (!result && isNeedToast) {
      Toast(this.pwdPlaceholder());
    }
    return result;

    function checkFunc() {
      var str = password;
      if (store.state.globalConfig.ComplexPwd == 1) {
        if (str == null || str.length < 8) {
          return false;
        }
      } else {
        if (str == null || str.length < 6 || str.length > 20) {
          return false;
        }
      }

      var reg = undefined;
      if (store.state.globalConfig.ComplexPwd == 1) {
        reg = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/);
      } else {
        reg = new RegExp(/[A-Za-z].*[0-9]|[0-9].*[A-Za-z]/);
      }
      if (reg.test(str)) {
        return true;
      } else {
        return false;
      }
    }
  },

  // 护照验证
  checkPassport: function (code) {
    if (!code || !/(^[K|k]{1}\d{8}$)|(^[E|e]{1}\d{8}$)|^[D|d|S|s|P|p|G|g]\d{8}$|^[E|e]{1}[A-Za-z]\d{7}$|^[SE|se|DE|de|PE|pe]{2}\d{7}$|(^[MA|ma]{2}\d{7}$)/.test(code)) {
      return false;
    }
    return true;
  },
  // 判断对象是否是Json 对象
  isJsonObj: function (obj) {
    let isjson = typeof (obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length;
    return isjson;
  },
  // 是否是非负整数
  isIntNum: function (x) {
    let regPos = /^\d+$/;// 非负整数
    if (regPos.test(x)) {
      return true
    } else {
      return false
    }
  },
  // 保留两位小数
  toDecimal2: function (x) {
    if (!x) {
      return '0.00'
    }
    let s = x.toString();
    var rs = s.indexOf('.');
    if (rs < 0) {
      rs = s.length;
      s += '.';
    }
    while (s.length <= rs + 2) {
      s += '0';
    }
    if (s.length > rs + 3) {
      let f = s.substring(0, rs + 3);
      return f;//parseFloat(f) + 0.01;
    }
    return s;
  },
  // 仅保留小数
  onlyNumber: function (value) {
    let reg = /[^0-9]/ig;
    return value.replace(reg, "")
  },
  // 计算两个小数之间差
  subtractDecimal: function (num1, num2) {
    let subtractNum = num1 * 10000 - num2 * 10000;
    return subtractNum / 10000;
  },
  // 深拷贝
  cloneDeep: function (obj) {
    if (typeof obj !== 'object' || utils.objectKeys(obj).length === 0) {
      return obj
    }
    let resultData = {}
    return this.recursion(obj, resultData)
  },
  // 深拷贝 子集函数
  recursion: function (obj, data = {}) {
    for (let key in obj) {
      if (typeof obj[key] == 'object' && utils.objectKeys(obj[key].length > 0)) {
        data[key] = this.recursion(obj[key])
      } else {
        data[key] = obj[key]
      }
    }
    return data
  },
  // 时间字符串转成 时间戳
  getDateFromString(str) {
    if (str == '' || str == null || str == undefined) {
      return 0
    }
    // 精确到秒
    str = str.replace(/-/g, '/');
    return parseInt((new Date(str)).getTime() / 1000)
  },
  // 获取时间戳字符串
  getDataString() {
    return (new Date()).getTime() + ''
  },
  //时间戳格式化 年-月-日
  getMyDate(str) {
    var oDate = new Date(str),
      oYear = oDate.getFullYear(),
      oMonth = oDate.getMonth() + 1,
      oDay = oDate.getDate(),
      oTime = oYear + '-' + this.getzf(oMonth) + '-' + this.getzf(oDay);//最后拼接时间
    return oTime;
  },
  //时间戳格式化 年-月
  getMyMonth(str) {
    var oDate = new Date(str),
      oYear = oDate.getFullYear(),
      oMonth = oDate.getMonth() + 1,
      oTime = oYear + '-' + this.getzf(oMonth);//最后拼接时间
    return oTime;
  },
  //时间戳格式化 年
  getMyYear(str) {
    var oDate = new Date(str),
      oYear = oDate.getFullYear(),
      oTime = oYear;//最后拼接时间
    return oTime;
  },
  // 当前时间戳格式化 年-月-日 时-分-秒
  getPayTime() {
    var oDate = new Date(),
      oYear = oDate.getFullYear(),
      oMonth = oDate.getMonth() + 1,
      oDay = oDate.getDate(),
      oHour = oDate.getHours(),
      oMinute = oDate.getMinutes(),
      oSecond = oDate.getSeconds(),

      oTime = oYear + '-' + this.getzf(oMonth) + '-' + this.getzf(oDay) + ' ' + this.getzf(oHour) + ':' + this.getzf(oMinute) + ':' + this.getzf(oSecond);//最后拼接时间
    return oTime;
  },
  // 时间戳格式化 年-月-日 时-分-秒
  getPreTime(val) {
    console.log('getPreTime', val)
    var oDate = new Date(val),
      oYear = oDate.getFullYear(),
      oMonth = oDate.getMonth() + 1,
      oDay = oDate.getDate(),
      oHour = oDate.getHours(),
      oMinute = oDate.getMinutes(),
      oSecond = oDate.getSeconds(),

      oTime = oYear + '-' + this.getzf(oMonth) + '-' + this.getzf(oDay) + ' ' + this.getzf(oHour) + ':' + this.getzf(oMinute) + ':' + this.getzf(oSecond);//最后拼接时间
    return oTime;
  },
  //时间戳格式化 年-月-日 时-分
  getPayTimemin(str) {
    str += ''
    str = str.replace(/-/g, '/')
    var oDate = new Date(str),
      oYear = oDate.getFullYear(),
      oMonth = oDate.getMonth() + 1,
      oDay = oDate.getDate(),
      oHour = oDate.getHours(),
      oMinute = oDate.getMinutes(),

      oTime = oYear + '-' + this.getzf(oMonth) + '-' + this.getzf(oDay) + ' ' + this.getzf(oHour) + ':' + this.getzf(oMinute);//最后拼接时间
    return oTime;
  },
  // 获取月份的第一天和最后一天 精确到时分秒
  getDealMonthFrom(year, month) {
    const _date = new Date(year, month, 0)
    const _days = _date.getDate()
    return {
      start: `${year}-${month}-1 00:00:00 `,
      end: `${year}-${month}-${_days} 23:59:59 `
    }
  },
  // 获取月份的第一天和最后一天 精确到时分秒,加0
  getDealMonthFromAdd0(year, month) {
    const _date = new Date(year, month, 0)
    const _days = _date.getDate()
    let month1 = this.getzf(month);
    return {

      start: `${year}-${month1}-01 00:00:00 `,
      end: `${year}-${month1}-${_days} 23:59:59 `
    }
  },
  // 获取月份的第一天和最后一天
  getDealMonthFromSpecific(year, month) {
    const _date = new Date(year, month, 0)
    const _days = _date.getDate()
    return {
      start: `${year}-${month}-1`,
      end: `${year}-${month}-${_days}`
    }
  },
  // 获取某一时间的后几天
  getOtherDate(date, num = 1) {
    var curDate = new Date(date);
    var preDate = new Date(curDate.getTime() + 24 * 60 * 60 * 1000 * num); // 后几天天
    return this.getPreTime(preDate.getTime())
  },
  // 获取当前时间的前一天
  getPreDate() {
    var curDate = new Date();
    var preDate = new Date(curDate.getTime() - 24 * 60 * 60 * 1000); // 前一天
    return this.getPreTime(preDate.getTime())
  },
  // 获取某一时间的前一周
  getAfterWeek(date) {
    var curDate = new Date(date);
    var preDate = new Date(curDate.getTime() - 7 * 24 * 60 * 60 * 1000); // 前一周
    return this.getPreTime(preDate.getTime())
  },
  // 获取当前时间的后一天
  getNextDate() {
    var curDate = new Date();
    var preDate = new Date(curDate.getTime() + 24 * 60 * 60 * 1000);
    return this.getMyDate(preDate.getTime())
  },
  // 获取当前时间的后十秒
  getNextMinutes() {
    var curDate = new Date();
    var preDate = new Date(curDate.getTime() + 10 * 1000);
    return this.getPreTime(preDate.getTime())
  },
  // 获取某一时间的后十秒
  getNextMinutesVal(val) {
    var curDate = new Date(val);
    var preDate = new Date(curDate.getTime() + 10 * 1000);
    return this.getPreTime(preDate.getTime())
  },
  // 获取某一时间的后一秒
  getNextMinutesValOne(val) {
    var curDate = new Date(val);
    var preDate = new Date(curDate.getTime() + 1000);
    return this.getPreTime(preDate.getTime())
  },
  // 获取某一时间距今有多少天
  daysDistance(date1, date2) {
    //date1和date2是2019-06-18格式
    //parse() 是 Date 的一个静态方法 , 所以应该使用 Date.parse() 来调用，而不是作为 Date 的实例方法。返回该日期距离 1970/1/1 午夜时间的毫秒数
    date1 = Date.parse(date1);
    date2 = Date.parse(date2);
    //计算两个日期之间相差的毫秒数的绝对值
    var ms = Math.abs(date2 - date1);
    //毫秒数除以一天的毫秒数,就得到了天数
    var days = Math.floor(ms / (24 * 3600 * 1000));
    return days;
  },
  // 获取某一时间的后一天
  getNextDateVal(val) {
    var curDate = new Date(val);
    var preDate = new Date(curDate.getTime() + 24 * 60 * 60 * 1000); // 前一天
    return this.getMyDate(preDate.getTime())
  },
  // 判断某一时间是否在某一时间段内
  dateParse(date) {
    /**
     * 日期解析，字符串转日期
     * @param date 可以为2017-02-16，2017/02/16，2017.02.16
     * @returns {Date} 返回对应的日期对象
     */
    let a = '-'
    let b = '/'
    let c = '.'
    let dateArray = []
    if (date.indexOf(a) > -1) {
      dateArray = date.split(a)
    } else if (date.indexOf(b) > -1) {
      dateArray = date.split(b)
    } else {
      dateArray = date.split(c)
    }
    return new Date(dateArray[0], dateArray[1] - 1, dateArray[2])
  },
  dateCompare(date, compareDat) {
    /**
     * 日期比较大小
     * compareDate大于date，返回1
     * 等于返回0；
     * compareDate小于date，返回-1
     * @param date 日期
     * @param compareDate 比较的日期
     */
    let dateTime = this.dateParse(date).getTime()
    let compareDateTime = this.dateParse(compareDat).getTime()
    if (compareDateTime > dateTime) {
      console.log('compareDat>date')
      return 1
    } else if (compareDateTime == dateTime) {
      console.log('compareDat=date')
      return 0
    } else {
      console.log('compareDat<date')
      return -1
    }
  },
  isDateBetween(date, startDate, endDate) {
    /**
     * 判断日期是否在区间内，在区间内返回true，否返回false
     * @param date 日期字符串
     * @param startDate 区间开始日期字符串
     * @param endDate 区间结束日期字符串
     * @returns {Number}
     */
    let flag = false
    let startFlag = (this.dateCompare(date, startDate) < 1)
    let endFlag = (this.dateCompare(date, endDate) > -1)
    if (startFlag && endFlag) {
      flag = true
    }
    return flag
  },
  isDateBetweenCurrent(date, startDate, endDate) {
    /**
     * 判断日期是否在区间内，在区间内返回true，否返回false
     * @param date 日期字符串
     * @param startDate 区间开始日期字符串
     * @param endDate 区间结束日期字符串
     * @returns {Number}
     */

    let severTime = new Date(date)
    let startTime = new Date(startDate)
    let endTime = new Date(endDate)

    let flag = false
    let startFlag = (startTime.getTime() - severTime.getTime() <= 0)
    let endFlag = (endTime.getTime() - severTime.getTime() >= 0)
    if (startFlag && endFlag) {
      flag = true
    }
    return flag
  },
  getzf(num) {
    if (parseInt(num) < 10) {
      num = '0' + num;
    }
    return num;
  },
  md5String(string) {
    return md5String(string)
  },
  // 生成随机数
  randomString() {
    function S4() {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }

    let uuid = (new Date()).getTime() + S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4();
    return uuid;
  },
  formatDate(date, fmt) {
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    let o = {
      'M+': date.getMonth() + 1,
      'd+': date.getDate(),
      'h+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds()
    }
    for (let k in o) {
      if (new RegExp(`(${k})`).test(fmt)) {
        let str = o[k] + ''
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1 ? str : this.getzf(str)))
      }
    }
    return fmt;
  },
  nextDate: function (n) {
    let d = (new Date()).getTime()
    d = d + 1000 * 60 * 60 * 24 * n;
    d = new Date(d);
    // var nextDate = startDate.getFullYear()+"-"+(startDate.getMonth()+1)+"-"+startDate.getDate();
    return d;
  },
  deepClone(obj) {
    return JSON.parse(JSON.stringify(obj))
  },
  getIsIphoneX_X: function () {
    // iPhone X、iPhone XS
    let isIPhoneX = /iphone/gi.test(window.navigator.userAgent) && window.devicePixelRatio && window.devicePixelRatio === 3 && window.screen.width === 375 && window.screen.height === 812;
    // iPhone XS Max
    let isIPhoneXSMax = /iphone/gi.test(window.navigator.userAgent) && window.devicePixelRatio && window.devicePixelRatio === 3 && window.screen.width === 414 && window.screen.height === 896;
    // iPhone XR
    let isIPhoneXR = /iphone/gi.test(window.navigator.userAgent) && window.devicePixelRatio && window.devicePixelRatio === 2 && window.screen.width === 414 && window.screen.height === 896;
    if (isIPhoneX || isIPhoneXSMax || isIPhoneXR) {
      return true
    }
    return false
  },
  getShortName: function (longname) {
    let shortname = longname;
    if (shortname.indexOf("省") != -1 || shortname.indexOf("市") != -1 || shortname.indexOf("区") != -1) {
      shortname = shortname.substring(0, shortname.length - 1);
    }
    return shortname;
  },
  areaEqual: function (area1, area2) {
    if (utils.getShortName(area1) == utils.getShortName(area2)) {
      return true;
    }
    return false;
  },
  isICBCApp: function () {
    const u = navigator.userAgent
    let isICBCAPP = u.indexOf('ICBCiPhoneBS') > -1 || u.indexOf('ICBCAndroidBS') > -1
    return isICBCAPP
  },
  isZTAPP: function () {
    const agent = navigator.userAgent
    let isZTAPP = agent.indexOf('sinopecapp') > -1;
    return isZTAPP
  },
  isIos: function () {
    const agent = navigator.userAgent
    return !!agent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // ios终端
  },
  isAndroid: function () {
    let u = navigator.userAgent;
    let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    // let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    return isAndroid
  },
  isWeiXin: function () {
    let ua = window.navigator.userAgent.toLowerCase()
    return ua.match(/MicroMessenger/i) == 'micromessenger'
  },
  isAlipay() {
    let u = navigator.userAgent;
    return u.indexOf('AlipayClient') > -1
  },
  //读取cookies
  getCookie: function (name) {
    let value = Cookie.get(name)
    return value;
  },
  objectKeys: function (object) {
    let result = []
    for (var key in Object(object)) {
      if (hasOwnProperty.call(object, key) && key != 'constructor') {
        result.push(key);
      }
    }
    return result;
  },
  // 百度坐标转成火星坐标
  bd_decrypt: function (bd_lon, bd_lat) {
    // return {
    //   gg_lon: bd_lon,
    //   gg_lat: bd_lat
    // }
    var X_PI = Math.PI * 3000.0 / 180.0;
    var x = bd_lon - 0.0065;
    var y = bd_lat - 0.006;
    var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * X_PI);
    var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * X_PI);
    var gg_lon = z * Math.cos(theta);
    var gg_lat = z * Math.sin(theta);
    return {
      gg_lon: gg_lon,
      gg_lat: gg_lat
    }
  },
  //添加url
  addParasToUrl: function (url, paras) {
    for (let key in paras) {
      if (url.indexOf("?") == -1) {
        url = url + '?' + key + '=' + paras[key];
      } else {
        url = url + '&' + key + '=' + paras[key];
      }
    }
    return url;
  },
  addWechatThirdID: function (url) {
    url = this.addParasToUrl(url, {userWechatMpOpenId: store.state.login.thirdUserId})
    return url;
  },

  isQQ: function () {
    const ua = navigator.userAgent.toLowerCase()
    return ua.match(/QQ/i) == 'qq'
  },
  isAndroidQQ() {
    if (utils.isAndroid()) {
      if (utils.isQQ() && utils.isQQBrowser()) {
        return true
      } else {
        return false
      }
    } else {
      return false
    }
  },
  isQQBrowser() {
    var ua = navigator.userAgent.toLowerCase()
    if (ua.indexOf('MQQBrowser') > -1) {
      return true
    } else {
      return false
    }
  },
  // 身份证获取生日
  getBirth: function (idCard) {
    let birthday = "";
    if (idCard != null && idCard != "") {
      if (idCard.length == 15) {
        birthday = "19" + idCard.slice(6, 12);
      } else if (idCard.length == 18) {
        birthday = idCard.slice(6, 14);
      }
      birthday = birthday.replace(/(.{4})(.{2})/, "$1年$2月") + '日';
      //通过正则表达式来指定输出格式为:1990-01-01
    }
    return birthday;
  },
  //身份证验证
  identityCodeValid: function (str) {
    var myreg = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx]$)/;
    if (str == "" || !myreg.test(str)) {
      return false;
    } else {
      var city = {
        11: "北京",
        12: "天津",
        13: "河北",
        14: "山西",
        15: "内蒙古",
        21: "辽宁",
        22: "吉林",
        23: "黑龙江 ",
        31: "上海",
        32: "江苏",
        33: "浙江",
        34: "安徽",
        35: "福建",
        36: "江西",
        37: "山东",
        41: "河南",
        42: "湖北 ",
        43: "湖南",
        44: "广东",
        45: "广西",
        46: "海南",
        50: "重庆",
        51: "四川",
        52: "贵州",
        53: "云南",
        54: "西藏 ",
        61: "陕西",
        62: "甘肃",
        63: "青海",
        64: "宁夏",
        65: "新疆",
        71: "台湾",
        81: "香港",
        82: "澳门",
        91: "国外 "
      };
      if (!city[str.substr(0, 2)]) {
        // tip = "地址编码错误";
        return false;
      }
      let sBirthday = str.substr(6, 4) + "-" + Number(str.substr(10, 2)) + "-" + Number(str.substr(12, 2));
      var d = new Date(sBirthday.replace(/-/g, "/"))
      if (sBirthday != (d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate())) {
        //alert("非法生日");
        return false;
      }
      let now = new Date();
      if (d > now || d == now) {
        return false;
      }
      //18位身份证需要验证最后一位校验位
      let strArr = str.split('');
      //∑(ai×Wi)(mod 11)
      //加权因子
      var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
      //校验位
      var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
      var sum = 0;
      var ai = 0;
      var wi = 0;
      for (var i = 0; i < 17; i++) {
        ai = strArr[i];
        wi = factor[i];
        sum += ai * wi;
      }
      var last = parity[sum % 11];
      if (parity[sum % 11] != strArr[17]) {
        return false;
      }
      return true;
    }
  },
  // //护照验证
  // checkPassport: function(code){
  //   if(!code || !/(^[K|k]{1}\d{8}$)|(^[E|e]{1}\d{8}$)|^[D|d|S|s|P|p|G|g]\d{8}$|^[E|e]{1}[A-Za-z]\d{7}$|^[SE|se|DE|de|PE|pe]{2}\d{7}$|(^[MA|ma]{2}\d{7}$)/.test(code)){
  //     return false;
  //   }
  //   return true;
  // },
  wechatBind: function () {
    let url = store.state.globalConfig.wechat_user_bindPage
    if (url && url != '' && url != undefined) {
      url = this.addWechatThirdID(url);
      window.location.href = url
    } else {
      router.push({
        path: '/usercenter/loginbinding',
        query: {
          thirdUserId: store.state.login.thirdUserId,
          code: store.state.login.code,
          regChannel: 4,
          firstLevel: true,
          bindType: 4
        }
      })
    }
  },
  formatImage(img) {
    if (img) {
      img = decodeURIComponent(img)
      if (img.indexOf('[') > -1) {
        // img = img.match(/^\[\"((?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?)\"\]/)[1]
        img = img.replace(/\"/g, '')
        img = img.substring(1, img.length - 1)
        img = img.split(',')
      } else {
        img = [img]
      }
    }
    return img
  },
  // 增加一个成员变量，让一秒只能跳一次登录
  canToLogin: true,
  toLogin() {
    if (this.canToLogin == false) {
      return;
    }
    this.canToLogin = false
    setTimeout(() => {
      this.canToLogin = true
    }, 1000)

    let redirectUrl = encodeURIComponent(Config.shareUrl + router.history.current.fullPath)
    // 兼容未升级小程序的情况
    if (store.state.globalConfig.wxmnp_update == 1) {
      redirectUrl = encodeURIComponent(`/pages/index/main?path=${redirectUrl}`)
    }
    // wxMnpLoginType微信小程登录类型，默认不传是走微信原生授权手机号登录， 1 是走vue项目自带的绑定登录
    if (store.state.webtype == 2 || store.state.login.wxMnpLoginType == 1) {
      if (store.state.deployType == '2') {
        // 老油惠通版本
        let yjUrl = window.location.host.indexOf('test') > -1 ? 'http://yijiewx.uhuitong.com' : 'https://www.uhuitong.com'
        window.location.replace(`${yjUrl}/wxweb/extend?actionUrl=${redirectUrl}`)
      } else {
        this.wechatBind();
      }
    } else if (store.state.webtype == 3) {
      wx.miniProgram.redirectTo({url: `/pages/register/main?redirectUrl=${redirectUrl}&updateToken=1`})
    } else if (store.state.webtype == 6) {
      my.redirectTo({url: `/pages/register/main?redirectUrl=${redirectUrl}`})
    } else if (store.state.deployType == '4') {
      let url = window.location.origin + '/site/app/#/login'
      bridgefunc.customPush({
        path: url
      })
    } else if (router.currentRoute.path != '/usercenter/login') {
      setTimeout(() => {
        if (store.state.globalConfig.can_use_yidun == '1') {
          if (store.state.yiDun.yidunInitLogin == true) {
            bridgefunc.yidunLogin((res) => {
              console.log('yidunLogin')
              console.log(res)
              let _res = decodeURIComponent(res)
              let newRes = JSON.parse(_res)
              if (newRes.result == '0') {
                router.push({
                  path: '/usercenter/login',
                });
              } else if (newRes.result == '1') {
                let token = newRes.token
                let accesscode = newRes.accesscode
                if (token && accesscode) {
                  this.yidunLogin(token, accesscode)
                } else {
                  Toast('易盾一键登录失败');
                }
              } else if (newRes.result == '2') {
                // 微信授权
                console.log('去做微信登录')
                // this.thirdLogin(1)
              } else if (newRes.result == '3') {
                // 支付宝授权
                console.log('去做支付宝登录')
                // this.thirdLogin(2)
              }
            })
          } else {
            router.push({
              path: '/usercenter/login',
            });
          }
        } else {
          router.push({
            path: '/usercenter/login',
          });
        }
      }, 100)
    }

    // else if (hybrid_app.isRELAndroid() || hybrid_app.isRELIphone()) {
    //     hybrid_app.merLogin((code) => {
    //       utils.icbcLogin(code)
    //     })
    //   }
  },
  icbcLogin(code) {
    Loading.open();
    return new Promise(((resolve, reject) => {
      let url = '/app/json/login/ICBCUserAutoLogin';
      http.post(url, {code: code}).then(res => {
          Loading.close();
          let data = res.data;
          if (data.status == 0) {
            console.log('------------------icbc登录------------------', data.data)
            userCenter.saveLoginData(data.data);
            if (data.data.token) {
              setTimeout(() => {
                window.location.reload()
              }, 20)
              resolve()
            }
          } else {
            reject()
            Toast(data.info ? data.info : '授权登录失败');
          }
        },
        err => {
          reject()
          Loading.close();
          Toast("授权登录失败");
        }
      )
    }))

  },
  thirdLogin: function (type) {
    if (type == 1) {
      // 微信登录
      bridgefunc.wxAuth((codeStr) => {
        if (codeStr == '') {
          Toast('微信授权失败');
        } else {
          this.wxLogin(codeStr)
        }
      });
    } else if (type == 2) {
      // 支付宝登录
      this.getAliLoginCodeStr();
    }
  },
  getAliLoginCodeStr: function () {

    Loading.open();
    let url = '/app/json/login/getAliLoginCodeStr';
    http.post(url, {}).then(res => {
        Loading.close();
        let data = res.data;
        if (data.status == 0) {
          bridgefunc.aliAuth(data.data, (str) => {
            let authDic = JSON.parse(decodeURIComponent(str));
            if (authDic.user_id == '') {
              Toast('支付宝授权失败');
            } else {
              this.zhifubaoLogin(authDic.auth_code)
            }
          });
        } else {
          Toast(data.info ? data.info : '支付宝授权登录失败');
        }
      },
      err => {
        Loading.close();
        Toast("支付宝授权登录失败");
      }
    )
  },
  async zhifubaoLogin(codeStr) {
    Loading.open();
    let url = '/app/json/login/aliLogin';
    let params = {
      code: codeStr,
    };
    http.post(url, params).then(res => {
        Loading.close();
        let data = res.data;
        if (data.status == 0) {
          Toast('登录成功');
          userCenter.retsetToIndex(data.data, 0);
        } else {

          if (data.errorCode == 1034) {//去绑定或者快速注册
            let authDic = {};
            authDic.user_id = data.info;
            authDic.auth_code = codeStr;
            this.toBind(authDic, '6');
          } else {
            Toast(data.info ? data.info : '支付宝授权登录失败');
          }
        }
      },
      err => {
        Loading.close();
        Toast("系统运行过程中遇到问题，请稍候再试");
      }
    )

  },
  wxLogin: function (codeStr) {
    Loading.open();
    let url = '/app/json/login/wechatLogin';
    let params = {
      code: codeStr,
    };

    http.post(url, params).then(res => {
        Loading.close();
        console.log(res.data)
        let data = res.data;
        if (data.status == 0) {
          Toast('登录成功');
          userCenter.retsetToIndex(data.data, 0);
        } else {

          if (data.errorCode == 1034) {//去绑定或者快速注册
            let authDic = {};
            authDic.user_id = data.info;
            authDic.auth_code = codeStr;
            this.toBind(authDic, '3');
          } else {
            Toast(data.info ? data.info : '微信授权登录失败');
          }
        }
      },
      err => {
        Loading.close();
        Toast("系统运行过程中遇到问题，请稍候再试");
      }
    )
  },
  toBind: function (authDic, regChannel) {
    MessageBox.confirm('是否已有账号？', '提示', {confirmButtonText: '去绑定', cancelButtonText: '去注册'}).then(action => {
      router.push({
        path: '/usercenter/loginbinding',
        query: {
          thirdUserId: authDic.user_id,
          code: authDic.auth_code,
          regChannel: regChannel,
          firstLevel: true,
          bindType: 1
        }
      })
    }).catch(action => {
      router.push({
        path: '/usercenter/loginbindingpw',
        query: {
          thirdUserId: authDic.user_id,
          code: authDic.auth_code,
          regChannel: regChannel,
          firstLevel: true,
          bindType: 2
        }
      })
    });
  },
  // 易盾一键登录
  yidunLogin: function (token, accesscode) {
    Loading.open()
    http.post('/app/json/login/netEasePhoneLogin', {
      code: token, // 易盾token
      authCode: accesscode // 运营商授权码
    }).then(
      res => {
        Loading.close()
        let data = res.data;
        if (data.status == 0) {
          userCenter.retsetToIndex(data.data, 1);
        } else {
          // 易盾一键登录  初始化
          Watchman.yidunLoginInit()
          Toast(data.info);
        }
      },
      error => {
        Loading.close();
        Toast('一键登录失败！')
        console.log(error);
      }
    );
  },
  // 闪验登录
  shanyanLogin: function (token) {
    let appSysname = 'android'
    if (utils.isIos()) {
      appSysname = 'ios'
    }

    Loading.open()
    http.post('/app/json/flash_sdk/getPhoneByFlashSdk', {
      flashSdkToken: token,
      appSysname: appSysname
    }).then(
      res => {
        Loading.close()
        let data = res.data;
        if (data.status == 0) {
          userCenter.retsetToIndex(data.data, 1);
        } else {
          Toast(data.info);
        }
      },
      error => {
        Loading.close();
        Toast('闪验登录失败！')
        console.log(error);
      }
    );
  },

  //通过短信登录
  toSmsLogin() {
    //当页面是/usercenter/justlogin  说明登录页面是默认是短信登录  所以直接返回即可
    if (router.history.current.path == '/usercenter/justlogin') {
      router.go(-1)
    } else {
      router.push({
        path: '/usercenter/codeverify',
      });
    }
  },
  checkVerifyCodeLenght: function (code) {
    console.log(code);
    // 蒙蒙说 没有配置默认4位
    let confLen = store.state.globalConfig.message_verify_code_length || 6
    if (code && code.length > confLen) {
      return code.substr(0, confLen);
    }
    return code
  },

  // 字符串在数组中的位置
  indexOfStringInArray: function (str, arr) {
    let arrLen = arr.length
    for (let i = arrLen - 1; i >= 0; i--) {
      if (arr[i] == str) {
        return i;
      }
    }
    return -1;
  },
  debounce: function (fn, delay) {
    let timer = null
    return function () {
      let context = this
      let arg = arguments
      clearTimeout(timer)
      timer = setTimeout(function () {
        fn.apply(context, arg)
      }, delay)
    }
  },
  wxmpBackHome: function (callback) {
    if (store.state.webtype == 3 && window.history.length <= 2) {
      wx.miniProgram.reLaunch({url: `/pages/index/main`})
    } else {
      callback && callback()
    }
  },
  /**
   * 下单场景(1:app 2:H5 3:公众号 4:小程序 5:线下 6:奋进石化)
   *   App(1, "app"),
   *   H5(2, "H5"),
   *   Mp(3, "公众号"),
   *   Mnp(4, "小程序"),
   *   Offline(5, "线下"),
   *   FJSH(6, "奋进石化"),
   *   ICBC_THIRD(7, "工行第三方支付"),
   *   DJLJY(8, "大家来加油"),
   *   PinganApp(9, "平安银行app"),
   *   RefuelCardApp(10, "加油卡掌上营业厅APP"),
   * submit 接口需要加入下单场景参数
   * orderScene
   */
  orderScene: function () {
    // app 1 h5 2 mp 3 mnp 4 offline 5 IS_FJSH 6
    let orderScene = 1
    if (store.state.webtype == 0) {
      // 调试模式下，都跟app一致
      orderScene = 2
    } else if (store.state.webtype == 1) {
      orderScene = 1
    } else if (store.state.webtype == 2) {
      orderScene = 3
    } else if (store.state.webtype == 3) {
      orderScene = 4
    } else if (store.state.webtype == 4) {
      orderScene = 7
    } else if (store.state.webtype == 7) {
      orderScene = 10
    }
    if (Cookie.get('IS_FJSH') == '1') {
      // 奋进石化场景
      orderScene = 6
    }
    // 平安保险
    if (store.state.loginChannel == 9) {
      orderScene = 9
    }
    return orderScene
  },
  dealPhone(phone) {
    let str = phone.substr(0, 3) + "****" + phone.substr(7)
    return str
  },
  // 身份证隐藏中间4位
  dealIds(idNum) {
    if (!idNum || idNum == '') {
      return ''
    }
    idNum += ''
    let str = idNum.substr(0, 3) + "******" + idNum.substr(idNum.length - 1)
    return str
  },
  /**
   * 火星坐标系 (GCJ-02) 与百度坐标系 (BD-09) 的转换
   * 即谷歌、高德 转 百度
   * @param lng
   * @param lat
   * @returns {*[]}
   */
  gcj02tobd09: function (lng, lat) {
    let x_PI = 3.14159265358979324 * 3000.0 / 180.0;
    let z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * x_PI);
    let theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * x_PI);
    let bd_lng = z * Math.cos(theta) + 0.0065;
    let bd_lat = z * Math.sin(theta) + 0.006;
    return [bd_lng, bd_lat]
  },
  /**
   * 处理经纬度小数位数
   * @param longLatVal
   * @returns {number}
   */
  longlatitude: function (longLatVal) {
    const longlat = parseFloat(longLatVal);
    if (isNaN(longlat)) {
      return 0;
    }
    //小数点保留六位
    if (longlat.toString().indexOf('.') > 0) {
      const longlatsplit = longLatVal.toString().split('.');
      if (longlatsplit.length >= 2) {
        return parseFloat(longlatsplit[0] === "" ? 0 : longlatsplit[0]) + parseFloat("." + longlatsplit[1].slice(0, 6));
      }
    }
    return longlat;
  },
  /**
   * 河北
   * 跳转到优惠券列表 main.js有说明
   */
  linkToCouponList() {
    if (PROJECT === 'cnpchb') {
      router.push({path: '/ykticketlist'})
    } else if (store.state.globalConfig.couponGroupMode == 1) { // 开启分组模式
      router.push({path: '/coupon_list2'})
    } else {
      router.push({path: '/coupon_list'})
    }
  },
  /**
   * 河北
   * 微店进入的二级页面 退出时清除微店code
   */
  removeStoreCode() {
    sessionStorage.removeItem('MICRO_StoreCode')
  },

  /**
   * 格式化数字
   * @param num: 需要格式化的数字
   * @param point:需要保留的小数（默认保留1位）
   * @returns {*} 返回数组 tranedNum 格式化的数据 unit 单位
   */
  tranNumber(num, point = 1) {
    if (!num) return ['0', '', '0']
    let numStr = ''
    let unit = ''
    let [integerStr, decimalsStr] = num.toString().split('.')

    if (integerStr.length < 6) {
      if (decimalsStr) {
        numStr = `${integerStr}.${decimalsStr.substr(0, point)}`
      } else {
        numStr = integerStr
      }
    }
    if (integerStr.length > 8) {
      let decimal = integerStr.substring(integerStr.length - 8, integerStr.length - 8 + point)
      let decimalStr = Number(decimal) === 0 ? '' : `.${decimal}`
      numStr = `${parseFloat(parseInt(num / 100000000))}${decimalStr}`
      unit = '亿'
    } else if (integerStr.length > 4) {
      let decimal = integerStr.substring(integerStr.length - 4, integerStr.length - 3 + point)
      decimal = Math.round((decimal * 1) / 10)
      let decimalStr = Number(decimal) === 0 || Number(decimal) === 10 ? '.0' : `.${decimal}`
      if (Number(decimal) === 10) {
        numStr = `${(parseFloat(parseInt(num / 10000))) + 1}${decimalStr}`
      } else {
        numStr = `${parseFloat(parseInt(num / 10000))}${decimalStr}`
      }
      unit = '万'
    }
    return [numStr, unit, numStr + unit]
  }
};
// window.callLogin = (code) => {
//   console.log('code', code)
//   utils.icbcLogin(code)
// }
// 返回在vue模板中的调用接口

export default utils
