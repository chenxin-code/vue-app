<template>
  <!-- // created by hjc 订单列表 -->
  <div class="orderList">
    <!-- <van-sticky>
      <div class="heard">
        <div class="tab">
          <div class="tab_back" @click="goBack()">
            <van-icon
              name="arrow-left"
              class="arrow_left"
              color="#000000"
              size="0.471467rem"
            />
          </div>
          <div
            class="tab_item"
            v-for="(item, index) in tab"
            :key="index"
            @click="changesTab(index)"
            :class="currentTab == index ? 'current_tab' : ''"
          >
            {{ item.name }}
          </div>
        </div>
      </div>
    </van-sticky> -->
    <van-sticky>
      <div class="nav">
        <div class="nav_top">
          <div class="back" @click="$router.go(-1)">
            <img :src="require('../activity/images/button_back.png')" alt="" />
          </div>
          <div class="title">订单</div>
          <div class="no"></div>
        </div>
        <div class="nav_tabs">
          <div
            class="tab_item"
            v-for="(item, index) in tab"
            :key="index"
            @click="changesTab(index)"
            :class="currentTab == index ? 'current_tab' : ''"
          >
            {{ item.name }}
          </div>
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
          <!-- :immediate-check="false" -->
          <div
            class="goods_item"
            v-for="(item, index) in allList"
            :key="index"
            @click="navToDetail(item)"
          >
            <div class="goods_title">
              <div class="goods_ID">#{{ item.activityOrderItemNo }}</div>
              <div class="goods_type">
                {{
                  item.activityOrderItemState == 0
                    ? "待支付"
                    : item.activityOrderItemState == 1
                    ? "待发货"
                    : item.activityOrderItemState == 2
                    ? "待配送"
                    : item.activityOrderItemState == 3
                    ? "待提货"
                    : item.activityOrderItemState == 4
                    ? "已完成"
                    : item.activityOrderItemState == 5
                    ? "已取消"
                    : ""
                }}
              </div>
            </div>
            <div class="good_user">
              <div class="user">
                <van-image
                  class="user-image"
                  :src="item.contactAvatar"
                  :error-icon="defaultAvatar"
                />
                <div class="user_name">{{ item.contactName }}</div>
                <div class="user_phone">{{ item.contactPhone }}</div>
              </div>
              <div
                :class="
                  item.activityOrderItemState == 2
                    ? 'delivery'
                    : item.activityOrderItemState == 3
                    ? 'pick_up'
                    : ''
                "
                class="user_type"
                v-show="
                  item.activityOrderItemState == 2 ||
                  item.activityOrderItemState == 3
                "
              >
                {{
                  item.activityOrderItemState == 2
                    ? "配送上门"
                    : item.activityOrderItemState == 3
                    ? "自提"
                    : ""
                }}
              </div>
            </div>
            <div class="goods_img">
              <img
                :src="element"
                alt=""
                v-for="element in item.orderSkuImg"
                :key="element"
              />
            </div>
            <div class="goods_detail">
              <div class="detail">
                <span>共计{{ item.productQuantity }}件商品，合计支付 </span>
                <span>{{ item.totalAmount }}</span>
              </div>
              <div
                class="confirm"
                v-show="
                  item.activityOrderItemState !== 0 &&
                  item.activityOrderItemState !== 4 &&
                  item.activityOrderItemState !== 5
                "
                @click.stop="confirm(item)"
              >
                确认{{
                  item.activityOrderItemState == 1
                    ? "送达"
                    : item.activityOrderItemState == 2
                    ? "配送"
                    : item.activityOrderItemState == 3
                    ? "提货"
                    : ""
                }}
              </div>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>

    <van-popup v-model="showPopup">
      <div class="popup">
        <div class="popup_title">确认订单商品</div>
        <div class="popup_detail">
          {{
            skuInfo.activityOrderItemState == 1
              ? "抵达"
              : skuInfo.activityOrderItemState == 2
              ? "送达消费者"
              : skuInfo.activityOrderItemState == 3
              ? "被消费者提走"
              : ""
          }}
        </div>
        <div class="popup_btn">
          <div class="confirm_btn" @click="confirmOrder()">确认</div>
          <div class="cancel_btn" @click="showPopup = false">取消</div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import Qs from "qs";
