<template>
  <!-- // created by hjc 本团订单 -->
  <div class="orderList">
    <!-- <van-sticky>
      <navbar :title="'本团订单'"></navbar>

      <div class="tab">
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
    </van-sticky> -->
    <van-sticky>
      <div class="nav">
        <div class="nav_top">
          <div class="back" @click="$router.go(-1)">
            <img :src="require('../activity/images/button_back.png')" alt="" />
          </div>
          <div class="title">本团订单</div>
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
          <div
            class="goods_item"
            v-for="(item, index) in currentTab == 0
              ? deliveryList
              : currentTab == 1
              ? pickUpList
              : currentTab == 2
              ? finishedList
              : currentTab == 3
              ? cancelList
              : allList"
            :key="index"
            @click="navToDetail(item)"
          >
            <div class="goods_title">
              <div class="goods_ID">#{{ item.activityOrderItemNo }}</div>
              <div class="goods_type">
                {{
                    item.activityOrderItemState == 1
                    ? "待发货"
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
                <van-image class="user-image" :src="item.contactAvatar" :error-icon="defaultAvatar"/>
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
import navbar from "@/components/bulk/components/navbar";
import vantImage from "@/components/bulk/components/vantImage.js"
export default {
  name: "orderList",
  props: {},
  components: {
    navbar,
  },
  data() {
    return {
      defaultAvatar: require("@/components/bulk/activity/images/user-default.png"),
      tab: [
        // { name: "全部" },
        // { name: "待支付" },
        { name: "待发货" },
        // { name: "待配送" },
        { name: "待提货" },
        { name: "已完成" },
        { name: "已取消" },
      ],
      allList: [],
      waitPayList: [],
      deliveryList: [],
      distributionList: [],
      pickUpList: [],
      finishedList: [],
      cancelList: [],
      currentTab: 0,
      refreshing: false,
      loading: false,
      finished: false,
      type: 2,
      showPopup: false,
      searchValue: "",
      currentPage: 0,
      totalPage: 0,
      error: false,
      skuInfo: {},
      activityOrderNo: 0,
    };
  },
  created() {
    // Qs.stringify({ gbAcId: 11 })
    this.activityOrderNo = JSON.parse(this.$route.query.id);
  },
  methods: {
    changesTab(index) {
      this.currentTab = index;
      this.currentPage = 0;
      this.allList = [];
      this.waitPayList = [];
      this.deliveryList = [];
      this.distributionList = [];
      this.pickUpList = [];
      this.finishedList = [];
      this.cancelList = [];
      this.finished = false;
      this.loading = true;
      this.onLoad();
    },

    //滚动条与底部距离小于 offset 时触发
    onLoad() {
      this.loading = true;
      let page = this.currentPage;
      page = page + 1;
      this.currentPage = page;
      this.refreshing = false;
      console.log(this.currentTab)
      let obj = {
        pageNum: page,
        pageSize: 10,
        sortBy: "create_time_DESC",
        activityNo: this.activityOrderNo,
        // groupBuyingOrderNo: this.activityOrderNo,
        orderItemState:
            this.currentTab == 0
            ? 1
            : this.currentTab == 1
            ? 3
            : this.currentTab == 2
            ? 4
            : this.currentTab == 3
            ? 5
            : undefined,
      };
      this.$http
        .post(
          "/app/json/group_buying_order/findGroupBuyingActivityOrderItemListByOrderId",
          Qs.stringify(obj)
        )
        .then((res) => {
          // 判断当前页数是否超过总页数或者等于总页数
          if (page < res.data.data.pages || page == res.data.data.pages) {
            if (res.data.result == "success") {
              var indexList = res.data.data.records; //将请求到的内容赋值给一个变量
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
                  this.deliveryList = this.deliveryList.concat(indexList); //将请求的数据追加到后面

                case 1:
                  this.pickUpList = this.pickUpList.concat(indexList);

                case 2:
                  this.finishedList = this.finishedList.concat(indexList);

                case 3:
                  this.cancelList = this.cancelList.concat(
                    indexList
                  );
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
        })
        .catch((err) => {
          this.$toast("请求失败，点击重新加载");
          this.loading = false;
          this.error = true;
          console.log(this.error);
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
        activityNo: this.activityOrderNo,
        // groupBuyingOrderNo: this.activityOrderNo,
        orderItemState:
          this.currentTab == 0
          ? 1
          : this.currentTab == 1
          ? 3
          : this.currentTab == 2
          ? 4
          : this.currentTab == 3
          ? 5
          : undefined,
      };
      this.$http
        .post(
          "/app/json/group_buying_order/findGroupBuyingActivityOrderItemListByOrderId",
          Qs.stringify(obj)
        )
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
                this.deliveryList = indexList; 

              case 1:
                this.pickUpList = indexList;

              case 2:
                this.finishedList = indexList;

              case 3:
                this.cancelList = indexList;
            }

            this.totalPage = res.data.pages; //将总页数赋值上去
            setTimeout(() => {
              this.$toast("刷新成功");
              this.loading = false;
              this.refreshing = false; //刷新成功后将状态关掉
            }, 800); 
          }
        })
        .catch((res) => {
          this.$toast("网络繁忙,请稍后再试~");
        });
    },

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
          console.log(res.data)
          if (res.data.data.isTrue) {
            this.showPopup = false;
            this.$toast("操作成功");
            this.changesTab(this.currentTab);
          }
          if(res.data.result == "error"){
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
  background-color: #F6F6F6 !important;
}

.orderList {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  background-color: #F6F6F6;
  font-family: PingFangSC-Semibold, PingFang SC;
  letter-spacing: 1px;
  background: #F6F6F6;

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
  .user_name{
    margin-left: 20px;
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
      padding: 9.5px 10px 23px 12px;
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
          color: #C82010;
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
    height: 147px;
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
        background: #C61606;
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

}
/deep/.user-image img{
    width: 22px;
    height: 22px;
    margin: 2px 0px 0 12px;
    border-radius: 50%;
  }
  /deep/.van-image__error{
    background-color: transparent;
  }
  /deep/.user-image .van-icon{
    font: initial;
  }
</style>
