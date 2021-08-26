<template>
  <div class="body">
    <!-- <nav-top @backEvent="$router.go(-1)" title="订单列表"></nav-top> -->
    <!-- <nav-content> -->
    <!-- <van-tabs @click="changes" v-model="title">
      <van-tab :title="item.title" v-for="(item, index) in tabList" :key="index">

      </van-tab>
    </van-tabs> -->
    <van-sticky>
      <div class="nav">
        <div class="nav_top">
          <div class="back" @click="$router.go(-1)">
            <img :src="require('./images/button_back.png')" alt="" />
          </div>
          <div class="title">我的活动</div>
          <div class="no"></div>
        </div>
        <div class="nav_tabs">
          <div
            class="tab_item"
            v-for="(item, index) in tabTitle"
            :key="index"
            @click="changesTab(index)"
            :class="currentTab == index ? 'current_tab' : ''"
            v-show="index !== 0"
          >
            {{ item.title }}
          </div>
        </div>
      </div>
    </van-sticky>

    <van-pull-refresh
      v-model="refreshing"
      @refresh="onRefresh"
      style="min-height: 400px"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
      >
        <div
          class="box"
          @click="goToDeatil(item.id, item.groupbuyActivityName)"
          v-for="(item, index) in allList"
          :key="index"
        >
          <div
            class="type"
            :style="{
              backgroundImage:
                item.groupbuyActivityStatus == 1
                  ? `url(${require('./images/tips_on_default.png')})`
                  : `url(${require('./images/tips_over_default.png')})`
            }"
          >
            {{
              item.groupbuyActivityStatus == 0
                ? "未开始"
                : item.groupbuyActivityStatus == 1
                ? "进行中"
                : "已结束"
            }}
          </div>
          <!-- <div class="div1">
            <div>
              <span>{{ item.groupbuyActivityName }}</span>
            </div>
          </div> -->
          <div class="div2">
            <img :src="item.groupbuyActivityPicurl" alt="" />
            <div class="activity_detail">
              <div class="activity_name">{{ item.groupbuyActivityName }}</div>
              <div class="date">
                <span></span>
                截止日期：{{ item.groupbuyEndDatetime }}
              </div>
              <div class="goods_count">
                <!-- <span>{{
                  item.groupbuyActivityStatus == 0
                    ? "未开始"
                    : item.groupbuyActivityStatus == 1
                    ? "进行中"
                    : "已结束"
                }}</span> -->
                <!-- <span>已团{{ item.orderCount }}单</span> -->
                <span></span>
                {{ item.productCount }}件商品
              </div>
              <!-- <p>
                <span
                  @click.stop="share(item)"
                  v-show="item.groupbuyActivityStatus == 1"
                  >分享</span
                >
                <span @click.stop="navToDetail(item.id)">本团订单</span>
              </p> -->
            </div>
          </div>
          <div class="btns">
            <div
              class="share"
              @click.stop="share(item)"
              v-show="item.groupbuyActivityStatus == 1"
            >
              分享活动
            </div>
            <div class="order" @click.stop="navToDetail(item.id)">本团订单</div>
          </div>
        </div>
      </van-list>
      <!-- <div v-if="allList.length == 0 && getDataOk" class="not-data">暂无数据</div> -->
    </van-pull-refresh>
    <!-- 
    <van-share-sheet
      class="copyData"
      v-model="showShare"
      title="分享到"
      :options="options"
      cancel-text=""
      @select="onShare"
    /> -->
    <van-overlay :show="showShare" @click="showShare = false">
      <div class="share">
        <div class="share_box">
          <img
            :src="require('./images/button_close_default.png')"
            alt=""
            class="close"
            @click.stop="showShare = false"
          />
          <div class="share_title">分享至</div>
          <img
            :src="require('./images/icon_default_wechat.png')"
            alt=""
            @click.stop="onShare('wechat')"
            class="wechat"
          />
          <div class="share_tips">发送至好友</div>
        </div>
      </div>
    </van-overlay>
    <!-- <button
      v-show="false"
      ref="copybtn"
      class="copy-btn"
      @click="copyLink"
      :data-clipboard-text="this.link"
    ></button> -->
    <!-- </nav-content> -->
    <div class="withdraw" @click="goTocommission">
      <img src="./images/money.png" alt="" />
      <div class="dingwei">
        <p style="font-size:14px">
          <span style="font-size:6px">￥</span
          >{{ $util.toDecimal2(this.balancesAmount) }}
        </p>
        <p>点击提现</p>
      </div>
    </div>
  </div>
</template>

