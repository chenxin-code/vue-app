<template>
  <div class="top-nav" :class="{ pfixed: usePorpData }">
    <div
      class="default-div default-div-bg"
      v-if="myData.type == 'default'"
      :style="getStyleHeaderBg(myData)"
    >
      <div
        class="flex-box"
        :style="{ 'min-height': this.$market.getNavHeight() + 'px' }"
      >
        <!--<div class="back-div" @click="hotEvent('backNav');$market.backNav()">-->
        <!--<img width="16px" height="16px" src="static/images/header/back.png"/>-->
        <!--</div>-->
        <div
          class="nav-top-title"
          :style="{
            'line-height': this.$market.getNavHeight() + 'px',
            color: myData.titleColor,
          }"
        >
          {{ myData.title }}
        </div>
      </div>
    </div>
    <div
      class="default-div"
      v-if="myData.type == 'custom'"
      :style="getStyleHeaderBg(myData)"
    >
      <div class="bg-div" :style="getBgDivStyle(myData)"></div>
      <div
        class="user-msg"
        :class="{ 'deeper-text': myData.isFloat != true || scrollSite > 60 }"
        :style="{ top: barHeight + 'px' }"
        v-if="$store.state.login.token != '' && myData.isShowUserMessage"
      >
        尊敬的{{ $store.state.mall2.myAssets.levelNoStr }}会员，您的积分余额：{{
          $store.state.mall2.myAssets.surplusPoints
        }}
      </div>
      <div
        class="flex-div"
        :style="{
          'min-height': this.$market.getNavHeight(true) + 'px',
          backgroundImage: `url(${myData.bgImgUrl2})`,
        }"
        v-if="myData.bgStyle != 'white'"
      >
        <div
          class="nav-top-title"
          v-if="myData.middelControl == 'title'"
          :style="{
            'line-height': this.$market.getNavHeight(true) + 'px',
            height: this.$market.getNavHeight(true) + 'px',
            color: myData.titleColor,
          }"
        >
          {{ myData.title }}
        </div>
        <div
          class="img-btn-pading space-margin"
          :class="{
            'img-btn-bg': myData.isFloat == true && scrollSite < 60,
            ...hotareaClass({ idCode: myData.idCode + 'backNav' }, true),
          }"
          v-if="myData.isShowBack"
          @click="
            hotEvent('backNav');
            $market.backNav();
          "
        >
          <img :style="imgStyle" src="static/images/header/back.png" />
        </div>
        <!-- 首页定位选择 -->
        <!-- <div class="location-div space-margin" v-if="myData.isShowArea" :class="hotareaClass({ idCode: myData.idCode + 'selectArea' })" @click="hotEvent('selectArea');$market.selectArea()">
          <span>{{this.$store.state.indexData.city}}</span>
          <img src="static/images/header/extend-w.png"/>
        </div>
        <div class="location-div space-margin" v-if="myData.isShowStation" :class="hotareaClass({ idCode: myData.idCode + 'selectStation' })" @click="hotEvent('selectStation');$market.selectStation()">
          <span>{{this.$store.state.indexData.station.stationName}}</span>
          <img src="static/images/header/extend-w.png"/>
        </div> -->
        <div
          class="search-div other-full space-margin"
          :class="{
            'search-div-bg': myData.isFloat == true && scrollSite < 60,
            ...hotareaClass({ idCode: myData.idCode + 'clickSearch' }, true),
          }"
          v-if="myData.middelControl == 'search'"
        >
          <div
            class="search-bg"
            @click="
              hotEvent('clickSearch');
              $market.clickSearch();
            "
          >
            <div style="height: 20px; line-height: 20px" class="search-main">
              商品名称
            </div>
            <div class="search-icon">
              <img
                style="display: block"
                width="16px"
                height="16px"
                :src="
                  myData.isFloat == true && scrollSite < 60
                    ? 'static/images/header/search-w.png'
                    : 'static/images/header/search.png'
                "
              />
            </div>
          </div>
        </div>
        <div class="other-full" v-if="myData.middelControl != 'search'"></div>

        <span
          class="home-shoppingCart"
          @click="navToCar"
          v-if="isCommon && $store.state.webtype !== '3'"
        >
          <i>{{ shoppingCartCount }}</i>
          <img src="static/images/card-provincial/shopping_cart.png" />
        </span>
        <van-icon
          name="photograph"
          size="30"
          class="home-shoppingCart"
          v-if="
            (isCommon && $store.state.webtype == '2') ||
            $store.state.webtype == '3'
          "
          @click="scanCode"
        />

        <!-- 退出登录 -->
        <!-- <div class="img-btn-pading space-margin" :class="{'img-btn-bg': myData.isFloat == true && scrollSite < 60, ...hotareaClass({idCode: myData.idCode + 'loginOut'}, true)}" v-if="myData.isShowLoginOut" @click="hotEvent('loginOut');confirmLoginOut()">
          <img :style="imgStyle" src="static/images/header/login-out-w.png"/>
        </div> -->
        <div
          class="img-btn-pading space-margin"
          :class="{
            'img-btn-bg': myData.isFloat == true && scrollSite < 60,
            ...hotareaClass({ idCode: myData.idCode + 'showMsg' }, true),
          }"
          v-if="myData.isShowMsg"
          @click="
            hotEvent('showMsg');
            $market.showMsg();
          "
        >
          <p class="msg-div" v-if="$store.state.indexData.msgNumber > 0">
            {{ $store.state.indexData.msgNumber }}
          </p>
          <img :style="imgStyle" src="static/images/header/message-w.png" />
        </div>
        <div
          class="img-btn-pading space-margin"
          :class="{
            'img-btn-bg': myData.isFloat == true && scrollSite < 60,
            ...hotareaClass({ idCode: myData.idCode + 'showScan' }, true),
          }"
          v-if="myData.isShowScan"
          @click="
            hotEvent('showScan');
            $market.showScan();
          "
        >
          <img :style="imgStyle" src="static/images/header/scan-w.png" />
        </div>
        <div
          class="img-btn-pading space-margin"
          :class="{
            'img-btn-bg': myData.isFloat == true && scrollSite < 60,
            ...hotareaClass({ idCode: myData.idCode + 'showShare' }, true),
          }"
          v-if="myData.isShowShare"
          @click="
            hotEvent('showShare');
            showShare();
          "
        >
          <img :style="imgStyle" src="static/images/header/share-w.png" />
        </div>
        <div
          class="img-btn-pading space-margin"
          :class="{
            'img-btn-bg': myData.isFloat == true && scrollSite < 60,
            ...hotareaClass({ idCode: myData.idCode + 'showQrcode' }, true),
          }"
          v-if="myData.isShowQrCode"
          @click="
            hotEvent('showQrcode');
            showQrcode();
          "
        >
          <img :style="imgStyle" src="static/images/header/qrcode-w.png" />
        </div>
        <div
          class="img-btn-pading space-margin"
          :class="{
            'img-btn-bg': myData.isFloat == true && scrollSite < 60,
            ...hotareaClass({ idCode: myData.idCode + 'showService' }, true),
          }"
          v-if="myData.isShowService"
          @click="
            hotEvent('showService');
            $market.toYHTService();
          "
        >
          <img :style="imgStyle" src="static/images/header/service-w.png" />
        </div>
        <!-- <div class="img-btn-pading space-margin" :class="{'img-btn-bg': myData.isFloat == true && scrollSite < 60, ...hotareaClass({idCode: myData.idCode + 'showMore'}, true)}" v-if="myData.isShowMore" @click="hotEvent('showMore');$market.toNavTopMore(myData)">
          <img :style="imgStyle" src="static/images/header/more-w.png"/>
        </div> -->
      </div>
      <div
        class="flex-div white"
        :style="{
          'min-height': this.$market.getNavHeight(true) + 'px',
          backgroundImage: `url(${myData.bgImgUrl2})`,
        }"
        v-if="myData.bgStyle == 'white'"
      >
        <div
          class="nav-top-title"
          v-if="myData.middelControl == 'title'"
          :style="{
            'line-height': this.$market.getNavHeight(true) + 'px',
            height: this.$market.getNavHeight(true) + 'px',
            color: myData.titleColor,
          }"
        >
          {{ myData.title }}
        </div>
        <div
          class="img-btn-pading space-margin"
          :class="{
            'img-btn-bg': myData.isFloat == true && scrollSite < 60,
            ...hotareaClass({ idCode: myData.idCode + 'backNav' }, true),
          }"
          v-if="myData.isShowBack"
          @click="
            hotEvent('backNav');
            $market.backNav();
          "
        >
          <img :style="imgStyle" src="static/images/header/back.png" />
        </div>
        <!-- 定位 -->
        <!-- <div class="location-div space-margin" v-if="myData.isShowArea" :class="hotareaClass( { idCode: myData.idCode + 'selectArea' } )" @click="hotEvent('selectArea');$market.selectArea()">
          <span :class="{'deeper-text': myData.isFloat != true || scrollSite > 60}">{{this.$store.state.indexData.city}}</span>
          <img :src="myData.isFloat == true && scrollSite < 60 ? 'static/images/header/extend-w.png' : 'static/images/header/extend.png'"/>
        </div>
        <div class="location-div space-margin" v-if="myData.isShowStation" :class="hotareaClass({idCode: myData.idCode + 'selectStation'}, true)" @click="hotEvent('selectStation');$market.selectStation()">
          <span>{{this.$store.state.indexData.station.stationName}}</span>
          <img :src="myData.isFloat == true && scrollSite < 60 ? 'static/images/header/extend-w.png' : 'static/images/header/extend.png'"/>
        </div> -->
        <div
          class="search-div other-full space-margin search-div-bg"
          v-if="myData.middelControl == 'search'"
        >
          <div
            class="search-bg"
            :class="
              hotareaClass({ idCode: myData.idCode + 'clickSearch' }, true)
            "
            @click="
              hotEvent('clickSearch');
              $market.clickSearch();
            "
          >
            <div style="height: 20px; line-height: 20px" class="search-main">
              商品名称
            </div>
            <div class="search-icon">
              <img
                style="display: block"
                width="16px"
                height="16px"
                src="static/images/header/search-w.png"
              />
            </div>
          </div>
        </div>
        <div class="other-full" v-if="myData.middelControl != 'search'"></div>
        <!-- 退出登录 -->
        <!-- <div class="img-btn-pading space-margin" :class="{'img-btn-bg': myData.isFloat == true && scrollSite < 60, ...hotareaClass({idCode: myData.idCode + 'loginOut'}, true)}" v-if="myData.isShowLoginOut" @click="hotEvent('loginOut');confirmLoginOut()">
          <img :style="imgStyle" :src="myData.isFloat == true && scrollSite < 60 ? 'static/images/header/login-out-w.png' : 'static/images/header/login-out.png'"/>
        </div> -->
        <div
          class="img-btn-pading space-margin"
          :class="{
            'img-btn-bg': myData.isFloat == true && scrollSite < 60,
            ...hotareaClass({ idCode: myData.idCode + 'showMsg' }, true),
          }"
          v-if="myData.isShowMsg"
          @click="
            hotEvent('showMsg');
            $market.showMsg();
          "
        >
          <p class="msg-div" v-if="$store.state.indexData.msgNumber > 0">
            {{ $store.state.indexData.msgNumber }}
          </p>
          <img
            :style="
              myData.isFloat == true && scrollSite < 60 ? imgStyle : imgStyle1
            "
            :src="
              myData.isFloat == true && scrollSite < 60
                ? 'static/images/header/message-w.png'
                : 'static/images/header/message.png'
            "
          />
        </div>
        <div
          class="img-btn-pading space-margin"
          :class="{
            'img-btn-bg': myData.isFloat == true && scrollSite < 60,
            ...hotareaClass({ idCode: myData.idCode + 'showScan' }, true),
          }"
          v-if="myData.isShowScan"
          @click="
            hotEvent('showScan');
            $market.showScan();
          "
        >
          <img
            :style="imgStyle"
            :src="
              myData.isFloat == true && scrollSite < 60
                ? 'static/images/header/scan-w.png'
                : 'static/images/header/scan.png'
            "
          />
        </div>
        <div
          class="img-btn-pading space-margin"
          :class="{
            'img-btn-bg': myData.isFloat == true && scrollSite < 60,
            ...hotareaClass({ idCode: myData.idCode + 'showShare' }, true),
          }"
          v-if="myData.isShowShare"
          @click="
            hotEvent('showShare');
            showShare();
          "
        >
          <img
            :style="imgStyle"
            :src="
              myData.isFloat == true && scrollSite < 60
                ? 'static/images/header/share-w.png'
                : 'static/images/header/share.png'
            "
          />
        </div>
        <div
          class="img-btn-pading space-margin"
          :class="{
            'img-btn-bg': myData.isFloat == true && scrollSite < 60,
            ...hotareaClass({ idCode: myData.idCode + 'showQrcode' }, true),
          }"
          v-if="myData.isShowQrCode"
          @click="
            hotEvent('showQrcode');
            showQrcode();
          "
        >
          <img
            :style="imgStyle"
            :src="
              myData.isFloat == true && scrollSite < 60
                ? 'static/images/header/qrcode-w.png'
                : 'static/images/header/qrcode.png'
            "
          />
        </div>
        <div
          class="img-btn-pading space-margin"
          :class="{
            'img-btn-bg': myData.isFloat == true && scrollSite < 60,
            ...hotareaClass({ idCode: myData.idCode + 'showService' }, true),
          }"
          v-if="myData.isShowService"
          @click="
            hotEvent('showService');
            $market.toYHTService();
          "
        >
          <img
            :style="imgStyle"
            :src="
              myData.isFloat == true && scrollSite < 60
                ? 'static/images/header/service-w.png'
                : 'static/images/header/service.png'
            "
          />
        </div>
        <!-- <div class="img-btn-pading space-margin" :class="{'img-btn-bg': myData.isFloat == true && scrollSite < 60, ...hotareaClass({idCode: myData.idCode + 'showMore'}, true)}" v-if="myData.isShowMore" @click="hotEvent('showMore');$market.toNavTopMore(myData)">
          <img :style="imgStyle" :src="myData.isFloat == true && scrollSite < 60 ? 'static/images/header/more-w.png' : 'static/images/header/more.png'"/>
        </div> -->
      </div>
      <!--<div class="flex-box" :style="{'min-height':this.$market.getNavHeight()+'px'}">-->
      <!--<div class="nav-top-title" v-if="myData.middelControl == 'title'" :style="{-->
      <!--'line-height':this.$market.getNavHeight()+'px',-->
      <!--'height':this.$market.getNavHeight()+'px',-->
      <!--'color': myData.titleColor}">{{myData.title}}-->
      <!--</div>-->
      <!--<div class="back-div" v-if="myData.isShowBack" @click="hotEvent('backNav');$market.backNav()">-->
      <!--<img src="static/images/header/back.png"/>-->
      <!--</div>-->
      <!--<div class="location-div" v-if="myData.isShowArea" :style="{-->
      <!--'line-height':this.$market.getNavHeight()+'px',-->
      <!--'height':this.$market.getNavHeight()+'px'}" @click="hotEvent('selectArea');$market.selectArea()">-->
      <!--<span>{{this.$store.state.indexData.province}}</span>-->
      <!--<img src="static/images/header/extend.png"/>-->
      <!--</div>-->
      <!--<div class="location-div" v-if="myData.isShowStation" :style="{-->
      <!--'line-height':this.$market.getNavHeight()+'px',-->
      <!--'height':this.$market.getNavHeight()+'px'}" @click="hotEvent('selectStation');$market.selectStation()">-->
      <!--<span>{{this.$store.state.indexData.station.stationName}}</span>-->
      <!--<img src="static/images/header/extend.png"/>-->
      <!--</div>-->
      <!--<div class="img-div" v-if="myData.isShowScan" :style="{'height':this.$market.getNavHeight()+'px'}"-->
      <!--@click="hotEvent('showScan');$market.showScan()">-->
      <!--<img src="static/images/header/scan.png"/>-->
      <!--</div>-->
      <!--<div class="img-div" v-if="myData.isShowMsg" :style="{'height':this.$market.getNavHeight()+'px'}"-->
      <!--@click="hotEvent('showMsg');$market.showMsg()">-->
      <!--<img src="static/images/header/message.png"/>-->
      <!--</div>-->
      <!--<div class="search-div" v-if="myData.middelControl == 'search'">-->
      <!--<div class="search-bg">-->
      <!--<div class="search-icon">-->
      <!--<img width="20px" height="20px" src="static/images/header/search.png"/>-->
      <!--</div>-->
      <!--<div class="search-main" @click="hotEvent('clickSearch');$market.clickSearch()">-->
      <!--<form @submit.prevent="showSearch" action=".">-->
      <!--<input v-model="currentValue" class="input-none" type="search" placeholder="请输入"-->
      <!--:disabled="$market.clickSearch? true:false"/>-->
      <!--</form>-->
      <!--</div>-->
      <!--</div>-->
      <!--</div>-->
      <!--</div>-->
    </div>
    <!--<top_nav_edit v-if="!usePorpData && pageData.header.editing"></top_nav_edit>-->
    <div class="add-wechat-favorites" v-if="isShowAddWechat">
      <van-icon name="cross" class="close-btn" @click="closeFavorites" />
      <span class="text">添加到我的小程序，下拉微信首页就能找到</span>
      <div class="add-wechat-btn" @click="addWechatFavorites">添加</div>
    </div>
    <van-popup v-model="isShowWechatFavDesc" class="wechat-favdesc-modal">
      <img :src="wechatDescPicUrl" alt="" class="desc-pic" />
    </van-popup>
  </div>
