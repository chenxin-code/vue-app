<template>
  <div id="app" class="theme_sys_base" :class="theme">
    <van-nav-bar safe-area-inset-top />
    <!-- APP -->
    <!--@touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd"-->
    <!--<div id="app" class="theme_sys_base">-->

    <!--app结构请勿随意变动，利用耦合性写了部分代码，慎之-->

    <transition :name="$router.customRouterData.transitionName">
      <keep-alive ref="keep_alive" key="key_keepalive">
        <router-view
          :key="$route.path"
          class="router_class"
          v-if="$route.meta.keepAlive"
        />
      </keep-alive>
    </transition>
    <transition :name="$router.customRouterData.transitionName">
      <router-view
        :key="$route.path"
        class="router_class"
        v-if="!$route.meta.keepAlive"
      />
    </transition>
    <div class="backTop" @click="backTop" v-if="showBackTop">
      <img src="static/image/mall2/bcakTop.png" alt="" />
    </div>
    <div
      class="back-index"
      :class="{ ani: ani }"
      ref="back_index"
      :style="{ left: homeBtnX + 'px', top: homeBtnY + 'px' }"
      @touchmove="touchMove"
      @touchstart="touchStart"
      @touchend="touchEnd"
      v-show="showBackBtn($router.customRouterData.routerPaths)"
    >
      <transition-group
        :name="homeBtnSeat == 'right' ? 'backIndexBtn_r' : 'backIndexBtn_l'"
      >
        <!-- <div
          class="div-shy"
          v-show="isShy == true"
          key="backIndexBtn_shy"
          @click.stop="dontShy"
        >
          <img :src="appBackHomeImg" />
        </div> -->
        <!-- <div
          class="btn-img"
          :class="{ 'btn-img-left': homeBtnSeat == 'left' }"
          v-show="isShy == false"
          key="backIndexBtn"
          @click.stop="backIndex"
        >
          <img :src="appBackHomeImg" />
        </div> -->
      </transition-group>
    </div>
    <van-number-keyboard safe-area-inset-bottom />
    <!--    <BindOilCard :showPopup="showPopup" :messagePopup="messagePopup" :giftList="giftList" :cardList="cardList" :haveCard="haveCard" :phone="phone"></BindOilCard>-->
  </div>
</template>