<script>
import Qs from "qs";
import ClipboardJS from "clipboard";
import appShare from "@zkty-team/x-engine-module-share";
import { getLocation } from "../utils";
import { cashHttp } from "@/utils/cashHttp.js";
export default {
  name: "activity",
  // mixins: [api],
  data() {
    return {
      state: 1,
      showShare: false,
      options: [
        { name: "微信", icon: "wechat" }
        // { name: "复制链接", icon: "link" },
      ],
      copybtn: null,
      tabTitle: [
        { title: "全部" },
        { title: "进行中" },
        { title: "未开始" },
        { title: "已结束" }
      ],
      currentTab: 1,
      allList: [],
      loading: false, //是否处于加载状态，加载过程中不触发load事件
      finished: false, //是否已加载完成，加载完成后不再触发load事件
      refreshing: false, //是否处于加载中状态
      error: false,
      currentPage: 0,
      totalPage: 0,
      userData: {},
      shareItemData: {},
      link: "",
      getDataOk: false,
      page: 1,
      balancesAmount: 0 //可提现金额
    };
  },
  created() {
    this.allList = [];
    this.$http
      .get("/app/json/group_buying_head_info/findSelfInfo")
      .then(res => {
        if (res.data.result == "success") {
          this.userData = res.data.data;
        }
      });
    this.getlist();
    this.getCommissionBalances();
    console.log("getLocation---->", getLocation());
  },
  methods: {
    // 切换tab
    changesTab(index) {
      this.currentTab = index;
      this.currentPage = 0;
      this.allList = [];
      this.finished = false;
      this.loading = true;
      this.getDataOk = false;
      this.getlist();
    },
    goBack() {
      this.$router.go(-1);
    },
    // 请求列表
    getlist() {
      let page = this.currentPage;
      page = page + 1;
      this.currentPage = page;
      this.refreshing = false;

      let obj = {
        pageIndex: this.currentPage,
        groupbuyActivityStatus:
          this.currentTab == 0
            ? undefined
            : this.currentTab == 1
            ? 1
            : this.currentTab == 2
            ? 0
            : this.currentTab == 3
            ? 2
            : undefined
      };
      this.$http
        .post("/app/json/groupbuying_activity_app/list", Qs.stringify(obj))
        .then(res => {
          if (res.data.result == "success") {
            this.allList = this.allList.concat(res.data.data);
            this.page = res.data.page; //将总页数赋值给this
            this.totalPage = res.data.totalPages;
            this.loading = false;
            this.getDataOk = true;
          } else {
            this.loading = false; //将加载状态关掉
            this.error = true; //大家错误状态
          }
        })
        .catch(err => {
          this.$toast("请求失败，点击重新加载");
          this.loading = false;
          this.error = true;
        });
    },
    //上拉加载
    onLoad() {
      if (this.getDataOk) {
        if (this.page < this.totalPage) {
          this.getlist();
        } else {
          this.finished = true;
        }
      }
    },
    // 下拉刷新时触发
    onRefresh() {
      this.allList = [];
      this.finished = false;
      this.page = 1;
      this.currentPage = 0;
      this.getlist();
    },
    share(item) {
      this.shareItemData = item;
      this.showShare = true;
    },
    //加密参数
    addCode(url = "") {
      return new Promise((resolve, reject) => {
        this.$request
          .post("/app/json/short_address/makeShortAddress", {
            longAddress: url
          })
          .then(res => {
            if (res.status == 0) {
              resolve(new URL(res.data).pathname);
            } else {
              reject();
            }
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    onShare: async function(option) {
      ///app-vue/app/index.html#/bulk_share?params=1&purchaseId=${this.shareItemData.id}&chiefId=${this.userData.teamLeaderNo}&userId=${this.userData.userNo}&activityName=${this.shareItemData.groupbuyActivityName}
      // const sence = await this.addCode(
      //   `https://mall-uat-app-linli.timesgroup.cn/app-vue/app/index.html#/bulk_share?purchaseId=${this.shareItemData.id}&chiefId=${this.userData.teamLeaderNo}&userId=${this.userData.userNo}&activityName=${this.shareItemData.groupbuyActivityName}`
      // );
      if (option == "wechat") {
        if (this.$store.state.webtype == 3 || this.$store.state.webtype == 2) {
          console.log("当前是小程序~~~");
          //判断小程序
          this.options = [{ name: "复制链接", icon: "link" }];
        } else if (
          this.$store.state.webtype == 0 ||
          this.$store.state.webtype == 1
        ) {
          console.log(
            this.shareItemData.id,
            this.userData.teamLeaderNo,
            this.userData.userNo,
            this.shareItemData.groupbuyActivityName
          );
          appShare
            .shareForOpenWXMiniProgram({
              // userName: "gh_2a45a4d38d81",
              userName: "gh_28d617271c97",
              // path: `pages/common/home/index?sence=${sence}`,
              path: `pages/common/home/index?redirect=${encodeURIComponent(
                `/app-vue/app/index.html#/bulk_share?params=1&purchaseId=${this.shareItemData.id}&chiefId=${this.userData.teamLeaderNo}&userId=${this.userData.userNo}`
              )}`,
              title: this.shareItemData.groupbuyActivityName,
              desc: this.shareItemData.groupbuyActivityName,
              link: getLocation(window.location.href),
              imageurl:
                this.shareItemData.groupbuyActivityPicurl +
                `?x-oss-process=image/format,jpg/quality,Q_${this.$util.isAndroid()?'50':'10'}`,
              // miniProgramType: process.env.NODE_ENV == "production" ? 2 : 0,
              miniProgramType:
                this.$store.state.environment == "production" ? 0 : 2,
              __event__: res => {}
            })
            .then(res => {
              // document.getElementById("debug_text").innerText = res;
              // alert("shareThenRes----------", JSON.stringify(res));
            });
          // this.$router.push({
          //   path: "/bulk_share",
          //   query: {
          //     purchaseId: JSON.stringify(this.shareItemData.id),
          //     chiefId: JSON.stringify(this.userData.teamLeaderNo),
          //     userId: JSON.stringify(this.userData.userNo),
          //     activityName: JSON.stringify(
          //       this.shareItemData.groupbuyActivityName
          //     ),
          //   },
          // });
        }
      } else if (option == "link") {
        this.$http
          .post("/app/json/app_group_buying_share_home/generateShareLink", {
            path: "/pages/homePage/temporaryCapture",
            query: `redirect=${encodeURIComponent(
              `/app-vue/app/index.html#/bulk_share?params=1&purchaseId=${this.shareItemData.id}&chiefId=${this.userData.teamLeaderNo}&userId=${this.userData.userNo}`
            )}`
          })
          .then(res => {
            if (res.data.data.errcode == 0) {
              this.link = getLocation(res.data.data.openlink);
              // weixin://dl/business/?t=lzjYaPnRpgo
              new ClipboardJS(".btn", {
                text: function(trigger) {
                  return this.link;
                }
              });
            }
          });
      }
      this.showShare = false;
    },
    navToDetail(id) {
      //本团订单
      this.$router.push({
        path: "/groupOrder",
        query: {
          id: JSON.stringify(id)
        }
      });
    },
    goToDeatil(id, groupbuyActivityName) {
      this.$router.push({
        path: "/bulkDetails",
        query: {
          activityNo: JSON.stringify(id),
          groupbuyActivityName: JSON.stringify(groupbuyActivityName)
        }
      });
    },
    //获取可提现金额
    getCommissionBalances() {
      let url = "/times/mall-cash-center/api/commission/commissionBalances";
      let obj = {
        systemFlag: "02" //01：分销；02：团购
      };
      cashHttp("POST", url, obj).then(res => {
        if (res.code === 200) {
          this.balancesAmount = res.data.balances;
        }
      });
    },
    //点击提现
    goTocommission() {
      let url = "";
      let token = this.$store.state.ythToken
        ? this.$store.state.ythToken
        : localStorage.getItem("ythToken");
      if (this.$store.state.environment == "development") {
        url = `https://mall-uat-app-linli.timesgroup.cn/commission/?ythToken=${token}`;
      } else {
        url = `https://mall-prod-app-linli.timesgroup.cn/commission/?ythToken=${token}`;
      }
      window.location.href = url;
    }
  }
};
</script>

<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';
@import '~@/common/stylus/mixin.styl';

.body {
  background-color: #f6f6f6 !important;
  overflow-y: scroll;
  width: 100%;
  height: 100%;

  .nav {
    background-color: #fff;
    width: 100%;
    height: 128px;

    .nav_top {
      width: 100%;
      height: 44px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 56px;
      padding-bottom: 21px;

      .back {
        width: 75px;
        height: 44px;
        display: flex;
        justify-content: center;
        align-items: center;

        img {
          width: 9px;
          height: 16px;
        }
      }

      .title {
        font-size: 17px;
        font-family: PingFang SC;
        font-weight: 400;
        color: #000000;
      }

      .no {
        width: 75px;
        height: 44px;
      }
    }

    .nav_tabs {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 21px 39px 12px;

      .tab_item {
        background: #fff;
        border-radius: 15px;
        text-align: center;
        line-height: 22px;
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: 400;
        color: #666666;
        padding: 0 7px;
      }

      .current_tab {
        background: #E9306D;
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: 400;
        color: #FFFFFF;
        padding: 0 7px;
      }
    }
  }

  .van-list {
    padding-bottom: 49px;
  }

  .box {
    padding: 17px 15px 16px 17px;
    background: white;
    margin: 12px 12px;
    font-size: 14px;
    border-radius: 12px;
    position: relative;

    .type {
      width: 43px;
      height: 21px;
      position: absolute;
      left: 17px;
      top: 17px;
      background-size: 100% 100%;
      background-repeat: no-repeat;
      font-size: 12px;
      font-family: PingFang SC;
      font-weight: bold;
      color: #FFFFFF;
      line-height: 16px;
      text-align: center;
      line-height: 21px;
    }

    .div1 {
      display: flex;
      justify-content: space-between;

      span {
        font-size: 14px;
        margin: auto 0;
      }

      .state {
        width: 75px;
        text-align: right;
      }

      div {
        display: flex;
        justify-content: space-between;

        img {
          width: 24px;
          height: 24px;
          margin: auto;
          margin-right: 5px;
        }

        span {
          font-size: 16px;
          margin: auto;
          line-height: 22px;
        }
      }
    }

    .div2 {
      // margin-top: 15px;
      display: flex;
      justify-content: start;
      padding-bottom: 17px;
      border-bottom: 1px solid #F0F0F0;
      margin-bottom: 15px;

      img {
        width: 90px;
        height: 90px;
        object-fit: cover;
        border-radius: 12px;
        margin-right: 14px;
      }

      .activity_detail {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;

        .activity_name {
          font-size: 16px;
          font-family: PingFang SC;
          font-weight: bold;
          color: #333333;
          line-height: 16px;
        }

        .date {
          font-size: 13px;
          font-family: PingFang SC;
          font-weight: 400;
          color: #666666;
          line-height: 16px;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          margin: 16px 0 12px;

          span {
            width: 5px;
            height: 5px;
            background: #E9306D;
            border-radius: 50%;
            margin-right: 8px;
          }
        }

        .goods_count {
          font-size: 13px;
          font-family: PingFang SC;
          font-weight: 400;
          color: #666666;
          line-height: 16px;
          display: flex;
          justify-content: flex-start;
          align-items: center;

          span {
            width: 5px;
            height: 5px;
            background: #E9306D;
            border-radius: 50%;
            margin-right: 8px;
          }
        }
      }
    }

    .btns {
      display: flex;
      justify-content: flex-end;
      align-items: center;

      .share {
        width: 94px;
        height: 35px;
        border: 1px solid #F39800;
        border-radius: 18px;
        text-align: center;
        line-height: 35px;
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: 400;
        color: #F39800;
        margin-right: 12px;
      }

      .order {
        width: 94px;
        height: 35px;
        border: 1px solid #E9306D;
        border-radius: 18px;
        text-align: center;
        line-height: 35px;
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: 400;
        color: #E9306D;
      }
    }
  }

  /deep/.van-pull-refresh__track {
    min-height: 400px;
  }

  .share {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    .share_box {
      width: 265px;
      height: 170px;
      background: #FFFFFF;
      border-radius: 12px;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;

      .close {
        position: absolute;
        top: 18px;
        right: 18px;
        width: 10px;
        height: 10px;
      }

      .share_title {
        font-size: 15px;
        font-family: PingFang SC;
        font-weight: bold;
        color: #333333;
        line-height: 16px;
        margin: 27px 0 28px;
      }

      .wechat {
        width: 51px;
        height: 51px;
        margin-bottom: 10px;
      }

      .share_tips {
        font-size: 12px;
        font-family: PingFang SC;
        font-weight: bold;
        color: #121212;
        line-height: 15px;
      }
    }
  }
}

/deep/ .van-tabs__line {
  background-color: #C61606 !important;
  height: 0.04rem;
}

/deep/ .van-tab--active {
  color: #C61606;
}
.withdraw{
  position: fixed;
  right:10px;
  bottom:12%;
  width: 90px;
  height: 90px;
  text-align: center;
  img{
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
  }
  .dingwei{
    // position: absolute;
    position: relative;
    // left: 10%;
    // bottom: 10%;
    color: #fff;
    top: 48px;
    line-height: 15px;
  }
}
</style>
