<template>
  <div class="bulk-share-main">
    <div class="scrollBox">
      <div class="bulk-header">
        <div class="headbox">
          <!-- <img src="./images/icon_time_default@2x.png" class="block-time" /> -->
          <div class="bulk-back" @click="backHome">
            <div class="back-img"></div>
            <div class="back-word">返回</div>
          </div>
          <div class="orderSwiper">
            <van-swipe
              style="height: 0.74667rem"
              vertical
              autoplay="2500"
              :show-indicators="false"
              :touchable="false"
            >
              <van-swipe-item
                v-for="(item, index) in orderSwiperList"
                :key="index"
              >
                <div :class="item.show ? 'swipeItem' : 'nullSwipeItem'">
                  <img
                    :src="item.buyerAvtUrl ? item.buyerAvtUrl : defaultAvt"
                    v-if="item.show"
                    alt=""
                  />
                  <div class="buyerText" v-if="item.show">
                    {{ item.swipeBuyerName }} {{ item.timeOut }}参与了团购
                  </div>
                </div>
              </van-swipe-item>
            </van-swipe>
          </div>
        </div>
        <div class="time-block">
          <img src="./images/icon_time_default@2x.png" class="block-time" />
          <div style="margin-left: 7px">拼团结束时间</div>

          <van-count-down :time="shareData.remainingTime * 1000">
            <template #default="timeData">
              <div style="display: flex; align-items: center">
                <div class="time-bg-block">{{ timeData.days }}天</div>

                <span style="color: #c0003f">:</span>
                <div class="time-bg-block">{{ timeData.hours }}</div>
                <span style="color: #c0003f">:</span>
                <div class="time-bg-block">{{ timeData.minutes }}</div>
                <span style="color: #c0003f">:</span>
                <div class="time-bg-block">{{ timeData.seconds }}</div>
              </div>
            </template>
          </van-count-down>
        </div>

        <div class="user-card">
          <div class="user-message">
            <img
              :src="
                shareData.headAvtUrl ? shareData.headAvtUrl : defaultHeadAvt
              "
              :error-icon="defaultHeadAvt"
              class="user-pic"
            />
            <!-- <img
            :src="shareData.headAvtUrl ? shareData.headAvtUrl : ''"
            :error-icon="defaultAvatar"
            class="user-pic"
          /> -->

            <div class="user-message-right">
              <div class="user-message-top">
                团长名称：{{ shareData.headUser }}
                <img
                  :src="
                    groupStatus == 'finish'
                      ? require('@/components/bulk/share/images/img_tips_over@2x.png')
                      : groupStatus == 'notAtThe'
                      ? require('@/components/bulk/share/images/img_tips_ready@2x.png')
                      : require('@/components/bulk/share/images/img_tips_default@2x.png')
                  "
                  class="group-status"
                />
              </div>
              <div class="user-message-bottom">
                <span style="color: #999999">提货地址：</span>
                <span style="color: #121212"
                  >{{ shareData.communityName }}{{ shareData.place }}</span
                >
              </div>
            </div>
          </div>
        </div>

        <div class="group-desc">
          <div class="group-desc-content">
            <img src="./images/icon_01@2x.png" class="group-desc-content-pic" />
            <div class="group-desc-content-right">
              <div class="group-desc-content-right-top">团购活动描述:</div>
              <div class="group-desc-content-right-bottom" v-html="str"></div>
            </div>
          </div>

          <div class="divLine"></div>

          <div class="group-desc-content">
            <img src="./images/icon_02@2x.png" class="group-desc-content-pic" />
            <div class="group-desc-content-right">
              <div class="group-desc-content-right-top">团购规则描述:</div>
              <div class="group-desc-content-right-bottom">
                {{ shareData.ruleDescription }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-for="(item, index) in goodsList" :key="index">
        <div class="product-card" @click.stop="navToDetail(item)">
          <div class="product-message">
            <img class="product-pic" :src="item.skuImg[0]" />
            <div class="product-desc">
              <div style="display: flex; flex-direction: column">
                <div class="product-title">{{ item.skuName }}</div>
                <div class="product-prize-old">
                  销售价格：￥{{ item.crossedPrice }}
                </div>
                <div class="product-prize-group">
                  团购价格：￥{{ item.groupPrice }}
                </div>
              </div>

              <div class="change-product-num" @click.stop>
                <van-stepper
                  v-model="item.count"
                  min="0"
                  integer
                  theme="round"
                  :max="item.remainingItem"
                  @change="goodsChange(item)"
                />
                <!-- <img
                src="./images/button_add_default@2x.png"
                alt=""
                class="change-num-pic"
              />
              <span class="product-num">100</span>
              <img
                src="./images/button_del_default@2x.png"
                alt=""
                class="change-num-pic"
              /> -->
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="user-group-team">
        <div class="gruop-title">
          <div class="group-header-one">这些团友都买了</div>
          <div class="group-header-second">
            （共{{ otherBuyList.length }}人参加了本次团购）
          </div>
        </div>

        <div class="group-people">
          <div v-for="(item, index) in otherBuyList" :key="index">
            <div class="group-people-item">
              <img
                class="group-people-pic"
                :src="item.buyerAvtUrl ? item.buyerAvtUrl : defaultAvt"
              />
              <div class="group-people-message">
                <div class="people-item-phone">{{ item.buyerName }}</div>
                <div class="people-item-time">{{ item.buyTime }}</div>
                <div
                  class="people-item-desc"
                  v-for="(targetItem, indexTarget) in item.orderItemList"
                  :key="indexTarget"
                >
                  <span>{{ targetItem.groupbuySkuName }}</span>
                  <span>X{{ targetItem.buyNumber }}</span>
                </div>
              </div>
            </div>
            <div
              class="divLine"
              style="width: 8rem"
              v-show="index !== otherBuyList.length - 1"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <div class="bottom-button">
      <div style="display: flex">
        <img src="./images/button_shop_default@2x.png" class="car-shop" />
        <!-- <div class="circle-radius"><span class="scale-font">999</span></div> -->
        <div class="bottom-button-prize">¥{{ totalPrice }}</div>
      </div>

      <div class="order-button" @click="confirmOrder">去结算</div>
    </div>
  </div>
</template>

<script>
import Qs from "qs";
import { mapMutations } from "vuex";
import vantImage from "@/components/bulk/components/vantImage.js";
import { Toast } from "vant";
import { BigNumber } from "bignumber.js";

export default {
  name: "share",
  props: {},
  data() {
    return {
      defaultAvatar: require("@/components/bulk/activity/images/user-default.png"),
      isShowNavigation: false,
      isShowOther: false,
      isShowCar: false,
      isCheckAll: true,
      result: [],
      checkList: [],
      shareData: {},
      goodsList: [],
      otherBuyList: [],
      totalPrice: 0,
      categoryMap: [{ key: "all", value: "全部" }],
      currentSelectCategory: 0,
      descData: "",
      imgUrls: [],
      str: "",
      purchaseId: "",
      chiefId: "",
      userId: "",
      groupStatus: "start",
      orderSwiperList: [],
      defaultAvt: require("./images/user_01@2x.png"),
      defaultHeadAvt: require("./images/img_user_01@2x.png"),
    };
  },
  created() {
    // this.purchaseId = JSON.parse(this.$route.query.purchaseId);
    // this.chiefId = JSON.parse(this.$route.query.chiefId);
    // this.userId = JSON.parse(this.$route.query.userId);

    this.purchaseId = 61;
    this.chiefId = "4";
    this.userId = "2337237484980666802";

    this.totalPrice = this.$util.toDecimal2(this.totalPrice);
    this.checkList.forEach((e) => {
      this.result.push(e.id);
    });
    this.initData();
  },

  methods: {
    getTimestamp(time) {
      //把时间日期转成时间戳
      return Date.parse(time.replace(/-/gi, "/"));
    },

    getDateDiff(dateTimeStamp) {
      var minute = 1000 * 60;
      var hour = minute * 60;
      var day = hour * 24;
      var halfamonth = day * 15;
      var month = day * 30;
      var now = new Date().getTime();
      var diffValue = now - dateTimeStamp;
      if (diffValue < 0) {
        return;
      }
      var monthC = diffValue / month;
      var weekC = diffValue / (7 * day);
      var dayC = diffValue / day;
      var hourC = diffValue / hour;
      var minC = diffValue / minute;
      var result = "";
      if (monthC >= 1) {
        result = "" + parseInt(monthC) + "月前";
      } else if (weekC >= 1) {
        result = "" + parseInt(weekC) + "周前";
      } else if (dayC >= 1) {
        result = "" + parseInt(dayC) + "天前";
      } else if (hourC >= 1) {
        result = "" + parseInt(hourC) + "小时前";
      } else if (minC >= 1) {
        result = "" + parseInt(minC) + "分钟前";
      } else result = "刚刚";
      return result;
    },

    initData() {
      this.$http
        .post("/app/json/app_group_buying_share_home/queryShareHomePageInfo", {
          purchaseId: this.purchaseId,
          chiefId: this.chiefId,
          userId: this.userId,
          status: "1,2,3,4,5",
        })
        .then((res) => {
          console.log("分享页面信息~~~~~~~", res);
          if (res.data.result == "success") {
            this.shareData = res.data.data;
            this.goodsList = this.shareData.groupbuySkuInfoList;
            this.goodsList.forEach((item) => {
              item["count"] = 0;
              item["isCheck"] = true;
              item["skuImg"] = item.skuPicUrl.split(",");
            });
            if (this.shareData.currentActOrderList) {
              this.otherBuyList = this.shareData.currentActOrderList;
              this.otherBuyList.forEach((e) => {
                e["isShowOther"] = false;
                if (e.orderItemList.length > 1) {
                  e["otherOrderItemList"] = e.orderItemList.slice(1);
                }
                e["timeOut"] = this.getDateDiff(this.getTimestamp(e.buyTime));
                e["show"] = true;
                if (e["buyerName"].length > 6) {
                  e["swipeBuyerName"] =
                    e["buyerName"][0] +
                    e["buyerName"][1] +
                    "**" +
                    e["buyerName"][e["buyerName"].length - 2] +
                    e["buyerName"][e["buyerName"].length - 1];
                  // e["swipeBuyerName"] = "刚刚好六个字";
                } else {
                  e["swipeBuyerName"] = e["buyerName"];
                }
                this.orderSwiperList.push(e);
                this.orderSwiperList.push({ show: false });
              });
              console.log("orderSwiperList", this.orderSwiperList);
            }
            for (let i in this.shareData.categoryMap) {
              this.categoryMap.push({
                key: i,
                value: this.shareData.categoryMap[i],
              });
            }
            this.descData = this.shareData.groupDescriptionRichTxt;

            this.str = this.descData.replace(/<img.*?>/g, "");

            let imgStrs =
              this.shareData.groupDescriptionRichTxt.match(/<img.*?>/g);

            // 获取每个img url
            if (imgStrs) {
              this.imgUrls = imgStrs.map((url) => {
                return url.match(/\ssrc=['"](.*?)['"]/)[1];
              });
            }

            if (this.shareData.groupStatus == 2) {
              this.$toast("活动已结束");
              this.groupStatus = "finish";
              this.shareData.remainingTime = 0;
            } else if (this.shareData.groupStatus == 0) {
              this.$toast("活动未开始");
              this.groupStatus = "notAtThe";
              this.shareData.remainingTime = 0;
            }
            this.$sensors.track("group_buying_view", {
              group_buying_id: this.purchaseId,
              group_buying_name: this.shareData.actName,
              head_id: this.chiefId,
              head_name: this.shareData.headUser,
              take_goods_address:
                this.shareData.communityName + this.shareData.place,
              group_buying_describe: this.shareData.groupDescriptionRichTxt,
              group_buying_rule_descibe: this.shareData.ruleDescription,
              group_buying_end_time: this.shareData.actEndTime,
            });
          }
        });
    },

    navToDetail(item) {
      let obj = {
        groupbuySkuPicurl: item.skuImg,
        groupbuyBuyerPrice: item.groupPrice,
        groupbuyLinePrice: item.crossedPrice,
        groupbuyEndDatetime: this.shareData.actEndTime,
        groupbuySkuName: item.skuName,
        groupbuyPurchaseNumber: item.buyerCount,
        groupbuyRuleDescribe: this.shareData.ruleDescription,
        groupbuySkuDetail: item.groupbuySkuDetail,
      };
      this.$store.state.CharseInfo = obj;
      console.log("this.$store.state.charseInfo", this.$store.state.CharseInfo);
      this.$router.push({
        path: "/bulk_goods_deatil",
        params: {
          resouce: obj,
        },
        query: {
          isWxShare: true,
        },
      });
    },

    backHome() {
      wx.miniProgram.reLaunch({ url: `/pages/common/home/index` });
    },

    checkAll() {
      if (this.isCheckAll) {
        this.checkList.forEach((item) => {
          item.isCheck = false;
        });
        this.result = [];
        this.isCheckAll = false;
        this.totalPrice = this.$util.toDecimal2(0);
      } else {
        this.isCheckAll = true;
        this.result = [];
        this.checkList.forEach((e) => {
          e.isCheck = true;
          this.result.push(e.id);
        });
        this.totalPriceFn();
      }
    },
    check(item) {
      if (this.result.indexOf(item.id) > -1) {
        let index = this.result.indexOf(item.id);
        this.result.splice(index, 1);
        item.isCheck = false;
        this.totalPriceFn();
      } else {
        this.result.push(item.id);
        item.isCheck = true;
        this.totalPriceFn();
      }
      if (this.result.length < this.checkList.length) {
        this.isCheckAll = false;
      } else {
        this.isCheckAll = true;
      }
    },
    showOtherBuy(index) {
      if (this.otherBuyList[index].orderItemList.length > 1) {
        this.$set(
          this.otherBuyList[index],
          "isShowOther",
          !this.otherBuyList[index]["isShowOther"]
        );
        this.$forceUpdate();
      } else {
        return;
      }
    },
    goodsChange(item) {
      if (this.checkList.indexOf(item) == -1 && item.count >= 1) {
        item.isCheck = true;
        this.checkList.push(item);
      } else if (this.checkList.indexOf(item) !== -1 && item.count == 0) {
        let index = this.checkList.indexOf(item);
        this.checkList.splice(index, 1);
      }
      this.totalPriceFn();
    },
    checkChange(item) {
      if (item.count == 0) {
        let index = this.checkList.indexOf(item);
        this.checkList.splice(index, 1);
      }
      this.totalPriceFn();
    },
    clearCar() {
      this.checkList.forEach((e) => {
        e.count = 0;
      });
      this.checkList = [];
    },
    totalPriceFn() {
      let price = this.checkList.reduce((pre, item) => {
        if (item.isCheck) {
          let x = BigNumber(item.count).multipliedBy(item.groupPrice);
          let y = BigNumber(x).plus(pre);
          return y;
        }
      }, 0);
      console.log(price, this.$util.toDecimal2(price));
      this.totalPrice = this.$util.toDecimal2(price);
    },
    selectCategory(item, index) {
      // this.totalPrice = 0;
      // this.setBulkTotalPrice(0);
      // this.setBulkCheckList([]);
      this.currentSelectCategory = index;
      this.$http
        .post("/app/json/app_group_buying_share_home/getScreenSkuInfoList", {
          purchaseId: this.purchaseId,
          chiefId: this.chiefId,
          skuCategory: item.key == "all" ? undefined : item.key,
        })
        .then((res) => {
          this.goodsList = res.data.data;
          this.goodsList.forEach((item) => {
            item["count"] = 0;
            item["isCheck"] = true;
            item["skuImg"] = item.skuPicUrl.split(",");
          });
        });
    },
    confirmOrder() {
      if (this.groupStatus == "finish") {
        this.$toast("活动已结束");
        return;
      } else if (this.groupStatus == "notAtThe") {
        this.$toast("活动未开始");
        return;
      }

      if (this.checkList.length == 0) {
        this.$toast("请先选购商品");
      } else {
        Toast.loading({
          message: "加载中...",
          duration: "toast",
          forbidClick: true,
        });
        this.setBulkTotalPrice(this.totalPrice);
        // this.setBulkCheckList(this.checkList);
        this.$store.state.bulkCheckList = this.checkList;
        console.log(
          "this.$store.state.bulkCheckList",
          this.$store.state.bulkCheckList
        );
        this.$router.push({
          path: "/bulk_share_confirm_order",
          query: {
            shareData: JSON.stringify(this.shareData),
            purchaseId: JSON.stringify(this.purchaseId),
            chiefId: JSON.stringify(this.chiefId),
            userId: JSON.stringify(this.userId),
            checkList: JSON.stringify(this.checkList),
          },
        });
      }
    },
    ...mapMutations(["setBulkTotalPrice", "setBulkCheckList"]),
  },
};
</script>

<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';
@import '~@/common/stylus/mixin.styl';

.divLine {
  width: 340px;
  height: 1px;
  background: #f0f0f0;
  margin: 10px 0 10px 30px;
}

.bulk-share-main {
  background: #f0f0f0 !important;
  width: 100%;
  height: 100%;

  .scrollBox {
    width: 100%;
    height: 100%;
    overflow-y: auto;
  }

  .bulk-header {
    width: 100%;
    background-size: 100% 138px;
    background-image: url('./images/main_bg_default@2x.png');
    background-repeat: no-repeat;
    background-color: #ffffff;
    padding-top: 8px;

    .headbox {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-right: 12px;

      .orderSwiper {
        position: fixed;
        top: 8px;
        right: 12px;
        flex: 1;
        display: flex;
        justify-content: flex-end;
        align-items: center;

        .van-swipe-item {
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .swipeItem {
          width: 235px;
          height: 28px;
          background: rgba(0, 0, 0, 0.5);
          border-radius: 14px;
          font-size: 12px;
          font-family: PingFang SC;
          font-weight: 400;
          color: #FFFFFF;
          text-align: center;
          line-height: 28px;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0 13px 0 4px;

          img {
            width: 22px;
            height: 22px;
            border-radius: 50%;
            margin-right: 9px;
          }

          .buyerText {
            flex-wrap: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }

        .nullSwipeItem {
          background: none;
        }
      }
    }

    .bulk-back {
      width: 50px;
      height: 25px;
      background-color: rgba(0, 0, 0, 0.3);
      border-radius: 0px 10.67px 10.67px 0px;
      display: flex;
      padding-left: 5px;

      .back-img {
        background-image: url('./images/btn-back.png');
        background-size: 100% 100%;
        width: 4px;
        height: 12px;
        margin-top: 5px;
        flex: 0.15;
      }

      .back-word {
        font-size: 12px;
        color: #FFFFFF;
        font-weight: blod;
        line-height: 25px;
        flex: 0.85;
        padding-left: 4px;
      }
    }

    .time-block {
      display: flex;
      align-items: center;
      padding: 10px 14px;
      font-size: 14px;
      font-family: PingFang SC;
      font-weight: bold;
      color: #ffffff;

      .block-time {
        width: 18px;
        height: 18px;
      }

      .time-bg-block {
        height: 54px;
        background: #DE316B;
        color: #ffffff;
        border-radius: 9px;
        width: 40px;
        height: 26px;
        text-align: center;
        line-height: 26px;
        margin: 0 5px;
      }
    }

    .user-card {
      width: 350px;
      height: 100px;
      background: #ffffff;
      box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.06);
      border-radius: 6px;
      margin: 0 auto 23px;
      display: flex;

      .user-message {
        display: flex;
        align-items: center;

        .user-pic {
          width: 47px;
          height: 47px;
          margin-left: 18px;
          border-radius: 50%;
        }

        .user-message-right {
          margin-left: 10px;
          display: flex;
          flex-direction: column;

          .user-message-top {
            display: flex;
            align-items: center;
            font-size: 16px;
            font-family: PingFang SC;
            font-weight: bold;
            color: #121212;
          }

          .group-status {
            width: 53px;
            height: 18px;
            margin-left: 10px;
          }

          .user-message-bottom {
            margin-top: 10px;
            font-size: 13px;
            font-family: PingFang SC;
            font-weight: bold;
            color: #999999;
          }
        }
      }
    }

    .group-desc {
      background: #ffffff;
      padding-bottom: 20px;

      .group-desc-content {
        display: flex;
        margin-left: 10px;

        .group-desc-content-pic {
          width: 12px;
          height: 12px;
        }

        .group-desc-content-right {
          display: flex;
          flex-direction: column;
          margin-left: 10px;

          .group-desc-content-right-top {
            font-size: 13px;
            font-family: PingFang SC;
            font-weight: 400;
            color: #666666;
          }

          .group-desc-content-right-bottom {
            font-size: 13px;
            font-family: PingFang SC;
            font-weight: 400;
            color: #999999;
            margin-top: 10px;
            width: 330px;
            line-height: 20px;

            /deep/p {
              font-size: 13px;
              font-family: PingFang SC;
              font-weight: 400;
              color: #999999;
            }
          }
        }
      }
    }
  }

  .product-card {
    width: 350px;
    margin: 12px;
    background: #ffffff;
    box-shadow: 0px 2px 3px 0px rgba(139, 139, 139, 0.02);
    border-radius: 6px;

    .product-message {
      padding: 8px;
      display: flex;

      .product-pic {
        width: 120px;
        height: 120px;
      }

      .product-desc {
        display: flex;
        flex-direction: column;
        margin-left: 8px;
        justify-content: space-between;

        .product-title {
          font-size: 13px;
          font-family: PingFang SC;
          font-weight: bold;
          color: #121212;
          width: 200px;
        }

        .product-prize-old {
          font-size: 12px;
          font-family: PingFang SC;
          font-weight: bold;
          text-decoration: line-through;
          color: #999999;
          margin-top: 13px;
        }

        .product-prize-group {
          font-size: 13px;
          font-family: PingFang SC;
          font-weight: bold;
          color: #f03000;
          margin-top: 13px;
        }

        .change-product-num {
          display: flex;
          flex-direction: row-reverse;
          align-items: center;

          .change-num-pic {
            height: 24px;
            width: 24px;
          }

          .product-num {
            margin: 0 10px;
          }
        }
      }
    }
  }

  .user-group-team {
    width: 350px;
    margin: 12px 0 130px 12px;
    background: #ffffff;
    box-shadow: 0px 2px 3px 0px rgba(139, 139, 139, 0.02);
    border-radius: 6px;
    padding: 15px 0;

    .gruop-title {
      padding-top: 21px;
      text-align: center;

      .group-header-one {
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: bold;
        color: #121212;
      }

      .group-header-second {
        margin: 10px 0 20px 0;
        font-size: 13px;
        font-family: PingFang SC;
        font-weight: bold;
        color: #999999;
      }
    }

    .group-people {
      .group-people-item {
        margin-top: 10px;
        display: flex;

        .group-people-pic {
          margin-left: 26px;
          width: 42px;
          height: 42px;
          border-radius: 50%;
        }

        .group-people-message {
          display: flex;
          flex-direction: column;
          margin-left: 13px;

          .people-item-phone {
            font-size: 13px;
            font-family: PingFang SC;
            font-weight: bold;
            color: #121212;
          }

          .people-item-time {
            font-size: 12px;
            font-family: PingFang SC;
            font-weight: bold;
            color: #999999;
            margin-top: 8px;
          }

          .people-item-desc {
            font-size: 13px;
            font-family: PingFang SC;
            font-weight: bold;
            color: #666666;
            margin-top: 8px;
            display: flex;
            justify-content: space-between;
            width: 250px;
          }
        }
      }
    }
  }

  .bottom-button {
    width: 375px;
    height: 84px;
    background: #ffffff;
    box-shadow: 0px -4px 15px 1px rgba(0, 0, 0, 0.04);
    display: flex;
    position: fixed;
    bottom: 0;
    justify-content: space-between;

    .car-shop {
      width: 51px;
      height: 51px;
      margin: -15px 0 0 13px;
    }

    .bottom-button-prize {
      font-size: 22px;
      font-family: PingFang SC;
      font-weight: bold;
      color: #f03000;
      padding-top: 9px;
    }

    .circle-radius {
      width: 28px;
      height: 28px;
      background: #f03000;
      border: 2px solid #ffffff;
      border-radius: 50%;
      font-family: PingFang SC;
      font-weight: bold;
      color: #ffffff;
      text-align: center;
      line-height: 28px;
      position: relative;
      top: -20px;
      left: -15px;

      .scale-font {
        transform: scale(0.8);
        font-size: 12px;
      }
    }

    .order-button {
      width: 94px;
      height: 36px;
      background: linear-gradient(90deg, #ff7ba6 0%, #e9306d 100%);
      border-radius: 18px;
      font-size: 14px;
      font-family: PingFang SC;
      font-weight: bold;
      color: #ffffff;
      text-align: center;
      line-height: 36px;
      margin: 10px 15px 0 0;
    }
  }
}
</style>
