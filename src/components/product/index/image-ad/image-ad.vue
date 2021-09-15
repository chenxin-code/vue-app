<template>
  <div
    class="image-ad"
    :style="getFloatUp()"
    ref="box"
    v-if="pageRefresh && $market.moduleIsShow(moduleData)"
  >
    <div class="f-div" v-if="!usePorpData"></div>
    <!-- 轮播广告 -->
    <div
      v-if="moduleData.type == 'lbt'"
      class="swiper-box lbt"
      :style="getSidesStyle()"
    >
      <swiper :options="lbtOption" ref="mySwiper">
        <swiper-slide
          v-for="(nav, index) in moduleData.rows"
          :key="index"
          :class="hotareaClass(nav)"
        >
          <img
            ref="swiperImg"
            class="swiper-img"
            :src="nav.imgUrl"
            :style="swiperSlideStyle"
          />
          <CornerMark
            v-if="nav.cornerMark"
            :itemData="nav"
            :moduleData="moduleData"
          ></CornerMark>
        </swiper-slide>
        <div
          v-show="moduleData.rows.length != '1'"
          class="swiper-pagination"
          slot="pagination"
        ></div>
      </swiper>
      <div
        class="notice-div"
        v-if="moduleData.notice && moduleData.notice != ''"
      >
        <img
          class="notice-img"
          src="static/images/image-ad/notice.png"
          alt=""
        />
        <p class="notice-title">通知公告:{{ moduleData.notice }}</p>
      </div>
    </div>
    <!-- 功能导航 -->
    <div
      v-else-if="moduleData.type == 'gndh'"
      class="gndh swiper-box"
      :style="getSidesStyle(true)"
    >
      <swiper :options="gndhOption" ref="mySwiper" :style="getBottomStyle()">
        <swiper-slide v-for="pageIdx in getPageLength" :key="pageIdx - 1">
          <div class="gndh-page">
            <div
              class="gndh-item fill-bgp"
              :class="{
                'width-5': moduleData.columnNum == '5',
                'width-3': moduleData.columnNum == '3',
                'width-2': moduleData.columnNum == '2',
                ...hotareaClass(nav, true),
              }"
              @touchstart="gndhTouchStart"
              @touchend="gndhTouchEnd"
              v-for="(nav, index) in getPageItems(pageIdx - 1)"
              :key="index"
            >
              <div
                v-if="moduleData.style == 'imgStyle'"
                @click.prevent="
                  hotEvent(nav.idCode);
                  enterNav(nav,index);
                "
              >
                <CornerMark
                  v-if="nav.cornerMark"
                  :itemData="nav"
                  :moduleData="moduleData"
                ></CornerMark>
                <img
                  ref="swiperImg"
                  class="swiper-img"
                  :src="nav.imgUrl"
                  :style="swiperSlideStyle"
                />
              </div>
              <div
                v-if="moduleData.style == 'imgTextStyle'"
                @click.prevent="
                  hotEvent(nav.idCode);
                  enterNav(nav,index);
                "
              >
                <CornerMark
                  v-if="nav.cornerMark"
                  :itemData="nav"
                  :moduleData="moduleData"
                ></CornerMark>
                <img
                  ref="swiperImg"
                  class="swiper-img"
                  :src="nav.imgUrl"
                  :style="swiperSlideStyle"
                />
                <p
                  class="title"
                  :style="{ 'background-color': moduleData.bgColor }"
                >
                  {{ nav.title }}
                </p>
              </div>
              <div
                v-if="moduleData.style == 'minImgTextStyle'"
                @click.prevent="
                  hotEvent(nav.idCode);
                  enterNav(nav,index);
                "
              >
                <div class="min-img-text-box">
                  <CornerMark
                    v-if="nav.cornerMark"
                    :itemData="nav"
                    :moduleData="moduleData"
                  ></CornerMark>
                  <img
                    :style="swiperSlideStyle"
                    ref="swiperImg"
                    class="swiper-img"
                    :src="nav.imgUrl"
                  />
                </div>
                <p
                  class="title"
                  :style="{ 'background-color': moduleData.bgColor }"
                >
                  {{ nav.title }}
                </p>
              </div>
            </div>
          </div>
        </swiper-slide>
        <div
          v-show="
            gndhPageArr.length > moduleData.columnNum * moduleData.rowsNum
          "
          class="swiper-pagination"
          slot="pagination"
        ></div>
      </swiper>
    </div>
    <!-- 一行一个 -->
    <div
      v-else-if="moduleData.type == 'yhyg'"
      class="swiper-box"
      :style="getSidesStyle()"
    >
      <div ref="mySwiper">
        <div
          v-for="(nav, index) in moduleData.rows"
          :key="index"
          :class="hotareaClass(nav)"
        >
          <img
            ref="swiperImg"
            class="swiper-img"
            :src="nav.imgUrl"
            :style="swiperSlideStyle"
            @click="
              hotEvent(nav.idCode);
              enterNav(nav,index);
            "
          />
          <div
            v-if="index + 1 !== moduleData.rows.length"
            :style="{ 'margin-bottom': moduleData.space + 'px' }"
          ></div>
        </div>
      </div>
    </div>
    <!-- 列表导航 -->
    <div
      v-else-if="moduleData.type == 'lbdh'"
      class="swiper-box"
      :style="getSidesStyle()"
    >
      <swiper :options="lbdhOption" ref="mySwiper">
        <swiper-slide v-for="(nav, index) in moduleData.rows" :key="index">
          <div class="cells">
            <div
              :class="hotareaClass(nav)"
              class="cell lbdh-row fill-bgp"
              @click="
                hotEvent(nav.idCode);
                enterNav(nav,index);
              "
            >
              <div class="cell__hd padding-left relative">
                <CornerMark
                  v-if="nav.cornerMark"
                  :itemData="nav"
                  :moduleData="moduleData"
                ></CornerMark>
                <img
                  class=""
                  ref="swiperImg"
                  width="35px"
                  height="35px"
                  :src="nav.imgUrl"
                />
              </div>
              <div class="cell__bd padding-left">{{ nav.title }}</div>
              <div class="cell__ft padding-right">
                <img
                  width="15px"
                  height="15px"
                  src="static/images/icon-more.png"
                  alt=""
                />
              </div>
            </div>
          </div>
        </swiper-slide>
      </swiper>
    </div>
    <!--<ImageAdEdit @resetSwiper="resetSwiper" v-if="!usePorpData && pageData.moduleList[myIndex].editing"></ImageAdEdit>-->
  </div>