</template>

<script>
import hee from "../_js/hotarea-extend-event";
import { Dialog } from "vant";
import wx from "weixin-js-sdk";

export default {
  name: "top-nav",
  components: {
    // top_nav_edit: () => import('./top-nav-edit'),
  },
  props: ["usePorpData", "propData", "barHeight", "scrollSite"],
  computed: {
    pageData: function () {
      if (this.usePorpData == true) {
        return this.propData;
      }
      return this.$store.state.pageData;
    },
    myData: function () {
      return this.pageData.header.data;
    },
    isCommon: {
      get() {
        switch (this.$route.path) {
          case "/common":
            return true;

          default:
            return false;
        }
      },
      set() {},
    },
  },
  mixins: [hee],
  data() {
    return {
      shoppingCartCount: null,
      currentValue: "",
      imgStyle: {
        display: "block",
        width: "20px",
        height: "20px",
      },
      imgStyle1: {
        display: "block",
        width: "26px",
        height: "26px",
      },
      topDivStyle: "opacity: 1;",
      isShowAddWechat: false,
      isShowWechatFavDesc: false,
      wechatDescPicUrl: "",
    };
  },
  watch: {
    scrollSite: function (val, oldVal) {
      if (this.myData.isFloat == true) {
        if (val > 60) {
          this.topDivStyle = "opacity: " + 1 + ";";
        } else {
          let harf = val / 60;
          this.topDivStyle = "opacity: " + harf + ";";
        }
        // let h = this.barHeight + 44;
      } else {
        this.topDivStyle = "opacity: " + 1 + ";";
      }
    },
  },
  created() {
    this._getCartCount();
  },
  activated() {
    this._getCartCount();
  },
  methods: {
    //微信扫一扫
    scanCode() {
      // bridgefunc.scanCode();
      wx.scanQRCode({
        needResult: 0, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
        scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
        success: function (res) {
          var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
          console.log("seac ===== > ", res);
        },
      });
    },
    _getCartCount: function () {
      let url = "/app/json/app_cart/getCartCount";
      let paramsData = {
        token: this.$store.state.login.token,
        deliveryType: "2",
        orderCategory: "0",
        vipUnitUserCode: "",
      };
      this.$http.post(url, paramsData).then(
        (res) => {
          this.shoppingCartCount = res.data.data;
        },
        (error) => {
          this.$Loading.close();
          this.$Toast("请求数据失败！");
        }
      );
    },
    navToCar() {
      this.$router.push({
        path: "/mall2/cart",
        query: {
          orderCategory: "",
          vipUnitUserCode: "",
        },
      });
    },
    /**
     * @description 热力统计事件
     */
    hotEvent(eKey = "") {
      this.actionBtnEvent(this.pageData.pgCode, this.myData.idCode + eKey);
    },
    // 关闭顶部通知
    closeFavorites() {
      this.isShowAddWechat = false;
    },
    // 添加到我的小程序 按钮点击
    addWechatFavorites() {
      this.isShowWechatFavDesc = true;
    },
    showShare: function () {
      //title标题 sharetext副标题 imageurl图标url   detailurl链接url
      this.$market.showShare({
        title: this.myData.shareTitle ? this.myData.shareTitle : "",
        sharetext: this.myData.shareContent ? this.myData.shareContent : "",
        imageurl: this.myData.shareImgUrl ? this.myData.shareImgUrl : "",
        detailurl: window.location.href,
      });
    },
    showQrcode: function () {
      let path;
      if (this.myData.memberCodeType == 2) {
        // 员工邀请预注册
        path = "/usercenter/myqrcode?isPreRegiste=true";
      } else if (this.myData.memberCodeType == 3) {
        // 员工邀请注册
        path = "/usercenter/myqrcode?isToRegiste=true";
      } else if (this.myData.memberCodeType == 4) {
        // 海信会员码
        path = "/usercenter/hx-qrcode";
      } else {
        // 会员码
        path = "/usercenter/myqrcode";
      }
      this.$market.customPush({ path });
    },
    getStyleHeaderBg: function (data) {
      let styleStr = "";
      // let img = data.bgImgUrl
      // if (img != '') {
      //   styleStr += "background: url('" + img + "') no-repeat center center / 100% 100%;"
      // }
      // let color = data.bgColor
      // if (color != '') {
      //   styleStr += "background-color: " + color +";"
      // }
      if (this.barHeight) {
        styleStr += "paddingTop: " + this.barHeight + "px;";
      }
      return styleStr;
    },
    getMessageNumber: function () {
      if (!this.$store.state.login.token) {
        return;
      }
      let url = this.$market.apiBaseURL() + "/app/json/message/getUnreadMsgCnt";
      let paramsData = {
        token: this.$store.state.login.token,
      };
      this.$http.post(url, paramsData).then(
        (res) => {
          let data = res.data;
          if (data.status == 0) {
            this.$store.state.indexData.msgNumber = data.data;
            this.$bridgefunc.vuexStorage();
          }
        },
        (error) => {}
      );
    },
    getBgDivStyle: function (data) {
      let styleStr = this.topDivStyle;
      let img = data.bgImgUrl;
      if (img != "") {
        styleStr +=
          "background: url('" + img + "') no-repeat center center / 100% 100%;";
      }
      let color = data.bgColor;
      if (color != "") {
        styleStr += "background-color: " + color + ";";
      }
      if (this.barHeight) {
        let h = this.barHeight + 44;
        styleStr += "height: " + h + "px;";
      }
      return styleStr;
    },
    confirmLoginOut() {
      Dialog.confirm({
        title: "提示",
        message: "您确定要退出登录吗？",
      })
        .then(() => {
          this.$market.loginOut();
        })
        .catch(() => {
          // on cancel
        });
    },
  },
  mounted() {
    // console.log('bridgefunc-------------------------------------',bridgefunc)
    // bridgefunc.scanCode();

    // 小程序环境 webtype = 3 未将小程序添加到”我的小程序“ isAddToFavorites != 1 配置了添加”我的小程序“说明图片 hasFavoritesDescriptionPic = 图片地址
    if (
      this.$store.state.webtype == 3 &&
      this.$store.state.isAddToFavorites != 1 &&
      this.$store.state.globalConfig.hasFavoritesDescriptionPic
    ) {
      this.wechatDescPicUrl =
        this.$store.state.globalConfig.hasFavoritesDescriptionPic || "";
      this.isShowAddWechat = true;
    }

    if (!this.myData.bgStyle) {
      this.myData.bgStyle = "common";
    }
    if (this.$store.state.webtype == -1 && !this.myData.idCode) {
      this.myData.idCode = this.$util.randomString();
    }
    if (this.myData.isFloat == true) {
      this.topDivStyle = "opacity: 0;";
    }
    if (this.myData.isShowMsg) {
      this.getMessageNumber();
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';
@import '~@/common/stylus/mixin.styl';

.home-shoppingCart {
  display: inline-block;
  width: 24px;
  height: 24px;
  margin: 0 15px 0;
  position: relative;

  i {
    width: 16px;
    height: 16px;
    position: absolute;
    border: 1px solid #fff;
    text-align: center;
    line-height: 16px;
    color: #fff;
    right: -9px;
    border-radius: 50%;
    top: -7px;
    background: #FF4A4A;
    font-size: 13px;
  }

  img {
    width: 100%;
    height: 100%;
  }
}

.top-nav {
  width: 100%;

  .default-div {
    position: relative;
    width: 100%;
    overflow: hidden;

    .user-msg {
      position: absolute;
      left: 10px;
      margin-top: -4px;
      font-size: 10px;
      color: white;
      z-index: 10;

      &.deeper-text {
        color: #333;
      }
    }

    .bg-div {
      position: absolute;
      z-index: 0;
      top: 0px;
      left: 0px;
      right: 0px;
      bottom: 0;
    }

    .flex-div {
      position: relative;
      width: 100%;
      display: flex;
      align-items: center;
      background-size: 100% 100%;

      .nav-top-title {
        position: absolute;
        left: 80px;
        right: 80px;
        top: 0px;
        bottom: 0px;
        color: white;
        font-weight: 600;
        font-size: 18px;
        text-align: center;
      }

      .other-full {
        flex: 1;
      }

      .space-margin {
        margin-left: 8px;
      }

      .space-margin:nth-last-child(1) {
        margin-right: 8px;
      }

      .img-btn-pading {
        position: relative;
        padding: 6px;

        img {
          display: block;
        }

        .msg-div {
          position: absolute;
          right: 0px;
          top: 0px;
          min-width: 18px;
          font-size: 10px;
          padding: 2px 3px;
          border-radius: 10px;
          background-color: red;
          text-align: center;
          color: white;
        }
      }

      .img-btn-bg {
        background-color: rgba(0, 0, 0, 0.3);
        border-radius: 25px;
      }

      .location-div {
        position: relative;
        z-index: 9;
        padding: 10px 0px;
        color: white;
        font-size: 14px;
        display: flex;
        align-items: center;

        img {
          margin-left: 2px;
          width: 14px;
        }

        .deeper-text {
          color: #333;
        }
      }

      .search-div {
        overflow: hidden;

        // padding 7px 0px;
        .search-bg {
          display: flex;
          align-items: center;
          align-items: center;
          background-color: #fff;
          border-radius: 25px;
          overflow: hidden;
          padding: 6px 15px;

          .search-main {
            flex: 1;
            padding-right: 10px;
            color: #333;
            font-size: 14px;
          }
        }
      }

      .search-div-bg {
        .search-bg {
          background-color: rgba(0, 0, 0, 0.3);

          .search-main {
            color: white;
          }
        }
      }
    }

    /* .flex-box {
            position relative;
            width 100%;
            font-size 0px;
            overflow hidden
            .nav-top-title {
              position absolute;
              left 80px;
              right 80px;
              top 0px;
              bottom 0px;
              color white;
              font-weight 600
              font-size 18px;
              text-align center;
            }
            .back-div {
              float left;
              img {
                margin 14px;
                width 16px;
                height 16px;
              }
            }
            .location-div {
              float left;
              padding 0px 8px;
              color white
              font-size 14px;
              img {
                display inline-block;
                vertical-align middle;
                width 14px;
              }
            }
            .img-div {
              float right;
              padding 0px 8px
              img {
                width 24px;
                height 24px;
                position: relative;
                top: 50%;
                margin-top: -12px; !* 高度的一半 *!
              }
            }
            .search-div {
              overflow hidden;
              padding 7px 10px;
              .search-bg {
                !*position relative;
                background-color white;
                height 28px;
                border-radius 14px;*!
    
                display: flex;
                flex: 1;
                align-items: center;
                background-color: #fff;
                border-radius: 50px;
                overflow: hidden;
                padding: 0 3vw;
                .search-icon {
                  display: flex;
                  align-items: center;
                }
                .search-main {
                  flex: 1;
                  padding-left: 2vw;
                  input {
                    display: flex;
                    width: 100%;
                    height: 30px;
                    font-size: 14px;
                  }
                }
                !*.input-none {
                  width 100%;
                  height: $font-size-medium;
                  padding: 14px 35px 14px 10px;
                  border: 0px;
                  background: none;
                  outline: none;
                  font-size: $font-size-medium;
                  color: $color-text;
                  overflow: hidden;
                }*!
                input:disabled {
                  background: none;
                }
                .search-img {
                  position absolute;
                  left 0px;
                  top -5px;
                  padding 7px 7px;
                  img {
                    width 24px;
                    height 24px;
                  }
                }
              }
            }
          } */
  }

  .default-div-bg {
    background-color: #F96702;
  }

  .add-wechat-favorites {
    opacity: 0.9;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    height: 40px;
    padding: 0 20px;
    background-color: #eff6ff;
    border-top: 0.5px solid #eaf1fd;
    border-bottom: 0.5px solid #eaf1fd;
    display: flex;
    align-items: center;

    .close-btn {
      font-size: 15px;
      color: #7c92b3;

      &:after {
        content: '';
        position: absolute;
        top: -10px;
        left: -10px;
        right: -10px;
        bottom: -10px;
      }
    }

    .text {
      flex: 1;
      font-size: 13px;
      line-height: 15px;
      color: #7c92b3;
      padding: 0 15px;
      ellipse();
    }

    .add-wechat-btn {
      line-height: 1;
      padding: 5px 11px;
      background-color: #5a97f9;
      color: #fff;
      font-size: 11px;
      border-radius: 11px;
      animation: addWechatAni 0.7s linear infinite alternate;
    }
  }

  @keyframes addWechatAni {
    from {
      transform: scale(1);
    }

    to {
      transform: scale(1.1);
    }
  }

  .wechat-favdesc-modal {
    width: 80%;
    background-color: transparent;

    .desc-pic {
      display: block;
      width: 100%;
    }
  }
}

.pfixed {
  // position absolute;
  // top 0px
  // z-index 99;
}
</style>
