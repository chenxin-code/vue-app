<template>
  <div class="body">
    <!-- <nav-top @backEvent="$router.go(-1)" title="订单列表"></nav-top> -->
    <!-- <nav-content> -->
    <!-- <van-tabs @click="changes" v-model="title">
      <van-tab :title="item.title" v-for="(item, index) in tabList" :key="index">

      </van-tab>
    </van-tabs> -->
    <van-sticky>
      <div class="tab">
        <div class="tab_back" @click="goBack()">
            <van-icon
            name="arrow-left"
            class="arrow_left"
            color="#000000"
            size="0.471467rem"
            />
        </div>
        <div class="tab_item_box">
          <div
            class="tab_item"
            v-for="(item, index) in tabTitle"
            :key="index"
            @click="changesTab(index)"
            :class="currentTab == index ? 'current_tab' : ''"
          >
            {{ item.title }}
          </div>
        </div>
      </div>
    </van-sticky>

    <van-pull-refresh v-model="refreshing" @refresh="onRefresh" style="min-height: 400px;">
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
          @click="goToDeatil(item.id)"
          v-for="(item, index) in allList"
          :key="index"
        >
          <div class="div1">
            <div>
              <span>{{ item.groupbuyActivityName }}</span>
            </div>
          </div>
          <div class="div2">
            <img :src="item.groupbuyActivityPicurl" alt="" />
            <div>
              <p>截止日期：{{ item.groupbuyEndDatetime }}</p>
              <p>
                <span>{{
                  item.groupbuyActivityStatus == 0
                    ? "未开始"
                    : item.groupbuyActivityStatus == 1
                    ? "进行中"
                    : "已结束"
                }}</span>
                <!-- <span>已团{{ item.orderCount }}单</span> -->
                <span>共{{ item.productCount }}件商品</span>
                <span><van-icon name="arrow" /></span>
              </p>
              <p>
                <span
                  @click.stop="share(item)"
                  v-show="item.groupbuyActivityStatus == 1"
                  >分享</span
                >
                <span @click.stop="navToDetail(item.id)">本团订单</span>
              </p>
            </div>
          </div>
        </div>
      </van-list>
      <!-- <div v-if="allList.length == 0 && getDataOk" class="not-data">暂无数据</div> -->
    </van-pull-refresh>

    <van-share-sheet
      class="copyData"
      v-model="showShare"
      title="分享到"
      :options="options"
      cancel-text=""
      @select="onShare"
    />
    <!-- <button
      v-show="false"
      ref="copybtn"
      class="copy-btn"
      @click="copyLink"
      :data-clipboard-text="this.link"
    ></button> -->
    <!-- </nav-content> -->
  </div>
</template>