</template>
<script>
// import ImageAdEdit from './image-ad-edit';
import CornerMark from "../cornermark/cornerMark";
import { mapGetters } from "vuex";
import Bus from "../bus";
import hee from "../_js/hotarea-extend-event";

export default {
  name: "image-ad",
  components: {
    // ImageAdEdit,
    CornerMark,
  },
  props: ["myIndex", "usePorpData", "propData"],
  computed: {
    ...mapGetters(["clientWidth"]),
    pageData: function () {
      if (this.usePorpData == true) {
        return this.propData;
      }
      return this.$store.state.pageData;
    },
    moduleData: function () {
      return this.pageData.moduleList[this.myIndex].data;
    },
    //获取swiper页数
    getPageLength() {
      return (
        parseInt(
          (this.gndhPageArr.length - 1) /
            (this.moduleData.columnNum * this.moduleData.rowsNum)
        ) + 1
      );
    },
  },
  mixins: [hee],
  data() {
    let that = this;
    return {
      lbtOption: {
        allowSlideNext: true,
        allowSlidePrev: true,
        pagination: {
          el: ".lbt .swiper-pagination",
          clickable: true,
        },
        // 循环滑动
        loop: true,
        // 自动切换
        autoplay: {
          delay: 4000, //1秒切换一次
          clickable: true,
          disableOnInteraction: false,
        },
        on: {
          click: function () {
            let nav = that.moduleData.rows[this.realIndex];
            that.hotEvent(nav.idCode);
            that.enterNav(nav,this.realIndex);
          },
          doubleTap: function () {
            let nav = that.moduleData.rows[this.realIndex];
            that.hotEvent(nav.idCode);
            that.enterNav(nav,this.realIndex);
          },
        },
      },
      gndhPageNum: 1,
      gndhPageArr: [],

      gndhOption: {
        allowSlideNext: true,
        allowSlidePrev: true,
        threshold: 30,
        longSwipesRatio: 0.2,
        // slidesPerView: 4,
        // slidesPerColumn: 1,
        pagination: {
          el: ".gndh .swiper-pagination",
          clickable: true,
        },
        // slidesPerColumnFill: 'row',
        // observer: true,
      },

      yhygOption: {
        slidesPerView: 1,
        slidesPerColumn: "",
        allowSlideNext: false,
        allowSlidePrev: false,
      },
      lbdhOption: {
        slidesPerView: 1,
        slidesPerColumn: "",
      },
      layout: "lbt",
      swiperSlideStyle: "",
      pageRefresh: true,

      canEnterNav: true,
      touchStartTime: undefined,
    };
  },
  watch: {
    // moduleData: {//深度监听，可监听到对象、数组的变化
    //   handler(val, oldVal){
    //     console.log(val);//但是这两个值打印出来却都是一样的
    //   },
    //   deep:true
    // }
  },
  created() {
    if (this.usePorpData == true) {
      if (
        this.moduleData.type == "lbt" ||
        this.moduleData.type == "gndh" ||
        this.moduleData.type == "lbdh"
      ) {
        let rows = this.moduleData.rows;
        let arr = [];

        let nowTime = new Date().getTime();

        for (let i = 0; i < rows.length; i++) {
          let item = rows[i];

          let seeTime = item.seeTime;
          // 时间段 筛选
          if (seeTime && seeTime != undefined && seeTime.length == 2) {
            let st1 = seeTime[0];
            st1 = st1.replace(/-/g, "/");
            st1 = new Date(st1).getTime();
            let st2 = seeTime[1];
            st2 = st2.replace(/-/g, "/");
            st2 = new Date(st2).getTime();
            if (nowTime < st1 || nowTime > st2) {
              continue;
            }
          }

          if (item.cannotSee) {
            let arr1 = item.canSeenArr;
            let canSee = false;
            if (arr1 && arr1 != "" && arr1 != undefined) {
              for (let j = 0; j < arr1.length; j++) {
                let qxStr = arr1[j];
                if (qxStr == "empFlag") {
                  if (this.$store.state.mall2.myAssets.empFlag == "1") {
                    arr.push(item);
                    canSee = true;
                    break;
                  }
                } else {
                  if (this.$store.state.mall2.myAssets.levelNo == qxStr) {
                    arr.push(item);
                    canSee = true;
                    break;
                  }
                }
              }
            }
            if (canSee) {
              continue;
            }
            let arr2 = item.canSeenGroups;
            if (arr2 && arr2 != "" && arr2 != undefined) {
              let clusterIds = this.$store.state.mall2.myAssets.clusterIds;
              if (clusterIds && clusterIds != undefined && clusterIds != "") {
                for (let j = 0; j < arr2.length; j++) {
                  let qxStr = arr2[j];
                  for (let k = 0; k < clusterIds.length; k++) {
                    if (qxStr == clusterIds[k]) {
                      arr.push(item);
                      canSee = true;
                      break;
                    }
                  }
                  if (canSee) {
                    break;
                  }
                }
              }
            }
          } else {
            arr.push(item);
          }
        }
        this.moduleData.rows = arr;
      }
    }
  },
  mounted() {
    let sidesMargin = this.moduleData.sidesMargin;
    if (!sidesMargin || sidesMargin == undefined || sidesMargin == "") {
      sidesMargin = 0;
    }
    this.swiperSlideStyle =
      "height: " +
      ((this.clientWidth * (100 - sidesMargin - sidesMargin)) / 100) *
        this.moduleData.ratio +
      "px";
    // console.log(this.swiperSlideStyle)
    this.$nextTick(() => {
      this.resetSwiper();
    });
    Bus.$on("refreshShowComponent", () => {
      if (this.pageData.editingIndex == this.myIndex) {
        this.resetSwiper();
      }
    });
  },
  methods: {
    /**
     * @description 热力统计事件
     */
    hotEvent(idCode) {
      this.actionBtnEvent(this.pageData.pgCode, idCode);
    },
    //
    modeleReshow: function () {
      this.$bridgefunc.getItem(
        this.pageData.moduleList[this.myIndex].moduleId + "gndhPageArr",
        (result) => {
          let codeArr = undefined;
          if (result && result.length) {
            codeArr = JSON.parse(decodeURIComponent(result));
          }
          this.resetGndhPageArr(codeArr);
        }
      );
    },
    //获取每页的数组
    getPageItems: function (pageIdx) {
      // if (pageIdx == 0) {
      //   console.log(this.gndhPageArr.slice(this.moduleData.columnNum * this.moduleData.rowsNum * pageIdx, this.moduleData.columnNum * this.moduleData.rowsNum * (pageIdx + 1)))
      // }

      return this.gndhPageArr.slice(
        this.moduleData.columnNum * this.moduleData.rowsNum * pageIdx,
        this.moduleData.columnNum * this.moduleData.rowsNum * (pageIdx + 1)
      );
    },

    gndhTouchStart: function (ev) {
      if (ev.touches.length == 1) {
        //tounches类数组，等于1时表示此时有只有一只手指在触摸屏幕
        this.touchStartTime = this.$util.getDataString();
      }
    },
    gndhTouchEnd: function (ev) {
      //如果大于1.5秒 表示是长按
      // if (this.pageData.moduleList[this.myIndex].moduleId) {
      //   if (this.$util.getDataString() - this.touchStartTime > 1500) {
      //     this.canEnterNav = false;
      //     this.$messagebox.confirm('是否想编辑首页应用？', '', {confirmButtonText: '去编辑'}).then(action => {
      //       let tmpModuleData = JSON.parse(JSON.stringify(this.moduleData));
      //       tmpModuleData.rows = this.gndhPageArr;
      //       this.$market.toAdImgMove(tmpModuleData,this.pageData.moduleList[this.myIndex].moduleId);
      //     }).catch(action => {
      //     });
      //   }
      // }

      this.touchStartTime = undefined;
    },

    getFloatUp: function () {
      let styleStr = "";
      let img = this.moduleData.bgImgUrl;
      if (img != "") {
        styleStr +=
          "background: url('" + img + "') no-repeat center center / 100% 100%;";
      }
      let color = this.moduleData.bgColor;
      if (color != "") {
        styleStr += "background-color: " + color + ";";
      }
      let floatUp = this.moduleData.floatUp;
      if (floatUp > 0) {
        styleStr += "margin-top: -" + floatUp + "%;";
      }
      return styleStr;
    },
    getBottomStyle: function () {
      let styleStr = "";
      let downMargin = this.moduleData.downMargin;
      if (downMargin > 0) {
        styleStr += "padding-bottom: " + downMargin + "%;";
      }

      return styleStr;
    },
    getSidesStyle: function (noBottom = false) {
      let styleStr = "";
      let sidesMargin = this.moduleData.sidesMargin;
      if (sidesMargin > 0) {
        styleStr +=
          "margin-left: " +
          sidesMargin +
          "%; margin-right: " +
          sidesMargin +
          "%;";
      }
      let upMargin = this.moduleData.upMargin;
      let downMargin = this.moduleData.downMargin;
      if (upMargin > 0) {
        styleStr += "padding-top: " + upMargin + "%;";
      }
      if (downMargin > 0 && !noBottom) {
        styleStr += "padding-bottom: " + downMargin + "%;";
      }

      return styleStr;
    },
    // this.$store.state.ythToken
    getCookie(name){
        var strcookie = document.cookie;//获取cookie字符串
        var arrcookie = strcookie.split("; ");//分割
        //遍历匹配
        for ( var i = 0; i < arrcookie.length; i++) {
            var arr = arrcookie[i].split("=");
            if (arr[0] == name){
                return arr[1];
            }
        }
        return "";
    },
    enterNav: function (nav,index) {
      console.log('nav',nav)
      console.log('nnnnnnnnnnnnnnnnnnn', nav.link.url)
      if(nav.link.url == '/mall2/list/1003'){
        this.$store.state.showCategory = false;
      }
      let newNav = JSON.parse(JSON.stringify(nav));
    
      if(/token=/.test(newNav.link.url)){
        let ythToken = "";

        (this.$store.state.webtype == 2 || this.$store.state.webtype == 3) ? ythToken = localStorage.getItem('ythToken') : ythToken = this.$store.state.ythToken;

        newNav.link.url = newNav.link.url.replace(/token=/,`token=${ythToken}`)

      }

      if(/phone=/.test(newNav.link.url)){
        let phone = "";
        let isEmpty = Object.keys(this.$store.state.ythUserInfo);
        isEmpty.length == 0 ? phone = this.getCookie('userPhone') : phone = this.$store.state.ythUserInfo.phone;
        newNav.link.url = newNav.link.url.replace(/phone=/,`phone=${phone}`)
      }

      if(/scToken=/.test(newNav.link.url)){
        newNav.link.url = newNav.link.url.replace(/scToken=/,`scToken=${this.$store.state.login.token}`)
      }

      // 分销工程单独跳转webview， 解决微信小程序双标题问题
      if(this.wxenvironment() && (this.isDistribution(newNav.link.url) || this.isServeMall(newNav.link.url))) {
        wx.miniProgram.navigateTo({
          url: `/pages/distributionWebView/index?url=${encodeURIComponent(JSON.stringify(newNav.link.url))}`,
        });
        return ;
      }

      if(nav.link.type == '1'){
        this.$sensors.track("mall_banner_click", {
          which_page:this.$route.name,
          page_path:this.$route.path,
          banner_name: nav.link.name,
          banner_id: nav.link.pgCode,
          url: nav.link.type == '1' ? `/common2?pgCode=${nav.link.pgCode}` : '',
          banner_rank: index+1,
        })
      }else if(nav.link.type == '2' || nav.link.type == '3'){
        this.$sensors.track("mall_ad_click", {
          which_page:this.$route.name,
          page_path:this.$route.path,
          ad_name: nav.link.name,
          ad_id: nav.idCode,
          url: nav.link.url,
          ad_rank: index+1,
        })
      }

      if (this.canEnterNav) {
        this.$market.enterNav(newNav, this.pageData.pgCode);
      } else {
        this.canEnterNav = true;
      }

    },

    wxenvironment() {
      let ua = window.navigator.userAgent.toLowerCase();
      return ua.match(/MicroMessenger/i) == "micromessenger";
    },
    isDistribution(url) {
      if(this.$store.state.environment == "development") {
        return /https:\/\/mall-uat-app-linli.timesgroup.cn:8001/.test(url);
      }else {
        return /https:\/\/mall-prod-app-linli.timesgroup.cn:8081/.test(url);
      }
    },
    isServeMall(url) {
      if(this.$store.state.environment == "development") {
        return /https:\/\/mall-uat-app-linli.timesgroup.cn:1443/.test(url);
      }else {
        return /https:\/\/mall-prod-app-linli.timesgroup.cn:9001/.test(url);
      }
    },
    resetGndhPageArr: function (codeArr) {
      let arr = JSON.parse(JSON.stringify(this.moduleData.rows));
      if (codeArr) {
        let tempPageArr = [];
        for (let i = 0; i < codeArr.length; i++) {
          let code = codeArr[i];
          let codeItemIndex = -1;
          for (let j = 0; j < arr.length; j++) {
            let item = arr[j];
            if (item.idCode == code) {
              codeItemIndex = j;
              break;
            }
          }
          if (codeItemIndex != -1) {
            tempPageArr.push(arr[codeItemIndex]);
          }
          arr.splice(codeItemIndex, 1);
        }
        this.gndhPageArr = tempPageArr.concat(arr);
      } else {
        this.gndhPageArr = arr;
      }
    },
    resetSwiper: function (val) {
      // if (val && val.index == 0) {
      // 	var imgData = ImgCenter.setImgsStyle(val.el);
      // 	var relativeSize = imgData.relativeSize;
      // } else {
      // 	var imgData = ImgCenter.setImgsStyle(this.$refs.swiperImg);
      // 	var relativeSize = imgData.relativeSize;
      // }

      let relativeSize = this.moduleData.ratio;
      let layoutState = this.moduleData.type;
      const data = this.moduleData;

      if (layoutState == "lbt") {
        if (this.moduleData.rows.length == 1) {
          this.lbtOption.allowSlideNext = false;
          this.lbtOption.allowSlidePrev = false;
        } else {
          this.lbtOption.allowSlideNext = true;
          this.lbtOption.allowSlidePrev = true;
          this.lbtOption.autoplay.delay = this.moduleData.interval * 1000;
          // if (typeof val === 'number') {
          // 	this.lbtOption.autoplay.delay = val;
          // }
        }
        let sidesMargin = this.moduleData.sidesMargin;
        if (!sidesMargin || sidesMargin == undefined || sidesMargin == "") {
          sidesMargin = 0;
        }
        this.swiperSlideStyle =
          "height: " +
          ((this.clientWidth * (100 - sidesMargin - sidesMargin)) / 100) *
            relativeSize +
          "px";
      }
      if (layoutState == "gndh") {
        if (this.$store.state.webtype == "-1") {
          this.resetGndhPageArr(undefined);
        } else {
          this.modeleReshow();
        }

        let sidesMargin = this.moduleData.sidesMargin;
        if (!sidesMargin || sidesMargin == undefined || sidesMargin == "") {
          sidesMargin = 0;
        }
        this.swiperSlideStyle =
          "height: " +
          ((this.clientWidth * (100 - sidesMargin - sidesMargin)) /
            100 /
            data.columnNum) *
            relativeSize +
          "px";
        // this.gndhOption.slidesPerView = data.columnNum;
        // this.gndhOption.slidesPerColumn = data.rowsNum;
      }
      if (layoutState == "yhyg") {
        this.swiperSlideStyle = "height: " + "auto";
        this.yhygOption.slidesPerColumn = data.rows.length;
      }
      if (layoutState == "lbdh") {
        this.lbdhOption.slidesPerColumn = data.rows.length;
      }
      this.pageRefresh = false;
      this.$nextTick(() => {
        this.pageRefresh = true;
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';
@import '~@/common/stylus/mixin.styl';

.fill-bgp {
  background: no-repeat center center;
  background-size: 100% 100%;
}

.image-ad {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 10;

  .swiper-box {
    position: relative;
    overflow: hidden;
  }

  .f-div {
    position: absolute;
    left: 0px;
    right: 0px;
    top: 0px;
    bottom: 0px;
    z-index: 99;
  }
}

.image-ad-layout {
  position: relative;
  overflow: hidden;
  background: no-repeat center center;
  background-size: 100% 100%;
}

.row {
  overflow: hidden;
}

.swiper-container {
  height: auto !important;
  margin-left: auto;
  margin-right: auto;
}

.swiper-img {
  display: block;
  width: 100%;
}

.active {
  border: 1px solid gray;
}

.gndh-item {
  position: relative;

  // background-color: #fff;
  .title {
    text-align: center;
  }
}

.lbdh-row {
  background-color: #fff;
  padding: 5px 0;
  border-bottom: 1px solid #ddd;
}

.yhyg-border {
  border-color: #ddd;
}

.padding-right {
  padding-right: 15px;
}

.min-img-text-box {
  /* background-color: #ddd; */
  img {
    transform: scale(0.7, 0.7);
  }
}

.relative {
  position: relative;
}

.notice-div {
  position: absolute;
  bottom: 0px;
  height: 30px;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  padding-left: 10px;
  z-index: 99;

  .notice-img {
    width: 16px;
    height: 13px;
  }

  .notice-title {
    color: white;
    margin-left: 6px;
    font-size: $font-size-small;
  }
}

.gndh-page {
  display: flex;
  flex-wrap: wrap;

  .gndh-item {
    width: 25%;

    &.width-5 {
      width: 20%;
    }

    &.width-3 {
      width: 33.3%;
    }

    &.width-2 {
      width: 50%;
    }

    // background-color: #fff;
    .title {
      text-align: center;
    }
  }
}
</style>
