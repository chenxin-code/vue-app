<template>
  <!-- // created by hjc 微信团购分享首页 -->
  <div class="share" :style="style" @click="isShowNavigation = false">
    <van-sticky style="width: 100%">
      <div>
        <van-nav-bar
          :left-arrow="false"
          safe-area-inset-top
          @click-left="$router.go(-1)"
          :border="false"
        >
          <template #left>
            <van-icon
              name="wap-home-o"
              size="20"
              v-show="!isShowNavigation"
              @click.stop="$router.push({ path: '/' })"
            />
          </template>
          <template #title>
            <div class="navTitle">商品详情</div>
          </template>
        </van-nav-bar>
      </div>
    </van-sticky>
    <div class="content">
      <div class="row row_reseve">
        <div class="rule row center" @click="dialogshow = true">活动规则</div>
      </div>
      <div class="row center activityName">
        {{ shareData.groupbuyActivityName }}
      </div>
      <div class="column center">
        <div class="row center activeTime">
          <div class="goodPanel-remain">
            <div class="remain_title">{{ timeText }}</div>
            <div class="remain-times" v-if="timeText != '活动已结束'">
              <van-count-down
                :time="endTime"
                :auto-start="true"
                @finish="finish"
              >
                <template #default="timeData">
                  <span v-if="timeData.days != 0">
                    <span class="block">{{ timeData.days }}</span>
                    <span class="colon">天</span>
                  </span>
                  <span class="block">{{ timeData.hours }}</span>
                  <span class="colon">:</span>
                  <span class="block">{{ timeData.minutes }}</span>
                  <span class="colon">:</span>
                  <span class="block">{{ timeData.seconds }}</span>
                </template>
              </van-count-down>
            </div>
          </div>
        </div>
        <div class="listBox">
          <div class="list">
            <div
              class="listinfo img-max-width"
              v-html="shareData.groupbuyDescribe"
            >
              <!-- {{ shareData.groupbuyDescribe }} -->
            </div>
            <div class="row start">
              <div class="listimg row center">
                <img
                  :src="shareData.groupbuyActivityPicurl"
                  alt=""
                  class="img"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="listBox">
          <div
            class="list row"
            v-for="(item, index) in shareData.skuRuleModelList"
            :key="index"
          >
            <div class="liimg row center">
              <img :src="item.groupbuySkuPicurl" alt="" class="img" />
            </div>
            <div class="flex start">
              <div class="liinfo">
                {{ item.spuName }}
              </div>
              <div class="row spacebwteen">
                <div>
                  <div class="row end">
                    <div class="currentPrice">
                      <span class="priceIcon">¥</span
                      ><span class="buyerPrice">{{
                        $util.toDecimal2(item.groupbuyBuyerPrice)
                      }}</span>
                    </div>
                    <div class="oldPrice">
                      <span class="priceIcon">¥</span>
                      <span>{{
                        $util.toDecimal2(item.groupbuyLinePrice)
                      }}</span>
                      <div class="priceLine"></div>
                    </div>
                  </div>
                  <div class="hasbuy">已抢{{ item.saleNum }}件</div>
                </div>
                <div class="liButton row center" @click="buyButton(item)">
                  立即抢购
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <transition name="van-slide-left">
          <div class="navigation_show" v-show="isShowNavigation">
            <div class="navigation_order">
              <img
                :src="require('./images/order_icon.png')"
                class="img"
                alt=""
              />
              <div>订单</div>
            </div>
            <div class="user_navigation">
              <img
                :src="require('./images/user_icon.png')"
                class="img"
                alt=""
              />
              <div>个人中心</div>
            </div>
            <div class="back_navigation">
              <img
                :src="require('./images/down_icon.png')"
                alt=""
                class="img back"
              />
            </div>
          </div>
        </transition>
      </div>
    </div>
    <van-dialog
      class="dialog-mask row center"
      v-model="dialogshow"
      :show-cancel-button="false"
      :show-confirm-button="false"
      :closeOnClickOverlay="true"
    >
      <div class="dialog-mask-content column center">
        <div class="withdrawimg row spacebwteen" :style="dialogstyle">
          <div class="row center flex">活动规则</div>
          <div class="iconBox row center" @click.stop="close">
            <van-icon name="cross" color="#fff" size="20" />
          </div>
        </div>
        <div class="column center ruleBox">
          <div v-html="shareData.groupbuyRuleDescribe">
            <!-- {{ shareData.groupbuyRuleDescribe }} -->
          </div>
        </div>
      </div>
    </van-dialog>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import { activityDetail, config } from "../bulkapi/index.js";
