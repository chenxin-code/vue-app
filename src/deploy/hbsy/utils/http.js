import Config from '@/api/config'
import axios from 'axios'
import {Toast, Dialog} from 'vant'
import Vue from 'vue'
import Cookie from 'js-cookie'
import qs from 'qs'
// import Jwx from './jwx'
Vue.use(Toast)
Vue.use(Dialog)
const Axios = axios.create({
  baseURL: Config.baseURL,
  timeout: 10000,
  responseType: 'json',
  withCredentials: false,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
  }
})

Axios.interceptors.request.use(
  config => {
    Toast.loading({
      mask: true,
      duration: 0
    })
    const token = Cookie.get('usertoken')
    if (config.method === 'post') {
      config.data = qs.stringify({
        ...config.data,
        token: token
      })
    } else if (config.method === 'get') {
      config.params = {
        ...config.params,
        token: token
      }
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 返回状态判断(添加响应拦截器)
Axios.interceptors.response.use(
  res => {
    // 对响应数据做些事
    Toast.clear()
    if (res.data.status == -1 && res.data.info.indexOf('用户信息为空') > -1) {
      Dialog.confirm({
        title: '提示',
        message: '用户信息失效, 请重新登录'
      }).then(() => {
        // Jwx.finishPage()
      })
    }
    return res
  },
  error => {
    Toast.clear()
    console.log(error)
    return Promise.reject(error)
  }
)

export default Axios