<script>
// import Eruda from 'eruda'
import http from "@/utils/http";
import bridgefunc from "@/utils/bridgefunc";
import MessageBox from "./components/Vendor/messagebox";
import appUi from "@zkty-team/x-engine-module-ui";
import appNav from "@zkty-team/x-engine-module-nav";
import appLocalstorage from "@zkty-team/x-engine-module-localstorage";
import initSensors from "@/utils/sensors";
export default {
  name: "App",
  data() {
    return {
      doAnimate: true,
      routePathArrs: [],
      // transitionName: '',
      showBackIndex: false,
      isShy: true,
      myTimeout: null,
      loadTimes: 0,
      // showPopup: false, // 是否显示绑定加油卡弹框
      // haveCard: true, // 是否有卡
      // messagePopup: false, // 重要通知弹框
      // phone: '', // 绑卡手机号
      // giftList: [1, 2, 3], // 礼品列表
      // cardList: [1, 2], // 卡列表

      // 测滑返回相关的变量
      endBack: false, // 结束之后返回
      startX: 0,
      // startY: 0,
      moveX: 0,
      // moveY: 0,

      // homeBtn Y 轴位置
      homeBtnBeginTouchX: 0,
      homeBtnBeginTouchY: 0,
      homeBtnOrginX: 0,
      homeBtnOrginY: 0,
      homeBtnX: "none",
      homeBtnY: "none",
      homeBtnSeat: "right",

      ani: false,
      showBackTop: false,
      bulkRoutePath: [
        "/confirmOrder",
        "/purchase",
        "/bulkDetails",
        "/orderInfo"
      ]
    };
  },
  created() {
    // this.viewPortSet();
    console.log("this.$util.getIsIphoneX_X();", this.$util.getIsIphoneX_X());
    console.log(window.location.href);
    if (/mall-prod-app-linli/.test(window.location.href)) {
      this.$store.state.environment = "production";
    } else {
      this.$store.state.environment = "development";
    }
    console.log("环境变量", this.$store.state.environment);
    appNav
      .setNavBarHidden({
        isHidden: true,
        isAnimation: false
      })
      .then(res => {});
    this.windowResize();
    this.$store.state.microSho.carts = [];
    this.$store.state.microSho.groupbuyingCarts = [];
    //加多一个token获取
    var token =
      this.$util.getUrlQuery("ythToken") ||
      this.$util.getUrlQuery("Authorization");
    this.$store.commit("setYthToken", token);
    // this.$store.state.webtype == "2" || this.$store.state.webtype == "3"
    if (this.$store.state.webtype == "2" || this.$store.state.webtype == "3") {
      let initObj = {};
      console.log("localtion href", location.href);
      location.href
        .split("?")[1]
        .split("&")
        .forEach(item => {
          initObj[item.split("=")[0]] = item.split("=")[1];
        });
      if (initObj.ythToken == "" || initObj.ythToken == undefined) {
        initObj.ythToken = window.localStorage.getItem("ythToken");
      }
      this.$store.state.projectId = initObj.projectId;
      this.$store.state.projectId = 11111;
      // this.$store.state.ythToken = initObj.ythToken;
      localStorage.setItem("ythToken", initObj.ythToken);
      console.log("initObj", initObj);
      console.log("initObj.ythToken", initObj.ythToken);
      console.log("getYthUserInfo", this.$store.state.ythToken);
      this.$store.commit("setYthToken", initObj.ythToken);
      this.getYthUserInfo();
    } else {
      appLocalstorage.get({ key: "LLBToken", isPublic: true }).then(res => {
        this.$store.state.ythToken = res.result;
        console.log("---------------一体化token获取成功----------", res);
        console.log(
          "---------------this.$store.state.ythToken----------",
          this.$store.state.ythToken
        );
        this.$store.commit("setYthToken", res.result);
        this.getYthUserInfo();
      });
    }
    appLocalstorage.get({ key: "LLBUserRoomId", isPublic: true }).then(res => {
      if (res.hasOwnProperty("result")) {
        console.log("---------------人房id获取成功----------", res);
        this.$store.state.userRoomId = res.result;
      } else {
        console.log("---------------人房id获取失败----------", res);
        this.$store.state.userRoomId = "";
      }
    });
    // this.$http.post('/app/json/user/getUserSummary',{deliveryType:'2',orderCategory:'0'}).then(res=>{
    //   console.log('/app/json/user/getUserSummary',res.data.data.userInfo.phone)
    //   this.getUserTable(res.data.data.userInfo.phone)
    // })
    // appLocalstorage.get({ key: "LLBPhone_encrypt",isPublic: true }).then(res => {
    //   console.log('加密手机号',res)
    // });
  },
  computed: {
    appBackHomeImg() {
      // if (this.$store.state.globalConfig.appBackHomeImg) {
      //   return this.$store.state.globalConfig.appBackHomeImg
      // } else {
      //   return require('./assets/app/home.png')
      // }
    },

    theme() {
      let theme = "theme_sys_base";
      const themeColor = this.$store.state.globalConfig.themeColor;
      if (themeColor === "blue") {
        theme = "theme_sys_blue";
      } else if (themeColor === "zm") {
        theme = "theme_sys_zm";
      } else if (themeColor === "orange") {
        theme = "theme_sys_orange";
      } else if (themeColor === "chum") {
        theme = "theme_sys_chum";
      }
      if (theme) {
        document.body.classList.add(theme);
      }
      return theme;
    }
  },
  mounted() {
    sessionStorage.setItem("js_css_loaded", "1");
    this.phone = this.$store.state.login.phone;
    if (
      this.$store.state.login.token &&
      this.$store.state.deployType == "2" &&
      this.$store.state.webtype == "1" &&
      this.$store.state.globalConfig.isShowHbOilMessageBox == 1
    ) {
      // 有token 油惠通环境  APP 配置项isShowHbOilMessageBox为1开启
      this.oilIsOpen();
    }
    this.storeRecommend();

    // 注册通知回调Watchman.yidunLoginInit()
    this.$bridgefunc.registeBridge("notificationCallBack", () => {
      this.$bridgefunc.getItem("notificationU", res => {});
    });

    // 注册appjump回调
    this.$bridgefunc.registeBridge("appjumpCallBack", () => {
      this.$bridgefunc.getItem("appjumpU", res => {
        // res 是编码后的json字符串
        let resStr = decodeURIComponent(res);
        let resJson = JSON.parse(resStr);
        let weburl = resJson.weburl;
        let islogin = resJson.islogin;
        let isnativetop = resJson.isnativetop;
        if (weburl == "") {
        } else if (weburl.indexOf("http") == 0) {
        } else {
          this.$market.customPush(
            {
              path: weburl
            },
            islogin
          );
        }
        this.$bridgefunc.removeItem("appjumpU");
      });
    });

    //页面加载出来执行vueLoaded
    this.$bridgefunc.vueLoaded();

    // if (this.$store.state.webtype == '7') {
    //   Eruda.init()
    // }
    console.log("process.env.NODE_ENV", process.env.NODE_ENV);
    if (process.env.NODE_ENV == "development") {
      initSensors();
    }
  },
  methods: {
    // getUserTable(phone){
    //   this.$http.post('/app/json/customer_service/findHeadInfoByList',{
    //     userId:phone,
    //     keyType:2,
    //   }).then(res=>{
    //     let data = JSON.parse(res.data.data);
    //     let arr = [];
    //     data.longTable.forEach(e=>{
    //       if(e.labelName != '证件号码' && e.labelName != '证件类型'){
    //         arr.push({label:e.labelName, value:e.labelValue?e.labelValue:'无'})
    //       }
    //     })
    //     console.log('this.$store.state.userLable',arr)
    //     this.$store.state.userLable = JSON.stringify(arr);
    //   })
    // },

    //获取一体化信息
    getYthUserInfo() {
      let token = "";
      if (
        this.$store.state.webtype == "2" ||
        this.$store.state.webtype == "3"
      ) {
        token = localStorage.getItem("ythToken");
      } else {
        token = this.$store.state.ythToken;
      }
      //加多一个token获取
      token =
        token ||
        this.$util.getUrlQuery("ythToken") ||
        this.$util.getUrlQuery("Authorization");
      this.$store.commit("setYthToken", token);
      this.$http
        .post("/app/json/login/getYthUser", { token: token })
        .then(res => {
          if (res.data.status == 0) {
            this.$store.state.ythUserInfo = res.data.data;
            console.log("一体化信息", this.$store.state.ythUserInfo);
            this.$store.state.ythUser = {
              userImage: res.data.data.userImage,
              userName: res.data.data.userName
            };
            initSensors();
            if (
              this.$store.state.webtype != 2 &&
              this.$store.state.webtype != 3
            ) {
              this.postAvatar(res.data.data.userImage);
            }
            this.getDistributionInfo(res.data.data.phone);
            let that = this;
            this.$sensors.quick("isReady", function() {
              console.log(
                "sensors.quick('getAnonymousID');",
                that.$sensors.quick("getAnonymousID")
              );
              that.postSensorsData(
                that.$sensors.quick("getAnonymousID"),
                res.data.data.id
              );
            });
          }
        });
    },
    postSensorsData(anonymousID, userID) {
      this.$http
        .post(
          `/app/json/sensors_analytics/sensorsAnalyticsInit?anonymousID=${anonymousID}&userID=${userID}`
        )
        .then(res => {
          console.log(res);
        });
    },
    postAvatar(avatar) {
      console.log("头像", avatar);
      this.$http
        .post("/app/json/user/modifyHeadImg", { headImg: avatar })
        .then(res => {
          console.log("头像返回", res);
        });
    },
    getDistributionInfo(phone) {
      let distributionUrl = "";
      // this.$store.state.ythUserInfo.phone
      this.$store.state.environment == "development"
        ? (distributionUrl = `https://mall-uat-web-linli.timesgroup.cn/distr-service/customer/api/v1/distr/get_simple_data?customerPhone=${phone}`)
        : (distributionUrl = `https://mall-prod-web-linli.timesgroup.cn/distr-service/customer/api/v1/distr/get_simple_data?customerPhone=${phone}`);
      this.$http
        .get(distributionUrl)
        .then(res => {
          if (res.data.code == 200) {
            if (res.data.data) {
              this.$store.state.distributionPersonDetail = res.data.data;
            } else {
              this.$store.state.distributionPersonDetail = {
                customerHeaderPic: "",
                customerId: "",
                customerName: "",
                distributorId: "",
                distributorName: "",
                parentDistributorId: -1,
                source: ""
              };
            }
          }
        })
        .catch(err => {
          this.$Toast(err);
        });
    },

    backTop() {
      let scrollElement = "";
      if (this.$route.matched[0].path == "/mall2/list/:id") {
        scrollElement = "scroll-container";
      } else if (this.$route.path == "/common") {
        scrollElement = "scroll-div";
      }
      document.getElementsByClassName(scrollElement)[0].scrollTop = 1;
    },
    oilIsOpen() {
      http
        .post("/app/json/app_youdi/getAcctInfoList", {
          token: this.$store.state.login.token
        })
        .then(res => {
          let data = res.data;
          if (data.status == 0) {
            if (
              data.data.length == 0 ||
              !data.data ||
              (data.data && data.data.state == 0)
            ) {
              /**
               * 获取弹框次数
               */
              http
                .post("/app/json/user/getPopTimes", {
                  token: this.$store.state.login.token
                })
                .then(res => {
                  let data = res.data;
                  if (data.status == 0) {
                    if ((data.data && Number(data.data) < 2) || !data.data) {
                      MessageBox.confirm(
                        "油惠通诚邀您开通油滴账户，开通后加油购物均可赠送油滴。油滴可以抵现，也可以换购其他优惠哦~",
                        "提示",
                        {
                          confirmButtonText: "去开启",
                          cancelButtonText: "再想想"
                        }
                      )
                        .then(action => {
                          let url =
                            window.location.origin +
                            "/app-vue/oildrop/user-identity-information-query";
                          bridgefunc.customPush({
                            path: url,
                            isVuePage: false,
                            isnativetop: true
                          });
                        })
                        .catch(action => {});
                      /**
                       * 弹框一次 增加一次次数
                       */
                      http
                        .post("/app/json/user/savePopTimes", {
                          token: this.$store.state.login.token
                        })
                        .then(res => {});
                    }
                  }
                });
            }
          }
        });
    },
    showBackBtn(routePathArrs) {
      if (this.$store.state.globalConfig.prohibited == 1) return false;
      if (this.$store.state.webtype == "3") {
        if (routePathArrs.length > 0) {
          let lastRoute = routePathArrs[routePathArrs.length - 1];
          return !(
            lastRoute == "/live-stream/list" ||
            lastRoute == "/live-stream/share" ||
            lastRoute == "/usercenter/loginbinding"
          );
        }
        return true;
      }
      if (routePathArrs.length >= 3) {
        let lastRoute = routePathArrs[routePathArrs.length - 1];
        return !(
          lastRoute == "/usercenter/login" ||
          lastRoute == "/usercenter/codeverify" ||
          lastRoute == "/usercenter/forgetpassword" ||
          lastRoute == "/usercenter/register" ||
          lastRoute == "/usercenter/agreement" ||
          lastRoute == "/historyDetail" ||
          lastRoute == "/live-stream/list" ||
          lastRoute == "/live-stream/share"
        );
      } else {
        // // 为了效率，这里代码写上去了
        // else if (this.$store.state.webtype == '3') {
        //   return true
        // }
        return false;
      }
    },
    touchStart: function(ev) {
      ev = ev || event;
      if (ev.touches.length == 1) {
        //tounches类数组，等于1时表示此时有只有一只手指在触摸屏幕
        this.homeBtnBeginTouchX = ev.touches[0].clientX; // 记录开始位置
        this.homeBtnBeginTouchY = ev.touches[0].clientY; // 记录开始位置
        let dom = this.$refs.back_index;
        this.homeBtnOrginX = dom.offsetLeft;
        this.homeBtnOrginY = dom.offsetTop;
      }
    },
    touchMove: function(ev) {
      ev = ev || event;
      if (ev.touches.length == 1) {
        //tounches类数组，等于1时表示此时有只有一只手指在触摸屏幕
        this.homeBtnX =
          this.homeBtnOrginX -
          (this.homeBtnBeginTouchX - ev.touches[0].clientX);
        this.homeBtnY =
          this.homeBtnOrginY -
          (this.homeBtnBeginTouchY - ev.touches[0].clientY);
      }
    },
    touchEnd: function(ev) {
      // clientWidth
      this.ani = true;
      this.$nextTick(() => {
        let dom = this.$refs.back_index;
        if (
          dom.offsetLeft + dom.offsetWidth / 2 <
          this.$store.state.clientWidth / 2
        ) {
          this.homeBtnX = -16;
          this.homeBtnSeat = "left";
        } else {
          this.homeBtnSeat = "right";
          this.homeBtnX = this.$store.state.clientWidth - dom.offsetWidth + 16;
        }
        setTimeout(() => {
          this.ani = false;
        }, 300);
      });
    },
    dontShy: function() {
      this.isShy = false;
      this.myTimeout = setTimeout(() => {
        this.isShy = true;
      }, 3000);
    },
    // 返回首页，这里很low但是没bug，切最简单，需要找机会处理
    backIndex: function() {
      // 返回首页时清除 微店code（河北）
      this.$util.removeStoreCode();
      if (this.$store.state.webtype == 3) {
        wx.miniProgram.reLaunch({ url: `/pages/common/home/index` });
        return;
      }
      let num = this.$router.customRouterData.routerPaths.length - 1;
      // for (let i = num; i > 0; i--) {
      this.$router.go(-num);
      // }
      this.$keepaliveHelper.deleteOthers(this);
    },

    //分享推荐人存储
    storeRecommend: function() {
      let recommend = this.$util.getUrlParam(window.location.href, "recommend");
      let recommendPhone = this.$util.getUrlParam(
        window.location.href,
        "recommendPhone"
      );
      if (recommend && recommendPhone) {
        sessionStorage.setItem("recommend", recommend);
        sessionStorage.setItem("recommendPhone", recommendPhone);
      }
    },
    // bottomChange: function () {
    //   if (this.$util.getIsIphoneX_X()) {
    //     return 'bottom: 34px;'
    //   } else {
    //
    //   }
    // },
    setThemeClass: function() {
      let oldTheme = this.theme;
      document.body.classList.add("theme_sys_base");
      if (this.$store.state.globalConfig.themeColor == "blue") {
        document.body.classList.add("theme_sys_blue");
        this.theme = "theme_sys_blue";
      } else if (this.$store.state.globalConfig.themeColor == "zm") {
        document.body.classList.add("theme_sys_zm");
        this.theme = "theme_sys_zm";
      } else if (this.$store.state.globalConfig.themeColor == "orange") {
        document.body.classList.add("theme_sys_orange");
        this.theme = "theme_sys_orange";
      } else {
        this.theme = "";
      }

      let classVal = document.getElementById("app").getAttribute("class");
      if (oldTheme != "") {
        classVal = classVal.replace(oldTheme, this.theme);
      } else {
        classVal = classVal.concat(" " + this.theme);
      }
      document.getElementById("app").setAttribute("class", classVal);
    },
    viewPortSet: function() {
      var viewportTag = null;
      var metaTags = document.getElementsByTagName("meta");
      if (!viewportTag) {
        viewportTag = document.createElement("meta");
        viewportTag.setAttribute("name", "viewport");
      }

      var viewportTagContent =
        "width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no";

      // Detect if iOS device
      if (/(iPhone|iPod|iPad)/i.test(window.navigator.userAgent)) {
        // Get iOS major version
        var iosVersion = parseInt(
          window.navigator.userAgent.match(
            /OS (\d+)_(\d+)_?(\d+)? like Mac OS X/i
          )[1]
        );
        // Detect if device is running >iOS 11
        // iOS 11's UIWebView and WKWebView changes the viewport behaviour to render viewport without the status bar. Need to override with "viewport-fit: cover" to include the status bar.
        if (iosVersion >= 11) {
          viewportTagContent += ", viewport-fit=cover";
        }
      }

      // Update viewport tag attribute
      viewportTag.setAttribute("content", viewportTagContent);
    },
    // stringOfIndex: function (str) {
    //   let arrLen = this.routePathArrs.length
    //   for (let i = arrLen - 1; i >= 0; i--) {
    //     if (this.routePathArrs[i] == str) {
    //       return i;
    //     }
    //   }
    //   return -1;
    // },
    windowResize: function() {
      window.onresize = () => {
        this.$store.state.clientWidth = document.documentElement.clientWidth;
      };
    }
  },
  watch: {
    "$store.state.isShowBackTop"(a) {
      this.showBackTop = a;
    },
    "$route.path": function(newVal, oldVal) {
      //app环境
      if (/^\/common$/.test(newVal) || /^\/error$/.test(newVal)) {
        appUi.showTabbar && appUi.showTabbar();
      } else {
        appUi.hideTabbar && appUi.hideTabbar();
      }
      document.title = "时代星选";
      console.log("document.title", document.title);
      if (
        this.$store.state.webtype !== "3" &&
        this.$store.state.webtype !== "2"
      ) {
        const rate = window.screen.height / window.screen.width;
        let limit =
          window.screen.height == window.screen.availHeight ? 1.8 : 1.65; // 临界判断值
        // window.screen.height为屏幕高度
        //  window.screen.availHeight 为浏览器 可用高度
        if (rate > limit) {
          this.$store.state.isX = true;
        } else {
          this.$store.state.isX = false;
        }
      }
      console.log("$store.state.isX", this.$store.state.isX);
    },
    "$route.matched"(value) {
      if (value.length !== 0) {
        if (
          value[0].path !== "/common" &&
          value[0].path !== "/common2/:id" &&
          value[0].path !== "/purchase" &&
          value[0].path !== "/confirmOrder" &&
          value[0].path !== "/bulkDetails" &&
          value[0].path !== "/orderInfo"
        ) {
          // 判断是否是刘海屏
          const rate = window.screen.height / window.screen.width;
          let limit =
            window.screen.height == window.screen.availHeight ? 1.8 : 1.65; // 临界判断值
          // window.screen.height为屏幕高度
          //  window.screen.availHeight 为浏览器 可用高度
          if (rate > limit) {
            if (
              this.$store.state.webtype !== "3" &&
              this.$store.state.webtype !== "2"
            ) {
              if (value[0].path == "/mall2/detail/:id") {
                document.getElementsByTagName("body")[0].style.paddingTop =
                  "1.17333rem";
              } else {
                document.getElementsByTagName("body")[0].style.paddingTop =
                  "0.4rem";
              }
              this.$store.state.notIndexIsX = true;
            }
          }
        } else {
          document.getElementsByTagName("body")[0].style.paddingTop = "0rem";
        }
        console.log('$store.state.isShowBackTop',this.$store.state.isShowBackTop);
        if (
          (value[0].path == "/common" || value[0].path == "/mall2/list/:id") &&
          this.$store.state.isShowBackTop
        ) {
          this.showBackTop = true;
        } else {
          this.showBackTop = false;
        }
      }
    }
    // '$route'(to, from) {
    //   let arr = sessionStorage.getItem("routePathArrs");
    //   if (arr && arr != undefined) {
    //     arr = JSON.parse(arr)
    //     if (arr && arr != undefined && arr.constructor === Array) {
    //       this.routePathArrs = arr;
    //     }
    //   }
    //   // 特殊场景下进入页面
    //   // const isSpecialPush = this.$store.state.isSpecialPush
    //   if (isSpecialPush == true) {
    //     this.$store.state.isSpecialPush = false
    //     // 左滑进入，添加进数组
    //     this.routePathArrs.push(to.path);
    //     this.transitionName = 'slide_left';
    //   } else {
    //     let toI = this.stringOfIndex(to.path)
    //     // to.path 数组中不存在
    //     if (toI == -1) {
    //       // to.path 为首页，设置为数组中的第一项，然后动画不用
    //       if (to.path == '/common') {
    //         this.routePathArrs = []
    //         this.routePathArrs.push(to.path);
    //         this.transitionName = '';
    //       } else {
    //         // 左滑进入，添加进数组
    //         // if (this.routePathArrs.length == this.$children.length) {
    //         //   this.routePathArrs.pop()
    //         // }
    //         this.routePathArrs.push(to.path);
    //         this.transitionName = 'slide_left';
    //       }
    //     } else {
    //       // 所有去首页的都是又滑，并且数据重置
    //       if (to.path == '/common') {
    //         this.routePathArrs = []
    //         this.routePathArrs.push(to.path);
    //         this.transitionName = 'slide_right';
    //       } else {
    //         let fromI = this.stringOfIndex(from.path)
    //         // console.log(fromI, toI)
    //         if (fromI - toI == 1) {
    //           // 除了特殊场景一定是返回
    //           this.routePathArrs.pop();
    //           this.transitionName = 'slide_right';
    //         } else {
    //           let len = fromI - toI;
    //           // 跨多个组件返回
    //           for (let i = 0; i < len; i++) {
    //             this.routePathArrs.pop();
    //           }
    //           this.transitionName = 'slide_right';
    //         }
    //       }
    //     }
    //   }
    //   sessionStorage.setItem("routePathArrs", JSON.stringify(this.routePathArrs));
    // },
    // '$router.customRouterData.routerPaths': function () {
    //   let routePathArrs = this.$router.customRouterData.routerPaths
    //   console.log(routePathArrs)
    //   if (routePathArrs.length >= 3 && this.$store.state.webtype == '1') {
    //     let lastRoute = routePathArrs[routePathArrs.length-1]
    //     if (lastRoute == '/usercenter/login' || lastRoute == '/usercenter/codeverify' || lastRoute == '/usercenter/forgetpassword' || lastRoute == '/usercenter/register' || lastRoute == '/usercenter/agreement') {
    //       this.showBackIndex = false;
    //     } else {
    //       this.showBackIndex = true;
    //     }
    //   } else if (this.$store.state.webtype == '3') {
    //     this.showBackIndex = true;
    //   } else {
    //     this.showBackIndex = false;
    //   }
    // }
  },
  components: {
    // BindOilCard
  }
};
</script>

