/**
 * Created by lirui on 2018/4/3.
 */
export function setLocalStorage (key, val) {
  val = JSON.stringify(val)
  return localStorage.setItem(key, val)
}
export function getLocalStorage (key) {
  return JSON.parse(localStorage.getItem(key))
}
export function removeLocalStorage (key) {
  return localStorage.removeItem(key)
}
export function setSessionStorage (key, val) {
  val = JSON.stringify(val)
  return sessionStorage.setItem(key, val)
}
export function getSessionStorage (key) {
  return JSON.parse(sessionStorage.getItem(key))
}
export function removeSessionStorage (key) {
  return sessionStorage.removeItem(key)
}
export const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
export function isWeiXin () {
  let ua = window.navigator.userAgent.toLowerCase()
  return ua.match(/MicroMessenger/i) == 'micromessenger'
}

export function delCookie (name) { // 为了删除指定名称的cookie，可以将其过期时间设定为一个过去的时间
  let date = new Date()
  date.setTime(date.getTime() - 10000)
  document.cookie = name + '=a; expires=' + date.toGMTString() + ';path=/'
}

export function setCookie (name, value, expiredays) {
  let exdate = new Date()
  exdate.setDate(exdate.getDate() + expiredays)
  document.cookie = name + '=' + escape(value) +
    ((expiredays == null) ? '' : ';expires=' + exdate.toGMTString()) + ';path=/'
}

export function getCookie (name) {
  if (document.cookie.length > 0) {
    let start = document.cookie.indexOf(name + '=')
    if (start !== -1) {
      start = start + name.length + 1
      let end = document.cookie.indexOf(';', start)
      if (end === -1) end = document.cookie.length
      return unescape(document.cookie.substring(start, end))
    }
  }
  return ''
}
export function getUrlParam(k, url) {
  url = url || window.location.href
  let _url = url.substr(url.indexOf('?'))
  let GETs = _url.slice(1).split('&')
  let GET = []
  for (let i = 0; i < GETs.length; i++) {
    let tmp_arr = GETs[i].split('=')
    let key = tmp_arr[0]
    GET[key] = tmp_arr[1]
  }
  return GET[k] || ''
}

// 当前时间戳格式化 年-月-日 时-分-秒
export function getPayTime () {
  var oDate = new Date(),
    oYear = oDate.getFullYear(),
    oMonth = oDate.getMonth() + 1,
    oDay = oDate.getDate(),
    oHour = oDate.getHours(),
    oMinute = oDate.getMinutes(),
    oSecond = oDate.getSeconds(),

    oTime = oYear + '-' + getzf(oMonth) + '-' + getzf(oDay) + ' ' + getzf(oHour) + ':' + getzf(oMinute) + ':' + getzf(oSecond);//最后拼接时间
  return oTime
}

export function getzf (num) {
  if (parseInt(num) < 10) {
    num = '0' + num
  }
  return num
}
