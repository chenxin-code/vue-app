<template>
  <!-- // created by hjc 售后单列表 -->
  <div class="afterSales">
    <van-sticky>
      <van-search v-model="value" shape="round" background="#fff" />
      <div class="tab">
        <div
          class="tab_item"
          v-for="(item, index) in tabTitle"
          :key="index"
          @click="currentTab = index"
          :class="currentTab == index ? 'current_tab' : ''"
        >
          {{ item.name }}
        </div>
      </div>
    </van-sticky>
    <div class="goods_list">
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
            class="goods_item"
            v-for="item in 0"
            :key="item"
            @click="$router.push('/bulk_after_sales_detail')"
          >
            <div class="goods_id">
              <div>#01</div>
              <div>待审核</div>
            </div>
            <div class="goods_user">
              <img
                src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fblog%2F202011%2F11%2F20201111212304_5706f.thumb.400_0.jpg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1615221459&t=c602d8447792fa22cbcb25a38b16031b"
                alt=""
              />
              <div class="user_name">张三</div>
              <div class="user_phone">13510101010</div>
            </div>
            <div class="goods_img">
              <img
                src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fblog%2F202011%2F11%2F20201111212304_5706f.thumb.400_0.jpg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1615221459&t=c602d8447792fa22cbcb25a38b16031b"
                alt=""
                v-for="item in 10"
                :key="item"
              />
            </div>
            <div class="goods_detail">
              <div>共计5件商品，合计支付</div>
              <div>1000.00</div>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
import Qs from "qs";
export default {
  name: "afterSales",
  props: {},
  data() {
    return {
      tabTitle: [
        { name: "全部" },
        { name: "待审核" },
        { name: "已完成" },
        { name: "已关闭" },
      ],
      value: "",
      currentTab: 0,
      list: [],
      refreshing: false,
      loading: false,
      finished: false,
      currentPage: 0,
      totalPage: 0,
      error: false,
      allList: [],
      auditList: [],
      finishedList: [],
      closedList: [],
    };
  },
  created() {
    this.onLoad();
    // this.$http.post('/app/json/group_buying_head_info/findSelfInfo')
  },
  methods: {
    //滚动条与底部距离小于 offset 时触发
    onLoad() {
      this.loading = true;
      let page = this.currentPage;
      page = page + 1;
      this.currentPage = page;
      this.refreshing = false;
      let obj = {
        pageNum: page,
        pageSize: 10,
        // orderItemState:
        //   this.currentTab == 0
        //     ? undefined
        //     : this.currentTab == 1
        //     ? 0
        //     : this.currentTab == 2
        //     ? 1
        //     : this.currentTab == 3
        //     ? 2
        //     : this.currentTab == 4
        //     ? 3
        //     : this.currentTab == 5
        //     ? 4
        //     : undefined,
        token: this.$store.state.login.token,
      };
      this.$http
        .post("http://192.168.31.9:18807/app/json/app_group_buying_after_sale/queryAfterOrder", Qs.stringify(obj))
        .then((res) => {
          // 判断当前页数是否超过总页数或者等于总页数
          // if (page < res.data.data.pages || page == res.data.data.pages) {
            if (res.data.result == "success") {
              var indexList = res.data.data; //将请求到的内容赋值给一个变量
              // indexList.forEach((e) => {
              //   if (e.productSkuInfo !== "") {
              //     e["orderSkuImg"] = JSON.parse(
              //       e.productSkuInfo
              //     )[0].groupbuySkuPicurl.split(",");
              //   } else {
              //     e["orderSkuImg"] = [];
              //   }
              // });

              switch (this.currentTab) {
                case 0:
                  this.allList = this.allList.concat(indexList); //将请求的数据追加到后面

                case 1:
                  this.waitPayList = this.waitPayList.concat(indexList);

                case 2:
                  this.deliveryList = this.deliveryList.concat(indexList);

                case 3:
                  this.distributionList = this.distributionList.concat(
                    indexList
                  );
                case 4:
                  this.pickUpList = this.pickUpList.concat(indexList);

                case 5:
                  this.finishedList = this.finishedList.concat(indexList);
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
          // } else {
          //   this.finished = true; //如果超过总页数就显示没有更多内容了
          // }
        })
        .catch((err) => {
          this.$toast("请求失败，点击重新加载");
          this.loading = false;
          this.error = true;
          console.log(err);
        });
    },
    // 下拉刷新时触发
    onRefresh() {
      let page = 1; //从第一页开始
      this.page = page; //将当前页数赋值给this
      this.finished = false; //将没有更多的状态改成false
      this.loading = true; //将下拉刷新状态改为true开始刷新
      let obj = {
        pageNum: page,
        pageSize: 10,
        sortBy: "create_time_DESC",
        orderItemState:
          this.currentTab == 0
            ? undefined
            : this.currentTab == 1
            ? 0
            : this.currentTab == 2
            ? 1
            : this.currentTab == 3
            ? 2
            : this.currentTab == 4
            ? 3
            : this.currentTab == 5
            ? 4
            : undefined,
      };
      this.$http
        .post("app_group_buying_after_sale/queryAfterOrder", Qs.stringify(obj))
        .then((res) => {
          if (res.status == 200) {
            let indexList = res.data.data.records;
            indexList.forEach((e) => {
              if (e.productSkuInfo !== "") {
                e["orderSkuImg"] = JSON.parse(
                  e.productSkuInfo
                )[0].groupbuySkuPicurl.split(",");
              } else {
                e["orderSkuImg"] = [];
              }
            });
            switch (this.currentTab) {
              case 0:
                this.allList = indexList; //将请求的数据追加到后面
              case 1:
                this.waitPayList = indexList;
              case 2:
                this.deliveryList = indexList;
              case 3:
                this.distributionList = indexList;
              case 4:
                this.pickUpList = indexList;
              case 5:
                this.finishedList = indexList;
            }

            this.totalPage = res.data.pages; //将总页数赋值上去
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
  },
};
</script>

<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';
@import '~@/common/stylus/mixin.styl';

.router_class {
  background-color: #F6F6F6;
}

.afterSales {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  font-family: PingFangSC-Semibold, PingFang SC;
  letter-spacing: 1px;
  background-color: #F6F6F6;

  .tab {
    width: 100%;
    height: 36.5px;
    padding: 8px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;

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

  .goods_list {
    padding: 10px 10px 0;
    background: #F6F6F6;

    .goods_item {
      background: #FFFFFF;
      box-shadow: 0px 1px 11px 3px rgba(231, 230, 230, 0.5);
      border-radius: 10px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      padding: 10px;
      margin-bottom: 10px;

      .goods_id {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 16px;
        font-weight: 600;
        color: #333333;
        line-height: 22.5px;

        div:last-child {
          font-size: 14px;
          font-weight: 600;
          color: #C82010;
          line-height: 20px;
        }
      }

      .goods_user {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        font-size: 12px;
        font-weight: 400;
        color: #333330;
        line-height: 16.5px;
        margin: 4px 0 11px;

        img {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          overflow: hidden;
          margin-right: 8px;
        }

        div:last-child {
          margin-left: 18.5px;
        }
      }

      .goods_img {
        width: 100%;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        overflow-x: auto;
        margin-bottom: 10px;

        img {
          width: 45px;
          height: 45px;
          margin-right: 10px;
        }
      }

      .goods_detail {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        font-size: 12px;
        font-weight: 400;
        color: #333330;
        line-height: 16.5px;

        div:last-child {
          font-weight: 600;
        }
      }
    }
  }
}
</style>