<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';

#app {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  background-color: #fff;
  /* font-family -apple-system,sans-serif */
  font-family: BlinkMacSystemFont, 'Source Sans Pro', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  .backTop {
    position: fixed;
    bottom: 170px;
    right: 10px;
    z-index: 9999;

    img {
      width: 40px;
      height: 40px;
    }
  }

  .router_class {
    position: absolute;
    left: 0px;
    right: 0px;
    top: 0;
    bottom: 0;
    background-color: white;
    z-index: 50;
  }

  .back-index {
    position: absolute;
    right: -16px;
    bottom: 200px;
    width: 46px;
    height: 42px;
    z-index: 100;

    img {
      display: block;
      width: 35px;
      height: 35px;
    }

    .div-shy {
      position: absolute;
      right: 0px;
      background-color: white;
      border: 0.5px solid #F80F16;
      border-radius: 20px;
      padding: 3px;
    }

    .btn-img {
      position: absolute;
      right: 30px;
      background-color: white;
      border: 0.5px solid #F80F16;
      border-radius: 20px;
      padding: 3px;

      &.btn-img-left {
        right: -20px;
      }
    }
  }
}

.backIndexBtn_r-enter-active, .backIndexBtn_r-leave-active, .backIndexBtn_l-enter-active, .backIndexBtn_l-leave-active {
  transition: all 0.3s ease-in;
}

.backIndexBtn_r-enter, .backIndexBtn_r-leave-to {
  transform: translateX(120%);
}

.backIndexBtn_l-enter, .backIndexBtn_l-leave-to {
  transform: translateX(-120%);
}

.ani {
  transition: all 0.3s ease-in;
}

@keyframes backBtn-touchend {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.8);
  }

  100% {
    transform: scale(1);
  }
}

.slide_left-enter-active, .slide_left-leave-active, .slide_right-enter-active, .slide_right-leave-active {
  transition: all 0.3s;
}

.slide_left-leave-to, .slide_right-leave-to {
  opacity: 0;
  // transform: translateX(-100%);
}

.slide_left-enter {
  opacity: 1;
  transform: translateX(100%);
}

.slide_right-enter {
  opacity: 1;
  transform: translateX(-100%);
}
</style>
