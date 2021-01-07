import Http from './http'
import Store from '../vuex/store'
import Loading from '@/components/Vendor/Loading/index'
// import {Toast} from "vant";
import Toast from '../components/Vendor/toast'

const request = {
  post(url, arg = {}) {
    let hasLoading = false
    if (!arg.hideLoading) {
      hasLoading = true
      Loading.open()
    }
    if (arg.hasOwnProperty('hideLoading')) {
      delete arg.hideLoading
    }
    return new Promise((resolve, reject) => {
      Http.post(url, {token: Store.state.login.token, ...arg}).then(res => {
        resolve(res.data)
        if (hasLoading) Loading.close()
      })
      .catch(err => {
        // 这里注释导致了loading没法取消，所以放开了
        // reject(err)
        // Toast('接口出错')
        if (hasLoading) Loading.close()
      })
    })
  }
}
export default request