import vantImage from "@/components/bulk/components/vantImage.js";
export default {
  name: "orderList",
  props: {},
  data() {
    return {
      defaultAvatar: require("@/components/bulk/activity/images/user-default.png"),
      tab: [
        { name: "待发货", value: 1 },
        { name: "待提货", value: 3 },
        { name: "已完成", value: 4 },
        { name: "已取消", value: 5 },
      ],
      allList: [],
      currentTab: 0,
      refreshing: false,
      loading: false,
      finished: false,
      showPopup: false,
      currentPage: 1,
      error: false,
      skuInfo: {},
    };
  },
  created() {
    this.loading = true;
    this.onLoad();
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    /*订单状态tab切换*/
    changesTab(index) {
      this.currentTab = index;
      this.currentPage = 1;
      this.allList = [];
      this.onLoad();
    },
    //滚动条与底部距离小于 offset 时触发
    onLoad() {
      this.loading = true;
      this.error = false;
      this.finished = false;
      let { currentPage, finished, tab, currentTab } = this;
      let obj = {
        pageNum: currentPage,
        pageSize: 10,
        sortBy: "create_time_DESC",
        orderItemState: tab[currentTab].value ? tab[currentTab].value : "",
      };
      if (!finished) {
        this.getListFn(obj);
      }
    },
    // 下拉刷新时触发
    onRefresh() {
      this.currentPage = 1; //从第一页开始
      this.finished = false; //将没有更多的状态改成false
      this.refreshing = true;
      this.loading = true; //将下拉刷新状态改为true开始刷新
      let { tab, currentTab } = this;
      let obj = {
        pageNum: this.currentPage,
        pageSize: 10,
        sortBy: "create_time_DESC",
        orderItemState: tab[currentTab] ? tab[currentTab].value : "",
      };
      this.getListFn(obj);
    },
    /*订单列表数据*/
    getListFn(obj) {
      let { currentPage } = this;
      this.$http
        .post(
          "/app/json/group_buying_order/findGroupBuyingActivityOrderItemListByOrderId",
          Qs.stringify(obj)
        )
        .then((res) => {
          this.loading = false; //将加载状态关掉
          this.refreshing = false;
          if (res.data.result == "success") {
            let { data } = res.data;
            if (currentPage < data.pages || currentPage == data.pages) {
              // 判断当前页数是否超过总页数或者等于总页数
              var indexList = data.records; //将请求到的内容赋值给一个变量
              indexList.map((e) => {
                if (e.productSkuInfo !== "") {
                  let productSkuInfo = JSON.parse(e.productSkuInfo)[0];
                  e.orderSkuImg = productSkuInfo.groupbuySkuPicurl.split(",");
                } else {
                  e.orderSkuImg = [];
                }
              });
              this.allList = this.allList.concat(indexList);
              this.currentPage++;
              if (currentPage == data.pages) {
                this.finished = true;
              }
            } else {
              this.finished = true; //如果超过总页数就显示没有更多内容了
            }
          } else {
            this.refreshing = false;
            this.error = true; //加载错误状态
          }
        })
        .catch((err) => {
          this.$toast("请求失败，点击重新加载");
          this.refreshing = false;
          this.loading = false;
          this.error = true;
        });
    },
    /*去详情页*/
    navToDetail(item) {
      this.$router.push({
        path: "/bulk_order_detail",
        query: {
          id: JSON.stringify(item.activityOrderItemNo),
        },
      });
    },
    confirm(item) {
      this.showPopup = true;
      this.skuInfo = item;
    },
    /*订单配送状态*/
    confirmOrder() {
      let confirmType = 0;
      if (
        this.skuInfo.activityOrderItemState == 1 ||
        this.skuInfo.activityOrderItemState == 2 ||
        this.skuInfo.activityOrderItemState == 3
      ) {
        confirmType = this.skuInfo.activityOrderItemState;
      } else {
        confirmType = undefined;
      }
      this.$http
        .post("/app/json/group_buying_order/confirmReceiveDeliveryPickup", {
          orderItemId: this.skuInfo.activityOrderItemNo,
          confirmType,
        })
        .then((res) => {
          if (res.data.data.isTrue) {
            this.showPopup = false;
            this.$toast("操作成功");
            this.changesTab(this.currentTab);
          }
          if (res.data.result == "error") {
            this.showPopup = false;
            this.$toast(res.data.info);
          }
        })
        .catch((err) => {
          this.showPopup = false;
          this.$toast("请求失败，请重新尝试");
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

.orderList {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  background-color: #F6F6F6;
  font-family: PingFangSC-Semibold, PingFang SC;
  letter-spacing: 1px;
  background: #F6F6F6;
  padding-bottom: 49px;

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
        width: 59px;
        height: 22px;
        background: #fff;
        border-radius: 10px;
        text-align: center;
        line-height: 22px;
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: 400;
        color: #666666;
      }

      .current_tab {
        background: #E9306D;
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: 400;
        color: #FFFFFF;
      }
    }
  }

  .heard {
    background: #fff;
    padding-top: 10px;
  }

  .tab {
    width: 100%;
    height: 45px;
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
      width: 100%;
      background: #FFFFFF;
      box-shadow: 0px 1px 11px 3px rgba(231, 230, 230, 0.5);
      border-radius: 10px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      padding: 12px 10px 14px 12px;
      margin-bottom: 10px;

      .goods_title {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .goods_ID {
          font-size: 16px;
          font-weight: 600;
          color: #333333;
          line-height: 22.5px;
        }

        .goods_type {
          font-size: 14px;
          font-weight: 600;
          color: #e9306d;
          line-height: 20px;
        }
      }

      .good_user {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 4px;

        .user {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          font-size: 12px;
          font-weight: 400;
          color: #333330;
          line-height: 16.5px;

          img {
            width: 24px;
            height: 24px;
            margin-right: 8px;
            border-radius: 50%;
            overflow: hidden;
          }

          div:last-child {
            margin-left: 18.5px;
          }
        }

        .user_type {
          border-radius: 2px;
          border: 1px solid #FF9E4F;
          padding: 0 4px;
          border-radius: 2px;
          font-size: 12px;
          font-weight: 400;
          line-height: 16.5px;
        }

        .pick_up {
          border: 1px solid #FF9E4F;
          color: #FF9E4F;
        }

        .delivery {
          border: 1px solid #4F87FF;
          color: #4F87FF;
        }
      }

      .goods_img {
        width: 100%;
        display: flex;
        overflow-x: auto;
        margin-top: 11px;

        img {
          width: 45px;
          height: 45px;
          object-fit: cover;
          margin-right: 10px;
          border-radius: 6px;
        }
      }

      .goods_detail {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 25px;

        .detail {
          display: flex;
          justify-content: space-between;
          align-items: center;

          span {
            font-size: 12px;
            font-weight: 400;
            color: #333330;
            line-height: 16.5px;
          }

          span:last-child {
            font-size: 14px;
          }
        }

        .confirm {
          display: flex;
          justify-content: center;
          align-items: center;
          text-align: center;
          width: 94px;
          height: 35px;
          border: 1px solid #FF7BA6;
          // border-image: linear-gradient(0deg, #FF7BA6, #E9306D) 10 10;
          border-radius: 18px;
          font-size: 14px;
          font-family: PingFang SC;
          font-weight: 400;
          color: #E9306D;
        }
      }
    }
  }

  .van-popup--center {
    border-radius: 15px;
  }

  .popup {
    width: 260px;
    background: #FFFFFF;
    border-radius: 15px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    padding: 20px 0 15px;

    .popup_title {
      font-size: 16px;
      font-family: SourceHanSansCN-Normal, SourceHanSansCN;
      font-weight: 400;
      color: #000000;
      line-height: 30px;
    }

    .popup_detail {
      font-size: 16px;
      font-family: SourceHanSansCN-Normal, SourceHanSansCN;
      font-weight: 400;
      color: #000000;
      line-height: 30px;
    }

    .popup_btn {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 18px;

      .confirm_btn {
        width: 80px;
        height: 28px;
        background: #e9306d;
        border-radius: 15px;
        text-align: center;
        line-height: 28px;
        font-size: 13px;
        font-weight: 400;
        color: #FFFFFF;
        margin-right: 10px;
      }

      .cancel_btn {
        width: 80px;
        height: 28px;
        border-radius: 15px;
        border: 1px solid #999999;
        font-size: 13pxpx;
        font-weight: 400;
        color: #333333;
        line-height: 28px;
        text-align: center;
      }
    }
  }

  .user-image {
    width: 24px;
    margin-left: 2px;
  }

  /deep/.user-image img {
    width: 22px;
    height: 22px;
    margin: 2px 2px 0 -4px;
    border-radius: 50%;
  }

  /deep/.van-image__error {
    background-color: transparent;
  }

  /deep/.user-image .van-icon {
    font: initial;
  }
}
</style>
