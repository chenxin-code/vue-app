import axios from "axios";
import QS from "qs";
import { Toast } from "vant";
import store from '../vuex/store'
import appLocalstorage from "@zkty-team/x-engine-module-localstorage";

const VUE_APP_TST = process.env.VUE_APP_TST;
const VUE_APP_TSM = process.env.VUE_APP_TSM;

console.log(
  "VUE_APP_TST--->",
  process.env.VUE_APP_TST,
  process.env.VUE_APP_TSM
);

export const HTTP = axios.create({
  withCredentials: false,
  timeout: 20000,
  headers: {}
});

//请求拦截
HTTP.interceptors.request.use(async config => {
  config.headers.access_channel = "mall";
let ythToken;
ythToken = store.state.ythToken? store.state.ythToken:localStorage.getItem("ythToken");

// ythToken ="eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiIxMzU2MDA4NjkyNSIsInNjb3BlIjpbImFsbCJdLCJpZCI6MjQwNTYyMDM5MDg5OTQ4MjY4MSwiZXhwIjoxNjI1NDQ3ODY0LCJhdXRob3JpdGllcyI6WyJ2aXNpdG9yIl0sImp0aSI6IjNlNzM2YjE4LTQzMmEtNGY1OS04Njk5LWUxMjJkY2ZiMDQwOSIsImNsaWVudF9pZCI6ImFwcF9jIn0.UGhQDskBQJMfooam0Xe8dixTms2fxnGe9wYsKaysO_ipRNEX8OutF0SzyQalvYfINdV2iNzVYsclOHgO9TpA2Q2n4i-fPcCds7m6QC4Wcyi14uLcCdQrnlh01L5hlsJfaiRXwBr7PpCoX1iaY7UtJW9D6eO1nNKM8rQ9BiA2QFd-uPRZPkSF3_S9RCeNBMEDqAJ0nQhApvUUJ3HFmu6hao00FJUnA-0Sdaihpv5d7BbKsUGPg6gV04N5uKOnNzMFSbkFX_SO1oPFM-UDooVFW7MZYrsbhx9e41jTSdENNUWejgo86ywbujHUXHZOlNIEDy1iEjw5pFygaZfuafKlwg";
/*思维的token*/
// ythToken ="eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiIxMzU2MDU0MzgzOCIsInNjb3BlIjpbImFsbCJdLCJpZCI6MjQwNTU0OTA2MDA4MjYzMTg0MCwiZXhwIjoxNjI3OTkyNzk1LCJhdXRob3JpdGllcyI6WyJ2aXNpdG9yIiwib3duZXIiXSwianRpIjoiNmRlMmU5ZTQtY2JmNy00MWY1LWEzMjctMDcyNDUxMDE0YzFlIiwiY2xpZW50X2lkIjoiYXBwX2MifQ.ZNwTNbh63s1XTCkSS1J0iDs6XhOocjSDm14kbA6UVJRQ0zUJHaXiVlXAeFnsZIAdzSIeGUC1DZ8tRcCVE8rwUFVJA5yemUguisf84-t8-gTs9lha9BookJ2tAA8m_51hmRSPIEF_r1_dS1vvstr6-JO2kIwjl832mxkuC81dw3aaIpYJIWB7L1sw35SEQId4beDXdGAkF3lbfrzbqsSHhpeQKQX27tayaoEmaZM721yGSohdrk9EIT8vFqLR_ZPNf0b7RoAqjm6lzHTbxNygJ36J95pLwe9ua3T3fbXGw5uONao_vCnWLlUfl5YxIyXjiYZhi9_u8xe9OVlliOxq2w"
if (ythToken) {
    config.headers.Authorization = "Bearer " + ythToken;
}
  return config;
});

//处理参数
function handleParams(url, rawData, rawMethod) {
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
async function handleFail(option) {
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

//定义白名单
var WXList = ["/oauth2/accessToken", "/api/wechat/js_sdk_signature"];
export const fetchMethod = async (
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
        baseURL: process.env.VUE_APP_TMASS_API,
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
          //如果接口返回了token就设置vuex
          const Authorization = res.Authorization;
          if (Authorization) {
            store.dispatch("user/setToken", Authorization);
          }
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