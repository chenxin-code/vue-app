<template>
  <!-- // created by hjc 微信团购分享首页 -->
  <div class="share" @click="isShowNavigation = false">
    <div class="share_card">
      <div class="share_user">
        <div class="bulk_time_share">
          <div class="bulk_time">
            拼团结束时间剩余
            <van-count-down :time="shareData.remainingTime">
              <template #default="timeData">
                <span class="block">{{ timeData.hours }}</span>
                <span class="colon">:</span>
                <span class="block">{{ timeData.minutes }}</span>
                <span class="colon">:</span>
                <span class="block">{{ timeData.seconds }}</span>
              </template>
            </van-count-down>
          </div>
          <div class="bulk_share">
            <div class="bulk_title">拼团中</div>
            <img
              :src="require('./images/share.png')"
              alt=""
              class="share_icon"
            />
          </div>
        </div>
        <div class="user_detail">
          <img :src="shareData.headAvtUrl" alt="" class="avatar" />
          <div class="user_detail_detail">
            <div class="colonel_name">团长名称：{{ shareData.headUser }}</div>
            <div class="take_address">提货地址：{{ shareData.place }}</div>
          </div>
        </div>
      </div>
      <div class="line"></div>
      <div class="activity_description">
        <div class="activity_description_text">
          团购活动描述:
          <div v-html="str"></div>
        </div>
        <div class="bulk_img" v-if="imgUrls.length !== 0">
          <img
            :src="item"
            alt=""
            v-for="(item, index) in imgUrls"
            :key="index"
          />
        </div>
      </div>
      <div class="line"></div>
      <div class="rule_description">
        <div class="rule_description_title">团购规则描述：</div>
        <div class="rule_description_text">
          {{ shareData.ruleDescription }}
        </div>
      </div>
    </div>
    <van-sticky>
      <div class="select_box">
        <div class="select_category">
          <div
            :class="index == currentSelectCategory ? 'current_select' : ''"
            class="select_item"
            v-for="(item, index) of categoryMap"
            :key="index"
            @click="selectCategory(item, index)"
          >
            {{ item.value }}
          </div>
        </div>
      </div>
    </van-sticky>
    <div class="category_card">
      <div
        class="category_card_item"
        v-for="(item, index) in goodsList"
        :key="index"
      >
        <div class="item_detail">
          <img :src="item.skuImg[0]" alt="" class="item_img" />
          <div class="item_detail_deatil">
            <div class="item_name">产品名称：{{ item.skuName }}</div>
            <div class="sell_price">销售价格：￥{{ item.crossedPrice }}</div>
            <div class="bulk_price">团购价格：￥{{ item.groupPrice }}</div>
          </div>
        </div>
        <div class="item_other">
          <div class="item_other_box">
            <div class="item_units">
              已抢{{ item.purchasedItem }}件/剩余{{ item.remainingItem }}件
            </div>
            <div class="item_other_user">
              <img
                v-for="(element, index) in item.buyerMap"
                :key="index"
                :src="element.buyerAvtUrl"
                alt=""
                class="item_other_user_avatar"
              />
              等{{ item.buyerCount }}人购买了此商品
            </div>
          </div>
          <van-stepper
            v-model="item.count"
            min="0"
            integer
            :max="item.remainingItem"
            @change="goodsChange(item)"
          />
        </div>
      </div>
    </div>
    <div class="other_user_buy_card" v-show="otherBuyList.length > 0">
      <div class="other_user_buy_title">
        这些团友都买了（共{{ otherBuyList.length }}人参加了本次团购）
      </div>
      <div
        class="other_user_item"
        v-for="(item, index) in otherBuyList"
        :key="index"
      >
        <div class="other_user_item_user">
          <img :src="item.buyerAvtUrl" alt="" class="other_user_avatar" />
          <div class="other_user_info">
            <div class="other_user_name">{{ item.buyerName }}</div>
            <div class="detail_btn">
              <div class="other_user_date">{{ item.buyTime }}</div>
              <img
                :src="
                  item.isShowOther
                    ? require('./images/show_icon.png')
                    : require('./images/hidden_icon.png')
                "
                alt=""
                class="detail_icon"
                @click="showOtherBuy(index)"
              />
            </div>
          </div>
        </div>
        <div class="other_user_buy">
          <div class="other_user_buy_text">
            {{ item.orderItemList[0].groupbuySkuName }}
          </div>
          <div class="other_user_buy_count">
            X{{ item.orderItemList[0].buyNumber }}
          </div>
        </div>
        <div
          class="other_user_buy"
          v-show="item.isShowOther"
          v-for="(element, index) in item.otherOrderItemList"
          :key="index"
        >
          <div class="other_user_buy_text">
            {{ element.groupbuySkuName }}
          </div>
          <div class="other_user_buy_count">X{{ element.buyNumber }}</div>
        </div>
      </div>
    </div>
    <div class="submit_bar">
      <div class="price_detail">
        <div class="car" @click="isShowCar = !isShowCar"></div>
        <div class="price">¥{{ totalPrice }}</div>
      </div>
      <div class="sumbit_btn" @click="confirmOrder">去下单</div>
    </div>
    <transition name="van-slide-left">
      <div
        class="navigation_hidden"
        v-show="!isShowNavigation"
        @click.stop="isShowNavigation = true"
      >
        <div>快捷</div>
        <div>导航</div>
      </div>
    </transition>
    <transition name="van-slide-left">
      <div class="navigation_show" v-show="isShowNavigation">
        <div class="navigation_order">
          <img :src="require('./images/order_icon.png')" alt="" />
          <div>订单</div>
        </div>
        <div class="user_navigation">
          <img :src="require('./images/user_icon.png')" alt="" />
          <div>个人中心</div>
        </div>
        <div class="back_navigation">
          <img :src="require('./images/down_icon.png')" alt="" class="back" />
        </div>
      </div>
    </transition>
    <van-popup
      v-model="isShowCar"
      position="bottom"
      :style="{ height: '57%' }"
      round
    >
      <div class="car_popup">
        <div class="car_title">
          <div class="check_all" @click="checkAll">
            <div
              class="check_icon"
              :style="{
                backgroundImage: isCheckAll
                  ? 'url(' + require('./images/check.png') + ')'
                  : '',
              }"
            ></div>
            <span>全选</span>
            <span>（共{{ checkList.length }}件）</span>
          </div>
          <div class="check_out" @click="clearCar">清空购物车</div>
        </div>
        <div class="goods">
          <van-checkbox
            v-model="item.isCheck"
            v-for="(item, index) in checkList"
            :key="index"
            @click="check(item)"
          >
            <template #icon>
              <div class="goods_item">
                <div
                  class="goods_check"
                  :style="{
                    backgroundImage: item.isCheck
                      ? 'url(' + require('./images/check.png') + ')'
                      : '',
                  }"
                ></div>
                <img :src="item.skuPicUrl" alt="" class="goods_img" />
                <div class="goods_detail">
                  <div class="goods_name">{{ item.skuName }}</div>
                  <!-- 空事件是阻止步进器点击事件冒泡到checkbox  勿删 -->
                  <div class="goods_price_count" @click.stop="">
                    <div class="goods_price">¥{{ item.groupPrice }}</div>
                    <van-stepper
                      v-model="item.count"
                      integer
                      min="0"
                      @change="checkChange(item)"
                    />
                  </div>
                </div>
              </div>
            </template>
          </van-checkbox>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import Qs from "qs";
