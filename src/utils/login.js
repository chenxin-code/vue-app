import http from "./http";
import store from '../vuex/store'
import Toast from "../components/Vendor/toast";
import userCenter from "@/components/usercenter/js/userCenter";

export const getUserInfo = (updataToken = true) => {
  let token = store.state.login.token
  console.log('获取个人信息token',token)
  http.post('/app/json/user/getUserInfo', {token}).then(res => {
      let data = res.data;
      if (data.status == 0) {
        let userInfo = data.data
        userInfo.token = token
        userCenter.saveLoginData(userInfo, false, updataToken);
      } else {
        Toast(data.info ? data.info : '获取个人信息失败')
      }
    },
    err => {
      Toast("获取个人信息失败，请稍候再试")
    }
  )
}
