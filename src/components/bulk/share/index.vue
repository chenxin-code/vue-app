<template>
  <div class="bulk-share-main">
    <div class="bulk-header">
      <div class="time-block">
        <img src="./images/icon_time_default@2x.png" class="block-time" />
        <div style="margin-left: 7px">拼团结束时间</div>

        <van-count-down :time="shareData.remainingTime * 1000">
          <template #default="timeData">
            <div style="display: flex;align-items: center">
              <div class="time-bg-block">{{ timeData.days }}天</div>

              <span style="color: #C0003F;">:</span>
              <div class="time-bg-block">{{ timeData.hours }}</div>
              <span style="color: #C0003F;">:</span>
              <div class="time-bg-block">{{ timeData.minutes }}</div>
              <span style="color: #C0003F;">:</span>
              <div class="time-bg-block">{{ timeData.seconds }}</div>
            </div>
          </template>
        </van-count-down>
      </div>

      <div class="user-card">
        <div class="user-message">
          <img
            src="./images/img_user_01@2x.png"
            :error-icon="defaultAvatar"
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
              <img :src="groupStatus=='finish' ? require('@/components/bulk/share/images/img_tips_over@2x.png') : groupStatus=='notAtThe' ? require('@/components/bulk/share/images/img_tips_ready@2x.png') : require('@/components/bulk/share/images/img_tips_default@2x.png')" class="group-status" />
            </div>
            <div class="user-message-bottom">
              <span style="color: #999999">提货地址：</span>
              <span style="color: #121212">{{shareData.communityName}}{{ shareData.place }}</span>
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
            <div style="display: flex;flex-direction: column;">
              <div class="product-title">产品名称：{{ item.skuName }}</div>
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
              src="./images/user_01@2x.png"
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
          <div class="divLine" style="width: 8rem" v-show="index !== otherBuyList.length-1"></div>
        </div>
      </div>
    </div>

    <div class="bottom-button">
      <div style="display: flex;">
        <img src="./images/button_shop_default@2x.png" class="car-shop" />
        <!-- <div class="circle-radius"><span class="scale-font">999</span></div> -->
        <div class="bottom-button-prize">¥{{ totalPrice }}</div>
      </div>

      <div class="order-button" @click="confirmOrder">
        去结算
      </div>
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
      activityName: "",
      groupStatus: "start"
    };
  },
  created() {
    this.purchaseId = JSON.parse(this.$route.query.purchaseId);
    this.chiefId = JSON.parse(this.$route.query.chiefId);
    this.userId = JSON.parse(this.$route.query.userId);
    this.activityName = this.$route.query.activityName;

    // this.purchaseId = 27;
    // this.chiefId = '3';
    // this.userId = '2337237484980712751';
    // this.activityName = '夏季进口水果特价团';

    this.totalPrice = this.$util.toDecimal2(this.totalPrice);
    this.checkList.forEach(e => {
      this.result.push(e.id);
    });
    this.$http
      .post("/app/json/app_group_buying_share_home/queryShareHomePageInfo", {
        purchaseId: this.purchaseId,
        chiefId: this.chiefId,
        userId: this.userId,
        status: "1,2,3,4,5"
      })
      .then(res => {
        console.log("分享页面信息~~~~~~~", res);
        if (res.data.result == "success") {
          this.shareData = res.data.data;
          this.goodsList = this.shareData.groupbuySkuInfoList;
          this.goodsList.forEach(item => {
            item["count"] = 0;
            item["isCheck"] = true;
            item["skuImg"] = item.skuPicUrl.split(",");
          });
          if (this.shareData.currentActOrderList) {
            this.otherBuyList = this.shareData.currentActOrderList;
            this.otherBuyList.forEach(e => {
              e["isShowOther"] = false;
              if (e.orderItemList.length > 1) {
                e["otherOrderItemList"] = e.orderItemList.slice(1);
              }
            });
          }
          for (let i in this.shareData.categoryMap) {
            this.categoryMap.push({
              key: i,
              value: this.shareData.categoryMap[i]
            });
          }
          this.descData = this.shareData.groupDescriptionRichTxt;

          this.str = this.descData.replace(/<img.*?>/g, "");

          let imgStrs = this.shareData.groupDescriptionRichTxt.match(
            /<img.*?>/g
          );

          // 获取每个img url
          if (imgStrs) {
            this.imgUrls = imgStrs.map(url => {
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
        }
      });
  },

  methods: {
    navToDetail(item){
      let obj = {
        groupbuySkuPicurl:item.skuImg,
        groupbuyBuyerPrice:item.groupPrice,
        groupbuyLinePrice:item.crossedPrice,
        groupbuyEndDatetime:this.shareData.actEndTime,
        groupbuySkuName:item.skuName,
        groupbuyPurchaseNumber:item.buyerCount,
        groupbuyRuleDescribe:this.shareData.ruleDescription,
        groupbuySkuDetail:item.groupbuySkuDetail,
      }
      this.$store.state.CharseInfo = obj;
      console.log('this.$store.state.charseInfo',this.$store.state.CharseInfo)
      this.$router.push({
        path:'/bulk_goods_deatil',
        params: {
          resouce: obj,
        },
        query:{
          isWxShare:true,
        }
      });
    },
    checkAll() {
      if (this.isCheckAll) {
        this.checkList.forEach(item => {
          item.isCheck = false;
        });
        this.result = [];
        this.isCheckAll = false;
        this.totalPrice = this.$util.toDecimal2(0);
      } else {
        this.isCheckAll = true;
        this.result = [];
        this.checkList.forEach(e => {
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
      this.checkList.forEach(e => {
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
          skuCategory: item.key == "all" ? undefined : item.key
        })
        .then(res => {
          this.goodsList = res.data.data;
          this.goodsList.forEach(item => {
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
          forbidClick: true
        });
        this.setBulkTotalPrice(this.totalPrice);
        // this.setBulkCheckList(this.checkList);
        this.$store.state.bulkCheckList = this.checkList;
        console.log('this.$store.state.bulkCheckList',this.$store.state.bulkCheckList)
        this.$router.push({
          path: "/bulk_share_confirm_order",
          query: {
            shareData: JSON.stringify(this.shareData),
            purchaseId: JSON.stringify(this.purchaseId),
            chiefId: JSON.stringify(this.chiefId),
            userId: JSON.stringify(this.userId),
            activityName: JSON.stringify(this.activityName),
            checkList:JSON.stringify(this.checkList)
          },
        });
      }
    },
    ...mapMutations(["setBulkTotalPrice", "setBulkCheckList"])
  }
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
  overflow: auto;
  .bulk-header {
    width: 100%;
    background-size: 100% 138px;
    background-image: url("./images/main_bg_default@2x.png");
    background-repeat: no-repeat;
    background-color: #ffffff;
    .time-block {
      display: flex;
      align-items: center;
      padding: 26px 14px;
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
            /deep/p{
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
            justify-content:space-between;
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
