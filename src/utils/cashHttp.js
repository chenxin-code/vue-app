//【提现中心】ajax请求处理
import axios from "axios";
import QS from "qs";
import { Toast } from "vant";
import store from '../vuex/store'
import appLocalstorage from "@zkty-team/x-engine-module-localstorage";

const VUE_APP_TST = process.env.VUE_APP_TST;
const VUE_APP_TSM = process.env.VUE_APP_TSM;

export const HTTP = axios.create({
  withCredentials: false,
  timeout: 20000,
  headers: {}
});

//请求拦截
HTTP.interceptors.request.use(async config => {
  config.headers.access_channel = "mall";
  let ythToken;
  if (store.state.webtype == "2" || store.state.webtype == "3") {
    config.headers.Authorization = localStorage.getItem('ythToken')
  } else {
    ythToken = store.state.ythToken ? store.state.ythToken : localStorage.getItem("ythToken");
  }
  // ythToken = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiIxMzkyNTE4MjUzNSIsInNjb3BlIjpbImFsbCJdLCJpZCI6MjMzNjk0NDQzMDc3MjEzMDkyOSwiZXhwIjoxNjI4OTA4MTY0LCJhdXRob3JpdGllcyI6WyJ2aXNpdG9yIiwib3duZXIiXSwianRpIjoiMTRlNzVjYjEtOTY0Zi00MGFlLTkxNTItNjk3ZTdiMTQ0MzA1IiwiY2xpZW50X2lkIjoiYXBwX2MifQ.WGH_bHs0VyhDrEHgZKx-19LOiKm5SwwM372uJaimmfIBtF5AsZdtf5Khfts9RG_M9Fu121SUAWt2g5ZhcH3FXmxX0Z5QiombicWLB5SabF2z71rAoTDI1KpEkwlemwtGLP6_-PIVRXDxgxcW_9Gm8Z0NqmScdU7Gz6CP34zYlOPyPmK_6q8sqt2BIpi2mlD0qs5QkWRgFobK7xWsRJZp3UE8b1EKB4g35-xbGFPAhG0oCjXQgt9q3jz3gSOYa5Zs8UiiQ1e9WbBhRwSZnjHWqIKEbMwb2IrMy4LI3ZJjWXPww0rpXXsT9EdwFB6gk7duKJEA3e-5FlPfc9AA8W2FMQ"
  if (ythToken) {
    config.headers.Authorization = ythToken;
  }
  return config;
});

//处理参数
function handleParams (url, rawData, rawMethod) {
  const method = rawMethod.toUpperCase();
  let data = {};
  if (method === "GET") {
    data = {
      params: rawData
    };
  }
  switch (method) {
    case "GET":
      data = {
        params: rawData
      };
      break;
    case "POST":
    case "PUT":
    case "PATCH":
    case "DELETE":
      data = {
        data: rawData
      };
      break;
    default:
      data = {
        params: rawData
      };
      break;
  }
  return Promise.resolve({
    url,
    method,
    data
  });
}

//处理失败
async function handleFail (option) {
  console.log(option);
  const { error, reject } = option;
  const { response } = error;
  if (response) {
    Toast("请求失败");
  } else {
    var originalRequest = error.config;
    if (
      error.code == "ECONNABORTED" &&
      error.message.indexOf("timeout") != -1 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      Toast("请求超时");
    }
  }
  reject(error);
}

//默认header
let defaultHeader = {
  timezoneoffset: Math.abs(new Date().getTimezoneOffset() / 60),
  locale: "zh_CN",
  get: {
    "Content-Type": "application/x-www-form-urlencoded"
  }
};

let refresh = false;
let baseURL = ""
//定义白名单
var WXList = ["/oauth2/accessToken", "/api/wechat/js_sdk_signature"];
export const cashHttp = async (
  method = "GET",
  api,
  rawData = {},
  headers = {},
  params = {}
) => {
  return handleParams(api, rawData, method, headers, params).then(options => {
    if (!params.hideToast) {
      //   Toast.loading({
      //     message: "加载中...",
      //     duration: "toast",
      //     forbidClick: true
      //   });
    }
    return new Promise((resolve, reject) => {
      HTTP({
        baseURL: baseURL,
        withCredentials: false,
        url: options.url,
        method: options.method,
        headers: {
          ...defaultHeader,
          ...headers
        },
        ...options.data
      }).then(
        resp => {
          console.log("HTTP--->", resp);
          Toast.clear();
          const res = resp.data;
          // //如果接口返回了token就设置vuex
          // const Authorization = res.Authorization;
          // if (Authorization) {
          //   store.dispatch("user/setToken", Authorization);
          // }
          //处理特殊接口（无返回code时）
          var isWX = false;
          for (let i = 0; i < WXList.length; i++) {
            var node = WXList[i];
            if (node == api) {
              isWX = true;
              break;
            }
          }

          if (isWX == true) {
            resolve(res);
            return false;
          }

          if (res.code === 0) {
            resolve(res);
          } else {
            if (res.code === 401) {
              if (refresh) {
                resolve(res);
              } else {
                // refreshToken();
                resolve(res);
              }
            } else if (res.code !== 200) {
              if (res.message) {
                Toast({
                  message: res.message,
                  forbidClick: true
                });
              }
              resolve(res);
            } else {
              resolve(res);
            }
          }
        },
        error => {
          // NProgress.done()
          handleFail({
            error,
            reject,
            options
          });

          throw error;
        }
      );
    });
  });
};