<script>
import Qs from "qs";
import ClipboardJS from "clipboard";
import appShare from "@zkty-team/x-engine-module-share";
export default {
  name: "activity",
  // mixins: [api],
  data() {
    return {
      state: 1,
      showShare: false,
      options: [
        { name: "微信", icon: "wechat" },
        // { name: "复制链接", icon: "link" },
      ],
      copybtn: null,
      tabTitle: [
        { title: "全部" },
        { title: "进行中" },
        { title: "未开始" },
        { title: "已结束" },
      ],
      currentTab: 0,
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
      page: 1
    };
  },
  created() {
    this.allList = [];
    this.$http
      .get("/app/json/group_buying_head_info/findSelfInfo")
      .then((res) => {
        if (res.data.result == "success") {
          this.userData = res.data.data;
        }
      });
      this.getlist();
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
    goBack(){
      // this.$router.push({})
      // if(){
        this.$router.go(-1);
      // }
    },
    // 请求列表
    getlist(){
      let page = this.currentPage;
      page = page + 1;
      this.currentPage = page;
      this.refreshing = false;

      let obj = {
        pageIndex: this.page,
        groupbuyActivityStatus:
          this.currentTab == 0
            ? undefined
            : this.currentTab == 1
            ? 1
            : this.currentTab == 2
            ? 0
            : this.currentTab == 3
            ? 2
            : undefined,
      };
      this.$http
        .post("/app/json/groupbuying_activity_app/list", Qs.stringify(obj))
        .then((res) => {
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
        .catch((err) => {
          this.$toast("请求失败，点击重新加载");
          this.loading = false;
          this.error = true;
        });
    },
    //上拉加载
    onLoad() {
      if(this.getDataOk){
        if(this.page < this.totalPage){
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
      this.getlist();
    },
    share(item) {
      this.shareItemData = item;
      this.showShare = true;
    },
    onShare: function (option) {
      if (option.icon == "wechat") {
        if (this.$store.state.webtype == 3 || this.$store.state.webtype == 2) {
          console.log("当前是小程序~~~")
          //判断小程序
          this.options = [{ name: "复制链接", icon: "link" }];
        } else if (
          this.$store.state.webtype == 0 ||
          this.$store.state.webtype == 1
        ) {
          appShare
            .shareForOpenWXMiniProgram({
              // userName: "gh_2a45a4d38d81",
              userName: "gh_28d617271c97",
              path: `pages/common/home/index?redirect=${encodeURIComponent(
                `/app-vue/app/index.html#/bulk_share?purchaseId=${this.shareItemData.id}&chiefId=${this.userData.teamLeaderNo}&userId=${this.userData.userNo}&activityName=${this.shareItemData.groupbuyActivityName}`
              )}`,
              title: "微信分享商品",
              desc: "test",
              link: "https://www.baidu.com",
              imageurl: this.shareItemData.groupbuyActivityPicurl,
              // miniProgramType: process.env.NODE_ENV == "production" ? 2 : 0,
              miniProgramType: this.$store.state.environment=='production'?0:2,
              __event__: (res) => {},
            })
            .then((res) => {
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
      } else if (option.icon == "link") {
        this.$http
          .post("/app/json/app_group_buying_share_home/generateShareLink", {
            path: "/pages/homePage/temporaryCapture",
            query: `redirect=${encodeURIComponent(
              `/app-vue/app/index.html#/bulk_share?purchaseId=${this.shareItemData.id}&chiefId=${this.userData.teamLeaderNo}&userId=${this.userData.userNo}`
            )}`,
          })
          .then((res) => {
            if (res.data.data.errcode == 0) {
              this.link = res.data.data.openlink;
              // weixin://dl/business/?t=lzjYaPnRpgo
              new ClipboardJS(".btn", {
                text: function (trigger) {
                  return this.link;
                },
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
          id: JSON.stringify(id),
        },
      });
    },
    goToDeatil(id) {
      this.$router.push({
        path: "/bulkDetails",
        query: {
          activityNo: JSON.stringify(id),
        },
      });
    },
  },
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
  .not-data{
    width 100%;
    font-size: 15px;
    font-family: Source Han Sans CN;
    font-weight: 400;
    color: #999999;
    text-align: center;
    margin-top: 240px
    img{
      width 100%;
    }
  }
  .tab {
    width: 100%;
    // height: 36.5px;
    padding: 14px 20px 8px 11.5px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    background-color: #fff;

    .tab_back{
      width: 42px;
    }

    .tab_item_box {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-left: 21px;
    }

    .tab_item {
      font-size: 14px;
      font-weight: 400;
      color: #333333;
      line-height: 20px;
      padding-bottom: 6.5px;
    }

    .current_tab {
      color: #C61606;
      border-bottom: 1px solid #C61606;
    }
  }

  .van-list {
    padding-bottom: 49px;
  }

  .box {
    border-radius: 8px;
    padding: 15px;
    background: white;
    margin: 15px 12px;
    font-size: 14px;

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
      margin-top: 15px;
      display: flex;
      justify-content: start;

      img {
        width: 80px;
        height: 80px;
        object-fit: cover;
        border-radius: 6px;
        margin-right: 15px;
      }

      div {
        width: 250px;
        display: flex;
        flex-direction: column;
        font-size: 14px;

        p:nth-child(1) {
          margin-top: 5px;
          margin-bottom: 10px;
          color: #424242;
        }

        p:nth-child(2) {
          display: flex;
          justify-content: flex-start;
          color: #999999;

          span:nth-child(1) {
            color: #C61606;
          }

          span {
            flex: 1;
          }

          span:nth-child(4) {
            max-width: 5px;
            color: #333333;
            font-size: 14px;
          }
        }

        p:nth-child(3) {
          margin-top: 20px;
          text-align: right;

          span {
            padding: 4px 15px;
            border-radius: 12px;
            font-size: 12px;
            margin: 0 5px;
          }

          span:nth-child(1) {
            border: 1px solid #FF9E4F;
            color: #FF9E4F;
          }

          span:nth-child(2) {
            border: 1px solid #DDDDDD;
            color: #333333;
          }
        }
      }
    }
  }
  /deep/.van-pull-refresh__track{
    min-height: 400px;
  }
}

/deep/ .van-tabs__line {
  background-color: #C61606 !important;
  height: 0.04rem;
}

/deep/ .van-tab--active {
  color: #C61606;
}
</style>