import { mapMutations } from "vuex";
export default {
  name: "share",
  props: {},
  data() {
    return {
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
    };
  },
  created() {
    this.purchaseId = JSON.parse(this.$route.query.purchaseId);
    this.chiefId = JSON.parse(this.$route.query.chiefId);
    this.userId = JSON.parse(this.$route.query.userId);
    this.activityName = JSON.parse(this.$route.query.activityName);

    this.totalPrice = this.$util.toDecimal2(this.totalPrice);
    this.checkList.forEach((e) => {
      this.result.push(e.id);
    });
    this.$http
      .post("/app/json/app_group_buying_share_home/queryShareHomePageInfo", {
        purchaseId: this.purchaseId,
        chiefId: this.chiefId,
        userId: this.userId,
      })
      .then((res) => {
        if (res.data.result == "success") {
          this.shareData = res.data.data;
          this.goodsList = this.shareData.groupbuySkuInfoList;
          this.goodsList.forEach((item) => {
            item["count"] = 0;
            item["isCheck"] = true;
            item["skuImg"] = item.skuPicUrl.split(",");
          });
          this.otherBuyList = this.shareData.currentActOrderList;
          this.otherBuyList.forEach((e) => {
            e["isShowOther"] = false;
            if (e.orderItemList.length > 1) {
              e["otherOrderItemList"] = e.orderItemList.slice(1);
            }
          });
          for (let i in this.shareData.categoryMap) {
            this.categoryMap.push({
              key: i,
              value: this.shareData.categoryMap[i],
            });
          }
          this.descData = this.shareData.groupDescriptionRichTxt;

          this.str = this.descData.replace(/<img.*?>/g, "");

          let imgStrs = this.shareData.groupDescriptionRichTxt.match(
            /<img.*?>/g
          );

          // 获取每个img url
          this.imgUrls = imgStrs.map((url) => {
            return url.match(/\ssrc=['"](.*?)['"]/)[1];
          });
        }
      });
  },

  methods: {
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
          return item.count * item.groupPrice + pre;
        }
      }, 0);
      this.totalPrice = this.$util.toDecimal2(price);
    },
    selectCategory(item, index) {
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
      this.setBulkTotalPrice(this.totalPrice);
      this.setBulkCheckList(this.checkList);
      if (this.checkList.length == 0) {
        this.$toast("请先选购商品");
      } else {
        this.$router.push({
          path: "/bulk_share_confirm_order",
          query: {
            shareData: JSON.stringify(this.shareData),
            purchaseId: JSON.stringify(this.purchaseId),
            chiefId: JSON.stringify(this.chiefId),
            userId: JSON.stringify(this.userId),
            activityName: JSON.stringify(this.activityName),
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

img {
  max-width: 100% !important;
}

.router_class {
  background-color: #F6F6F6;
}

.share {
  padding: 10px 10px 73px;
  background-color: #F6F6F6;
  font-family: PingFangSC-Regular, PingFang SC;
  overflow-y: auto;

  .line {
    background-color: #EEEDED;
    width: 100%;
    height: 1px;
  }

  .navigation_hidden {
    width: 43.5px;
    height: 43.5px;
    background: #FFFFFF;
    box-shadow: 0px 2px 7px 0px rgba(148, 146, 146, 0.5);
    font-size: 11px;
    font-weight: 400;
    color: #666666;
    border-radius: 50%;
    position: fixed;
    left: 10px;
    bottom: 50%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    line-height: 15px;
  }

  .navigation_show {
    width: 50px;
    height: 125px;
    background: #FFFFFF;
    box-shadow: 0px 2px 7px 1px #CFCDCD;
    border-radius: 22px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    position: fixed;
    left: 10px;
    bottom: 50%;
    font-size: 11px;
    font-weight: 400;
    color: #999999;

    .navigation_order {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      height: 41px;
      border-bottom: 1px solid #D8D6D6;
      padding-bottom: 2px;
      margin-bottom: 2.5px;

      img {
        width: 11.5px;
        height: 13.5px;
      }
    }

    .user_navigation {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      height: 41px;
      border-bottom: 1px solid #D8D6D6;
      padding-bottom: 2px;

      img {
        width: 17px;
        height: 17px;
      }
    }

    .back_navigation {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;

      .back {
        width: 12px;
        height: 12px;
      }
    }
  }

  .share_card {
    width: 100%;
    // height: 338px;
    background-color: #fff;
    box-shadow: 0px 1px 11px 3px rgba(231, 230, 230, 0.5);
    border-radius: 10px;
    padding: 10px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    margin-bottom: 10px;

    .share_user {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;

      .bulk_time_share {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .bulk_time {
          font-size: 12px;
          font-weight: 400;
          color: #D0021B;
          letter-spacing: 2px;

          .van-count-down {
            display: inline-block;

            .colon {
              display: inline-block;
              margin: 0 4px;
              color: #ee0a24;
            }

            .block {
              display: inline-block;
              width: 22px;
              color: #fff;
              font-size: 11px;
              text-align: center;
              background-color: #ee0a24;
              border-radius: 5px;
            }
          }
        }

        .bulk_share {
          display: flex;
          justify-content: space-between;
          align-items: center;

          .bulk_title {
            font-size: 14px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #D0021B;
            letter-spacing: 2px;
            margin-right: 10px;
          }

          .share_icon {
            width: 18.5px;
            height: 18.5px;
          }
        }
      }

      .user_detail {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin-top: 10px;
        margin-bottom: 9.5px;

        .avatar {
          width: 52.5px;
          height: 52.5px;
          margin-right: 10px;
        }

        .user_detail_detail {
          height: 52.5px;
          padding: 6px 0 6.5px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          font-size: 13px;
          font-weight: 400;
          color: #424242;
          letter-spacing: 2px;
        }
      }
    }

    .activity_description {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      padding: 9.5px 0 7px;

      .activity_description_text {
        font-size: 12px;
        font-weight: 400;
        color: #666666;
        line-height: 16.5px;
        margin-bottom: 10px;
      }

      .bulk_img {
        overflow-x: auto;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .activity_description_text {
          font-size: 12px;
          font-weight: 400;
          color: #666666;
          letter-spacing: 2px;
        }

        img {
          width: 105px;
          height: 105px;
        }
      }
    }

    .rule_description {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding-top: 9.5px;
      font-size: 12px;
      font-weight: 400;
      color: #666666;
      line-height: 16.5px;
      letter-spacing: 2px;
    }
  }

  .select_box {
    width: 100%;
    overflow-x: scroll;
    overflow-y: hidden;
    margin: 0px auto 8.5px;

    .select_category {
      min-width: 100%;
      height: 44px;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      background-color: #fff;
      white-space: nowrap;

      .select_item {
        display: inline-flex;
        padding: 0 15px 0 10px;
        font-size: 14px;
        font-weight: 400;
        color: #999999;
        letter-spacing: 2px;
        border-right: 1px solid #F49999;
      }

      .select_item:last-child {
        border: none;
      }

      .current_select {
        font-weight: 600;
        color: #000000;
        background: linear-gradient(180deg, #F7A1AA 0%, #B52232 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }
  }

  .category_card {
    width: 100%;
    background: #FFFFFF;
    box-shadow: 0px 1px 11px 3px rgba(231, 230, 230, 0.5);
    border-radius: 10px;
    padding: 0 10px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;

    .category_card_item {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      border-bottom: 1px solid #EEEDED;
      padding: 9.5px 0;

      .item_detail {
        display: flex;
        justify-content: flex-start;

        .item_img {
          width: 85px;
          height: 85px;
          margin-right: 10px;
        }

        .item_detail_deatil {
          display: flex;
          flex-direction: column;
          justify-content: flex-start;

          .item_name {
            font-size: 14px;
            font-weight: 400;
            color: #424242;
            letter-spacing: 2px;
            margin-bottom: 24.5px;
          }

          .sell_price {
            font-size: 13px;
            font-weight: 400;
            color: #666666;
            letter-spacing: 2px;
            margin-bottom: 4px;
            text-decoration: line-through;
          }

          .bulk_price {
            font-size: 14px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #424242;
            letter-spacing: 2px;
          }
        }
      }

      .item_other {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 8px;

        .item_other_box {
          display: flex;
          flex-direction: column;
          justify-content: space-between;

          .item_units {
            font-size: 11px;
            font-weight: 400;
            color: #999999;
            margin-bottom: 10px;
          }

          .item_other_user {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 11px;
            font-weight: 400;
            color: #999999;

            .item_other_user_avatar {
              width: 24px;
              height: 24px;
              margin-right: 5px;
            }
          }
        }
      }
    }
  }

  .other_user_buy_card {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding: 12.5px 10px 10px;
    background: #FFFFFF;
    box-shadow: 0px 1px 11px 3px rgba(231, 230, 230, 0.5);
    border-radius: 10px;
    margin-top: 10px;

    .other_user_buy_title {
      padding-bottom: 4.5px;
      font-size: 12px;
      font-weight: 400;
      color: #999999;
      letter-spacing: 2px;
      border-bottom: 1px solid #EEEDED;
    }

    .other_user_item {
      padding: 9.5px 0;
      border-bottom: 1px solid #EEEDED;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .other_user_item_user {
        display: flex;
        justify-content: flex-start;
        align-items: center;

        .other_user_avatar {
          width: 46px;
          height: 46px;
          margin-right: 10px;
        }

        .other_user_info {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;

          .other_user_name {
            font-size: 13px;
            font-weight: 400;
            color: #666666;
            margin-bottom: 3px;
          }

          .detail_btn {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;

            .other_user_date {
              font-size: 13px;
              font-weight: 400;
              color: #999999;
            }

            .detail_icon {
              width: 13.5px;
              height: 8px;
            }
          }
        }
      }

      .other_user_buy {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 10px;

        .other_user_buy_text {
          font-size: 13px;
          font-weight: 600;
          color: #999999;
          letter-spacing: 2px;
        }

        .other_user_buy_count {
          font-size: 13px;
          font-weight: 600;
          color: #999999;
          letter-spacing: 2px;
        }
      }
    }

    .other_user_item:last-child {
      border: none;
    }
  }

  .submit_bar {
    width: 100%;
    height: 49px;
    background: #FFFFFF;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 99999;
    padding: 4px 20px 4px 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .price_detail {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .car {
        width: 41px;
        height: 41px;
        background: #B52232;
        border-radius: 50%;
        background-image: url('./images/car.png');
        background-repeat: no-repeat;
        background-size: 21.5px 19.5px;
        background-position-x: 50%;
        background-position-y: 50%;
        margin-right: 10px;
      }

      .price {
        font-size: 16px;
        font-weight: 600;
        color: #D0021B;
      }
    }

    .sumbit_btn {
      width: 86px;
      height: 27.5px;
      background: #B52232;
      border-radius: 14px;
      text-align: center;
      line-height: 27.5px;
      font-size: 13px;
      font-weight: 400;
      color: #FFFFFF;
    }
  }

  .car_popup {
    padding: 0px 20px 49px 15px;
    position: relative;
    overflow: visible;

    .car_title {
      width: 100%;
      height: 36px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #EEEDED;
      background-color: #fff;
      position: -webkit-sticky;
      position: sticky;
      top: 0px;
      z-index: 99999;

      .check_all {
        display: flex;
        justify-content: flex-start;
        align-items: center;

        .check_icon {
          width: 12px;
          height: 12px;
          border: 1px solid #B52232;
          border-radius: 50%;
          margin-right: 5px;
          background-size: 12px 12px;
          background-position: 50%;
          background-repeat: no-repeat;

          span {
            font-size: 12px;
            font-weight: 400;
            color: #666666;
            line-height: 16.5px;
            letter-spacing: 1px;
          }

          span:last-child {
            color: #A9A2A2;
          }
        }
      }

      .check_out {
        font-size: 12px;
        font-weight: 400;
        color: #A9A2A2;
        line-height: 16.5px;
        letter-spacing: 1px;
      }
    }

    .goods {
      overflow-y: auto;

      .van-checkbox {
        width: 100%;
      }

      /deep/.van-checkbox__icon {
        height: auto;
        width: 100%;

        .goods_item {
          width: 100%;
          display: flex;
          justify-content: flex-start;
          padding: 9.5px 0;
          border-bottom: 1px solid #EEEDED;

          .goods_check {
            width: 12px;
            height: 12px;
            border: 1px solid #B52232;
            background-size: 12px 12px;
            background-position: 50%;
            background-repeat: no-repeat;
            border-radius: 50%;
            margin-right: 10px;
            margin-top: 28.5px;
          }

          .goods_img {
            width: 68.5px;
            height: 68.5px;
            margin-right: 10px;
          }

          .goods_detail {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;

            .goods_name {
              font-size: 14px;
              font-weight: 400;
              color: #424242;
              line-height: 20px;
              letter-spacing: 1px;
            }

            .goods_price_count {
              flex: 1;
              display: flex;
              justify-content: space-between;

              .van-stepper {
                margin-top: 22px;
              }

              .goods_price {
                margin-top: 28px;
              }
            }
          }

          .goods_item:last-child {
            border: none;
          }
        }
      }
    }
  }
}
</style>

