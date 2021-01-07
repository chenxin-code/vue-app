<template>
  <div>
    <nav-top title="我的电子券" @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="minelist">
      <div class="top-tags">
        <div class="top-content">
          <div class="item" v-for="(item, index) of topTags">
            <div
              :class="
                currentTopTagIndex == index
                  ? 'item-back item-back-big'
                  : 'item-back'
              "
              @click="topTagSlect(item, index)"
            >
              <img class="img" :src="item.tagImageUrl" />
              <span class="span">{{ item.tagName }}</span>
            </div>
            <img
              class="bottom-img"
              src="./image/bottom-arrow.png"
              v-if="currentTopTagIndex == index"
            />
          </div>
        </div>
      </div>
      <div class="div_flex">
        <div class="div_tab" v-for="tab in tabs" @click="tabClick(tab)">
          <div class="text" :class="{ text_red: tab.id == selectTab }">
            {{ tab.text }}（{{ tab.count }}）
          </div>
          <div
            class="line_div"
            :class="{ line_div_red: selectTab == tab.id }"
          ></div>
        </div>
      </div>
      <!-- <div class="tag-div" v-show="tabs[selectTab].count != 0">
        <span
          v-for="(item, index) of currentTagData"
          @click="tagClick(item, index)"
          :class="currentSlectedTag == index ? 'slectedSpan' : ''"
        >
          {{ item.tagName + "(" + item.num + ")" }}
        </span>
      </div> -->
      <div class="pullto" v-if="tabs[selectTab].count != 0">
        <ul class="tab_content">
          <li
            class="item_div shadow-cell"
            v-for="item in datas"
            @click="enterDetail(item)"
            :class="selectTab === 0 ? '' : selectTab === 1 ? 'used' : 'guoqi'"
          >
            <img :src="item.imgurl" />
            <div class="ticket_div">
              <div class="title_div">
                <span class="type">{{
                  item.couTypeCategoryName || "电子券"
                }}</span>
                <div class="title">{{ item.typetitle }}</div>
              </div>
              <div class="type_div">{{ item.typename }}</div>
              <div class="date_div">
                <span class="date"
                  >{{ item.coustartdate }}-{{ item.couenddate }}</span
                >
                <span class="use">使用</span>
              </div>
            </div>
            <div class="use_div_img" v-if="selectTab === 1">
              <img src="./image/overUse.png" alt="" />
            </div>
            <div class="use_div_img" v-if="selectTab === 2">
              <img src="./image/overdue.png" alt="" />
            </div>
          </li>
        </ul>
      </div>
      <div class="pullto empty-div" v-else>
        <div class="empty">没有相关电子券</div>
      </div>
    </nav-content>
  </div>
</template>

