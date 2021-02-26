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
        <van-icon
          name="arrow-left"
          class="arrow_left"
          color="#000000"
          size="0.471467rem"
          @click="$router.push('/common')"
        />
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

    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
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
          v-for="(item, index) in currentTab == 0
            ? allList
            : currentTab == 1
            ? goingList
            : currentTab == 2
            ? notList
            : currentTab == 3
            ? finishList
            : allList"
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
                }}</span
                ><span>已团{{ item.orderCount }}单</span
                ><span>共{{ item.productCount }}件商品</span>
                <span><van-icon name="arrow" /></span>
              </p>
              <p>
                <span @click.stop="share(item)">分享</span>
                <span @click.stop="navToDetail(item.id)"
                  >本团订单</span
                >
              </p>
            </div>
          </div>
        </div>
      </van-list>
    </van-pull-refresh>

    <van-share-sheet
      class="copyData"
      v-model="showShare"
      title="分享到"
      :options="options"
      cancel-text=""
      @select="onShare"
    />
    <!-- </nav-content> -->
  </div>
</template>

<script>
import Qs from "qs";
export default {
  name: "activity",
  // mixins: [api],
  data() {
    return {
      state: 1,
      showShare: false,
      options: [
        { name: "微信", icon: "wechat" },
        { name: "复制链接", icon: "link" },
      ],
      copybtn: "",
      tabTitle: [
        { title: "全部" },
        { title: "进行中" },
        { title: "未开始" },
        { title: "已结束" },
      ],
      currentTab: 0,
      allList: [],
      goingList: [],
      notList: [],
      finishList: [],
      loading: false, //是否处于加载状态，加载过程中不触发load事件
      finished: false, //是否已加载完成，加载完成后不再触发load事件
      refreshing: false, //是否处于加载中状态
      error: false,
      currentPage: 0,
      totalPage: 0,
      userData: {},
      shareItemData: {},
    };
  },
  created() {
    // this.onLoad();
    this.allList = [];
    this.$http
      .get(
        "/app/json/group_buying_head_info/findSelfInfo"
      )
      .then((res) => {
        if (res.data.result == "success") {
          this.userData = res.data.data;
        }
      });
  },
  methods: {
    changesTab(index) {
      this.currentTab = index;
      this.currentPage = 0;
      this.allList = [];
      this.goingList = [];
      this.notList = [];
      this.finishList = [];
      this.finished = false;
      this.loading = true;
      this.onLoad();
    },

    //滚动条与底部距离小于 offset 时触发
    onLoad() {
      let page = this.currentPage;
      page = page + 1;
      this.currentPage = page;
      this.refreshing = false;

      let obj = {
        pageNum: page,
        pageSize: 10,
        // sortBy: "create_time_DESC",
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
        .post(
          "/app/json/groupbuying_activity_app/list",
          Qs.stringify(obj)
        )
        .then((res) => {
          // 判断当前页数是否超过总页数或者等于总页数
          if (page < res.data.totalPages || page == res.data.totalPages) {
            if (res.data.data.pages == page) {
              this.finished = true;
            }
            if (res.data.result == "success") {
              var indexList = res.data.data; //将请求到的内容赋值给一个变量

              switch (this.currentTab) {
                case 0:
                  this.allList = this.allList.concat(indexList); //将请求的数据追加到后面
                  console.log(this.allList);
                case 1:
                  this.goingList = this.goingList.concat(indexList);
                case 2:
                  this.notList = this.notList.concat(indexList);
                case 3:
                  this.finishList = this.finishList.concat(indexList);
              }
              this.page = res.data.data.pages; //将总页数赋值给this
              setTimeout(() => {
                // 加载状态结束
                this.loading = false;
              }, 1000);
            } else {
              this.loading = false; //将加载状态关掉
              this.error = true; //大家错误状态
            }
          } else {
            this.finished = true; //如果超过总页数就显示没有更多内容了
          }
        });
      // .catch((err) => {
      //   this.$toast("请求失败，点击重新加载");
      // });
    },
    // 下拉刷新时触发
    onRefresh() {
      let page = 1; //从第一页开始
      this.page = page; //将当前页数赋值给this
      this.finished = false; //将没有更多的状态改成false
      this.isLoading = true; //将下拉刷新状态改为true开始刷新
      let obj = {
        pageNum: page,
        pageSize: 10,
        // sortBy: "create_time_DESC",
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
        .post(
          "/app/json/group_buying_order/findGroupBuyingActivityOrderByList",
          Qs.stringify(obj)
        )
        .then((res) => {
          if (res.status == 200) {
            switch (this.currentTab) {
              case 0:
                this.allList = res.data.data;
              case 1:
                this.goingList = res.data.data;
              case 2:
                this.notList = res.data.data;
              case 3:
                this.finishList = res.data.data;
              default:
                this.allList = res.data.data;
            }
            this.totalPage = res.data.totalPages; //将总页数赋值上去
            setTimeout(() => {
              this.$toast("刷新成功");
              this.loading = false;
              this.refreshing = false; //刷新成功后将状态关掉
            }, 1000); //1秒后关闭
          }
        })
        .catch((res) => {
          this.$toast("网络繁忙,请稍后再试~");
        });
    },
    share(item) {
      this.shareItemData = item;
      this.showShare = true;
      console.log(this.shareItemData);
    },
    onShare: function (option) {
      if (option.icon == "wechat") {
        if (this.$store.state.webtype == 3) {
          //判断小程序
          this.$http
            .get(
              "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wxc76cd2c3987620af&secret=d736b766f1b77c5def2f179a53f2577b"
            )
            .then((res) => {
              console.log(res);
            });
        } else if (
          this.$store.state.webtype == 0 ||
          this.$store.state.webtype == 1
        ) {
          // window.shareForOpenWXMiniProgram = () => {
          //   share
          //     .shareForOpenWXMiniProgram({
          //       userName: "wxc76cd2c3987620af",
          //       path: "/bulk_share",
          //       title: "微信分享商品",
          //       desc: "test",
          //       link: "http://www.baidu.com",
          //       imageurl:
          //         "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fblog%2F202011%2F11%2F20201111212304_5706f.thumb.400_0.jpg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1615221459&t=c602d8447792fa22cbcb25a38b16031b",
          //       miniProgramType: 2,
          //       __event__: (res) => {
          //         // document.getElementById(
          //         //   "debug_text"
          //         // ).innerText = JSON.stringify(res);
          //         alert("shareRes----------", JSON.stringify(res));
          //       },
          //     })
          //     .then((res) => {
          //       // document.getElementById("debug_text").innerText = res;
          //       alert("shareThenRes----------", res);
          //     });
          // };
          this.$router.push({
            path: "/bulk_share",
            query: {
              purchaseId: JSON.stringify(this.shareItemData.id),
              chiefId: JSON.stringify(this.userData.teamLeaderNo),
              userId: JSON.stringify(this.userData.userNo),
              activityName:JSON.stringify(this.shareItemData.groupbuyActivityName)
            },
          });
        }
      } else if (option.icon == "link") {
      }
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

  .tab {
    width: 100%;
    height: 36.5px;
    padding: 8px 20px 8px 11.5px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    background-color: #fff;

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
}

/deep/ .van-tabs__line {
  background-color: #C61606 !important;
  height: 0.04rem;
}

/deep/ .van-tab--active {
  color: #C61606;
}
</style>