import appLocalstorage from "@zkty-team/x-engine-module-localstorage";
import { Toast, Dialog } from "vant";
export default {
  name: "share",
  props: {},
  data() {
    return {
      style: {
        background:
          "url('../../../../static/image/bulk/share/shareBg.png') center center / 100% 100% no-repeat",
      },
      dialogstyle: {
        background:
          "url('../../../../static/image/bulk/share/activityBG.png') center center / 100% 100% no-repeat",
      },
      defaultAvatar: require("@/components/bulk/activity/images/user-default.png"),
      isShowNavigation: false,
      checkList: [],
      shareData: {},
      totalPrice: 0,
      purchaseId: "",
      chiefId: "",
      userId: "",
      activityName: "",
      timeText: "距结束",
      endTime: "",
      dialogshow: false,
      communityId: "2311040709915842120",
      param: "",
    };
  },
  created() {
    /*可以打开*/
    if (this.$store.state.webtype == "2" || this.$store.state.webtype == "3") {
      /*微信小程序环境*/
      this.communityId = this.$store.state.projectId;
    } else {
      /*app环境*/
      appLocalstorage
        .get({
          key: "LLBProjectId",
          isPublic: true,
        })
        .then((res) => {
          this.communityId = res.result;
        });
    }
    this.param = this.$route.query;
    let { communityId, param } = this;
    this.getShareFn(param.activityId, communityId);
  },

  methods: {
    /*关闭弹窗*/
    close() {
      this.dialogshow = false;
    },
    /*活动时间倒计时*/
    getTimeTitle(endTime) {
      let nowT = new Date().getTime();
      let endT = this.$util.getDateFromString(endTime) * 1000;
      if (nowT < endT) {
        this.timeText = "距离结束还剩:";
        this.getCountdownTime(endTime);
      } else {
        this.timeText = "活动已结束";
        this.endTime = "";
      }
    },
    getCountdownTime(endTime) {
      let nowT = new Date().getTime();
      let endT = this.$util.getDateFromString(endTime) * 1000;
      if (nowT < endT) {
        this.endTime = endT - nowT;
      } else {
        this.getTimeTitle(endTime);
      }
    },
    /*活动结束*/
    finish() {
      this.getTimeTitle();
    },
    /*获取分享信息*/
    getShareFn(activityId, communityId) {
      let url =
        activityDetail +
        "?activityId=" +
        activityId +
        "&communityId=" +
        communityId;
      this.$http.get(url).then((res) => {
        let { status, data, result } = res.data;
        if (status == 200) {
          data.skuRuleModelList.map((item) => {
            item.groupbuySkuPicurl = item.groupbuySkuPicurl.split(",")[0];
          });
          this.shareData = data;
          this.getTimeTitle(data.groupbuyEndDatetime);
        } else {
          this.shareData = "";
          this.endTime = "";
        }
      });
    },
    /*立即购买*/
    buyButton(item) {
      /*webtype:0,1:vue-app环境;2,3:微信小程序环境*/
      let { shareData, param, communityId } = this;
      //   console.log(param, "param");
      //   if (this.$store.state.webtype == 3 || this.$store.state.webtype == 2) {
      let businessType = item.businessType;
      let obj = {
        businessTypeId: item.businessTypeId,
        spuId: item.spuId,
        endTime: shareData.groupbuyEndDatetime,
        groupShareCode: param.groupShareCode,
        communityId: communityId,
        activityId: param.activityId,
        headName: param.headName,
        headPhone: param.headPhone,
      };
      /*1：零售,3:家政,4：旅游*/
      switch (
        item.businessType //   /trave_share
      ) {
        case "TRAVEL":
          this.$router.push({
            path: "/travel_goods_detail",
            query: obj,
          });
          break;
        case "HOUSEKEEPING":
          this.$router.push({
            path: "/house_goods_detail",
            query: obj,
          });
          break;
        case "RETAIL":
          this.$router.push({
            path: "/h5_detail_hous",
            query: obj,
          });
          break;
      }
    },
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

.row {
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
}

.row_reseve {
  flex-direction: row-reverse;
  align-items: start;
}

.column {
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
}

.start {
  justify-content: start;
}

.center {
  justify-content: center;
}

.spacebwteen {
  justify-content: space-between;
}

.end {
  align-items: flex-end;
}

.flex {
  flex: 1;
}

.img {
  width: 100%;
  height: 100%;
}

.share {
  background-color: #F6F6F6;
  font-family: PingFangSC-Regular, PingFang SC;
  overflow-y: auto;

  .content {
    padding-top: 15px;
    font-size: 14px;
    font-family: PingFang SC;

    .rule {
      width: 72px;
      height: 24px;
      font-size: 11px;
      background: #DA003B;
      background: rgba(218, 0, 59, 1);
      border-radius: 24px 0px 0px 24px;
      color: #fff;
    }

    .activityName {
      margin-top: 20px;
      font-weight: bold;
      font-size: 17px;
      color: #FFFFFF;
    }

    .activeTime {
      height: 40px;
      background: linear-gradient(90deg, #DA003B 0%, #D7003A 100%);
      border-radius: 20px;
      margin: 20px 0;
      padding: 0 20px;
    }

    .goodPanel-remain {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 50px;
      width: 100%;

      .remain_title {
        font-size: 15px;
        font-weight: 400;
        color: #FFC9C9;
      }

      .remain-times {
        margin-left: 10.5px;
      }

      .colon {
        display: inline-block;
        margin: 0 4px;
        color: #fff;
      }

      .block {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        min-width: 24px;
        height: 25px;
        padding: 0 5px;
        box-sizing: border-box;
        background: #FFF7A4;
        border-radius: 3.5px;
        font-size: 15px;
        font-weight: 400;
        color: #B3002B;
        line-height: 25px;
        letter-spacing: 1px;
      }
    }

    .listBox {
      padding: 0 15px;
      width: 100%;
      box-sizing: border-box;

      .list {
        background: #fff;
        padding: 20px;
        border-radius: 8px;
        overflow: hidden;
        margin-bottom: 10px;

        .listinfo {
          font-size: 14px;
          line-height: 24px;
          color: #333333;
          margin-bottom: 16px;
        }

        .listimg {
          width: 98px;
          height: 98px;
          border-radius: 8px;
          margin-right: 5px;
          overflow: hidden;
        }

        .liimg {
          width: 86px;
          height: 86px;
          border-radius: 8px;
          margin-right: 14px;
          overflow: hidden;
        }

        .liinfo {
          margin-bottom: 10px;
          line-height: 20px;
        }

        .currentPrice {
          font-weight: bold;
          font-size: 14px;
          color: #000000;

          .buyerPrice {
            font-size: 18px;
          }
        }

        .oldPrice {
          font-size: 14px;
          color: #999;
          position: relative;
          margin-left: 5px;

          .priceLine {
            position: absolute;
            width: 100%;
            border-top: 1px solid #999;
            top: 6px;
          }
        }

        .priceIcon {
          // font-size: 12px;
        }

        .hasbuy {
          color: #FF3248;
          font-size: 12px;
          margin-top: 15px;
        }

        .liButton {
          width: 80px;
          height: 32px;
          background: linear-gradient(-31deg, #FF393E 0%, #FF2060 100%);
          border-radius: 16px;
          font-size: 14px;
          color: #fff;
        }
      }
    }
  }

  .dialog-mask {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0);
    margin-top: 60px;

    &-content {
      background: #fff;
      border-radius: 20px;
      width: 300px;

      .withdrawimg {
        width: 100%;
        height: 50px;
        color: #fff;
        font-size: 16px;
        padding: 0 10px;

        .iconBox {
          width: 30px;
          height: 30px;
        }
      }

      .ruleBox {
        padding: 25px 20px 35px 20px;
      }

      .vanbtn {
        width: 100px;
        height: 38px;
        background: #FFFFFF;
        border: 1px solid #FF393E;
        border-radius: 20px;
        color: #FF393E;
        margin-top: 30px;
      }

      .btnright {
        background: linear-gradient(90deg, #FF393E 0%, #FF2060 100%);
        color: #fff;
        margin-left: 15px;
      }
    }

    &-closeimg {
      width: 32px;
      height: 32px;
      margin-top: 40px;
    }
  }

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

          .van-count-down {
            display: inline-block;

            .colon {
              display: inline-block;
              margin: 0 2px;
              color: #ee0a24;
            }

            .block {
              min-width: 22px;
              display: inline-block;
              color: #fff;
              font-size: 10px;
              background-color: #ee0a24;
              border-radius: 5px;
              padding: 0 1px;
              text-align: center;
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
          border-radius: 50%;
          overflow: hidden;
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
        color: #f04052;
        // IOS兼容有问题
        // background: linear-gradient(180deg, #F7A1AA 0%, #B52232 100%);
        // -webkit-background-clip: text;
        // -webkit-text-fill-color: transparent;
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
          object-fit: cover;
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
        justify-content: flex-end;
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
            margin-top: 4px;
          }

          .user-image {
            width: 22px;
          }

          /deep/.user-image img {
            width: 22px;
            height: 22px;
            margin: 2px 8px 0 4px;
            border-radius: 50%;
          }

          /deep/.van-image__error {
            background-color: transparent;
          }

          /deep/.van-icon {
            font: initial;
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
          border-radius: 50%;
          margin-right: 10px;
          overflow: hidden;
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
        background-repeat: no-repeat;
        background-size: 21.5px 19.5px;
        background-position-x: 50%;
        background-position-y: 50%;
        margin-right: 10px;
        background-image: url('./images/car.png');
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