<script>
export default {
  name: "mineorder",
  data() {
    return {
      msg: "msg",
      selectTab: 0,
      // currentSlectedTag: 0,
      currentTopTagIndex: 0,
      topTags: [
        {
          id: 0,
          tagName: "加油券",
          tagImageUrl: require("@/deploy/jlxs/views/electronic-ticket/image/top_01.png"),
          tagAlias: "JY"
        },
        {
          id: 1,
          tagName: "便利店券",
          tagImageUrl: require("@/deploy/jlxs/views/electronic-ticket/image/top_02.png"),
          tagAlias: "BLD"
        },
        {
          id: 2,
          tagName: "商城券",
          tagImageUrl: require("@/deploy/jlxs/views/electronic-ticket/image/top_03.png"),
          tagAlias: "SC"
        },
        {
          id: 3,
          tagName: "其他",
          tagImageUrl: require("@/deploy/jlxs/views/electronic-ticket/image/top_04.png"),
          tagAlias: "QT"
        }
      ],
      tabs: [
        {
          id: 0,
          text: "未使用",
          count: "0"
        },
        {
          id: 1,
          text: "已使用",
          count: "0"
        },
        {
          id: 2,
          text: "已过期",
          count: "0"
        }
      ],
      datas: [],
      clea: "", // 定时器开关
      currentTagData: [
        // { tagalias: "JY", tagName: "加油券", num: 1 },
        // { tagalias: "SC", tagName: "商城券", num: 5 },
        // { tagalias: "ZYHZM", tagName: "自营合作券", num: 3 },
        // { tagalias: "JY", tagName: "加油券", num: 1 },
        // { tagalias: "SC", tagName: "商城券", num: 5 },
        // { tagalias: "ZYHZM", tagName: "自营合作券", num: 3 },
        // { tagalias: "JY", tagName: "加油券", num: 1 },
        // { tagalias: "SC", tagName: "商城券", num: 5 },
        // { tagalias: "ZYHZM", tagName: "自营合作券", num: 3 }
      ]
    };
  },
  methods: {
    topTagSlect(item, index) {
      this.currentTopTagIndex = index;
      this.getCounpCount();
      this.gettickets();
    },
    // tagClick(item, index) {
    //   this.currentSlectedTag = index;
    //   this.datas = [];
    //   this.refresh();
    // },
    tabClick: function(tab) {
      this.selectTab = tab.id;
      clearInterval(this.clea);
      // this.currentSlectedTag = 0;
      this.datas = [];
      // this.getTags();
      this.refresh();
    },
    enterDetail: function(item) {
      if (this.selectTab == "2") {
        return;
      }
      if (this.currentTopTagIndex == 2) {
        if (this.selectTab == 0) {
          let path = '/mall2/list/' + this.$util.getDataString()
          this.$router.push({
            path: path,
            query: {
              pageType: 'coupon',
              coupon: item.coucode,
              couThresholdAmount: item.couThresholdAmount,
              couFaceValue: item.couFaceValue,
              lastPath: this.$route.path,
              endTime: this.$util.getDateFromString(item.couenddate)
            }
          })
        }
      } else {
        if (this.selectTab == "1") {
          this.$bridgefunc.customPush({
            path: "/jlxs_ticket_used",
            query: {
              item: encodeURIComponent(JSON.stringify(item.voucher))
            }
          });
        } else {
          this.$bridgefunc.customPush({
            path: "/jlxs_ticket_detail",
            query: {
              item: encodeURIComponent(JSON.stringify(item))
            }
          });
        }
      }
    },
    /*
    getTags() {
      let _this = this;
      let url = "";
      if (this.selectTab == "0") {
        url = "/platform/json/coupon/getCouTagsUnused ";
      } else if (this.selectTab == "1") {
        url = "/platform/json/coupon/getCouTagsUsed";
      } else {
        url = "/platform/json/coupon/getCouTagsOverdue";
      }
      let parmas = {
        // token: this.$store.getters.token,
        isJsonData: true
      };
      _this.$Loading.open();
      this.$http.post(url, parmas).then(
        res => {
          _this.$Loading.close();
          if (res.data.status == "0") {
            //  { tagalias: "JY", tagName: "加油券", num: 1 },
            let lastData = res.data.data;
            let count = _this.tabs[_this.selectTab].count || "";
            if (!lastData) {
              lastData = [];
            }
            lastData.unshift({
              tagalias: "",
              tagName: "全部",
              num: count
            });
            _this.currentTagData = lastData;
          } else {
            _this.$Toast({
              message: res.data.info,
              position: "bottom",
              duration: 2000
            });
          }
        },
        error => {
          _this.$Loading.close();
          _this.$Toast({
            message: "请求失败",
            position: "bottom",
            duration: 2000
          });
        }
      );
    },
    */
    getToptags() {
      let _this = this;
      let url = "/platform/json/coupon/getTagInfo";
      let parmas = {
        isJsonData: true,
        token: this.$store.state.login.token
      };
      _this.$Loading.open();
      this.$http.post(url, parmas).then(
        res => {
          _this.$Loading.close();
          if (res.data.status == "0") {
            let lastData = res.data.data;
            if (!lastData) {
              lastData = [];
            }
            _this.topTags = lastData;
          } else {
            _this.$Toast({
              message: res.data.info || "请求失败",
              position: "bottom",
              duration: 2000
            });
          }
        },
        error => {
          _this.$Loading.close();
          _this.$Toast({
            message: "请求失败",
            position: "bottom",
            duration: 2000
          });
        }
      );
    },
    gettickets() {
      let _this = this;
      let url = "";
      if (this.selectTab == "0") {
        url = "/platform/json/coupon/unusedcouponsNew";
      } else if (this.selectTab == "1") {
        url = "/platform/json/coupon/usedcouponsNew";
      } else {
        url = "/platform/json/coupon/overduecouponsNew";
      }
      // let currentTagItem = this.currentTagData[this.currentSlectedTag];
      let currentTagItem = this.topTags[this.currentTopTagIndex];
      let parmas = {
        isJsonData: true,
        token: this.$store.state.login.token,
        tagAlias: currentTagItem ? currentTagItem.tagAlias || "" : ""
      };
      _this.$Loading.open();
      this.$http.post(url, parmas).then(
        res => {
          _this.$Loading.close();
          if (res.data.status == "0") {
            // biztype: "5"
            // biztypecode: "油品券：每人每天限使用1张"
            // coucode: "000008588465"
            // couenddate: "2019-01-16"
            // coustartdate: "2018-12-17"
            // imgurl: "http://jiangsu.95504.net/upload/dzjtp/5K000027.png"
            // isdon: 0
            // limit: 1
            // typename: "test-122"
            // typetitle: "wuzh_test-122"
            // voucher: "507020609068588465"
            _this.datas = res.data.data;
          } else {
            _this.$Toast({
              message: res.data.info,
              position: "bottom",
              duration: 2000
            });
          }
          // _this.orderItems = items
        },
        error => {
          _this.$Loading.close();
          _this.$Toast({
            message: "请求失败",
            position: "bottom",
            duration: 2000
          });
        }
      );
    },
    refresh() {
      this.gettickets();
      this.clea && clearInterval(this.clea);
      this.clea = setInterval(() => {
        this.gettickets();
      }, 3600000);
    },
    getCounpCount() {
      let url = "/platform/json/coupon/getcountNew";
      let currentTagItem = this.topTags[this.currentTopTagIndex];
      let parmas = {
        isJsonData: true,
        token: this.$store.state.login.token,
        tagAlias: currentTagItem ? currentTagItem.tagAlias || "" : ""
      };
      let _this = this;
      this.$Loading.open();
      this.$http.post(url, parmas).then(
        res => {
          _this.$Loading.close();
          if (res.data.status == "0") {
            let data = res.data.data;
            // biztype: "5"
            // biztypecode: "油品券：每人每天限使用1张"
            // coucode: "000008588465"
            // couenddate: "2019-01-16"
            // coustartdate: "2018-12-17"
            // imgurl: "http://jiangsu.95504.net/upload/dzjtp/5K000027.png"
            // isdon: 0
            // limit: 1
            // typename: "test-122"
            // typetitle: "wuzh_test-122"
            // voucher: "507020609068588465"
            // _this.datas = res.data.data
            // debugger
            let newTabs = [
              {
                id: 0,
                text: "未使用",
                count: data.unusednum || "0"
              },
              {
                id: 1,
                text: "已使用",
                count: data.usednum || "0"
              },
              {
                id: 2,
                text: "已过期",
                count: data.expnum || "0"
              }
            ];
            _this.tabs = newTabs;
            if (_this.currentTagData.length > 0) {
              _this.currentTagData[0].num = data.unusednum;
              // return;
              // let item = _this.currentTagData[0];
              // item.num = data.unusednum;
              // _this.$set(_this.currentTagData, 0, item);
            }
          }
          // _this.orderItems = items
        },
        error => {
          _this.$Loading.close();
          _this.$Toast({
            message: "请求失败",
            position: "bottom",
            duration: 2000
          });
        }
      );
    }
    // getUrlParam(k, url) {
    //   let _url = decodeURIComponent(window.location.href);
    //   _url = _url.substr(_url.indexOf("?") + 1);
    //   let GETs = _url.split("&");
    //   let GET = [];
    //   for (let i = 0; i < GETs.length; i++) {
    //     let tmp_arr = GETs[i].split("=");
    //     let key = tmp_arr[0];
    //     GET[key] = tmp_arr[1];
    //   }
    //   return GET[k] || "";
    // }
  },
  mounted() {
    // if (!this.$store.getters.token) {
    //   let token = this.getUrlParam("token");
    //   this.$store.commit("setToken", token);
    // }
  },
  created() {
    //从首页进入本界面 watch是直接进入本界面
    this.refresh(); //请求未使用电子券
    this.getCounpCount(); //请求数量
    // this.getTags(); //请求标签
    this.getToptags(); //请求顶部标签 默认油品券
  },
  destroyed() {
    clearInterval(this.clea);
  },
  watch: {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
@import '../../stylus/variable.styl';

.minelist {
  /* overflow hidden */
  display: flex;
  flex-direction: column;

  .top-tags {
    background: #754613;

    .top-content {
      // display: flex;
      // overflow-x: scroll;
      white-space: nowrap;
      width: 100%;
      -webkit-overflow-scrolling: touch;
      // overflow-x: auto;
      overflow-x: auto;
      overflow-y: hidden;

      .item {
        width: 25%;
        background: transparent;
        justify-content: center;
        align-items: center;
        position: relative;
        display: inline-flex;

        .item-back {
          background: white;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border-radius: 5px;
          background: white;
          width: 70%;
          margin: 15px 0;
          font-size: 13px;

          // height 80%
          .img {
            width: 35px;
            margin-top: 10px;
          }

          .span {
            padding: 10px 0;
          }
        }

        .item-back-big {
          font-size: 15px;
          width: 75%;

          .img {
            width: 45px;
            // margin-top: 5px;
          }

          .span {
            padding: 15px 0;
          }
        }

        .bottom-img {
          position: absolute;
          bottom: -1px;
          width: 20%;
        }
      }
    }
  }

  .div_flex {
    display: flex;
    align-items: center;
    justify-items: center;

    .div_tab {
      flex: 1;
      text-align: center;

      .text {
        font-size: $font-size-medium;
        margin-left: 10px;
        padding: 10px 0;
      }

      .text_red {
        color: red;
      }

      .line_div {
        margin: 1px 20%;
        height: 1px;
        background: white;
      }

      .line_div_red {
        background: red;
      }
    }
  }

  .tag-div {
    margin-top: 5px;
    padding: 0 10px;
    font-size: $font-size-medium-s;
    display: flex;
    flex-flow: wrap;

    span {
      border-radius: 18px;
      padding: 5px 10px;
      color: white;
      margin: 3px;
      background: #EFEEF0;
      color: black;
      border: 1px solid transparent;
    }

    .slectedSpan {
      border: 1px solid $color-theme-o;
      color: $color-theme-o;
      background: white;
    }
  }

  .empty-div {
    display: flex;
    align-items: center;
    text-align: center;
    justify-content: center;
    font-size: $font-size-medium-x;
    color: $color-theme-text-h;
  }

  .pullto {
    flex: 1;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;

    .tab_content {
      .item_div {
        display: flex;
        align-items: center;
        justify-items: center;
        margin: 10px;
        border-radius: 10px;
        position: relative;

        .ticket_div {
          flex: 1;

          .title_div {
            padding: 5px;
            font-weight: 700;
            font-size: $font-size-medium;
            display: flex;
            align-items: center;

            .title {
              line-height: $font-size-medium-x;
            }

            .type {
              font-size: $font-size-small-x;
              border-radius: 15px;
              background: $color-theme-o;
              color: white;
              padding: 2px 10px;
              font-weight: 500;
              margin-right: 5px;
              white-space: nowrap;
            }
          }

          .type_div {
            padding: 5px;
            font-size: $font-size-medium-s;
          }

          .date_div {
            padding: 5px;
            font-size: $font-size-medium-s;
            color: $color-theme-text-h;
            display: flex;
            align-items: center;
            justify-content: space-between;

            .use {
              padding: 5px 10px;
              border-radius: 20px;
              color: white;
              background: $color-theme-o;
              margin-right: 10px;
            }
          }
        }

        img {
          width: 60px;
          height: 60px;
          margin-right: 10px;
        }

        .use_div {
          margin: 10px;
          padding: 5px 10px;
          border-radius: 20px;
          color: white;
          background: linear-gradient(to left, #f29676, #f19677);
        }

        .use_div_img {
          position: absolute;
          right: 0;
          // bottom -1px
          margin: 10px;
          padding: 5px 10px;
        }
      }

      .used, .guoqi {
        color: $color-theme-text-h;
      }
    }
  }
}
</style>
