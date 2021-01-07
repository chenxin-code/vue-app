/**Created by liaoyingchao on 2020-06-30.*/

<template>
  <div class="exchagne-coupon mall2" v-if="visible">
    <pop-view ref="myPop" v-if="visible" @closeEvent="visible = false">
      <div class="pop-body">
        <div class="pop-title theme_font_common">{{provinceType == 1 ? '兑换加油券' : '兑换加油金'}}</div>
        <div class="pop-scroll-div">
          <div class="coupon">
            <div class="left">
              <img class="bg-img" src="static/images/hk/coupon-bg-2.png">
              <div class="coupon-info">
                <div class="couFaceValue">{{exchangeData.skuPropValues || 0+'元'}}</div>
                <div class="name single-line">{{exchangeData.spuName || exchangeData.shortName || '石化加油金'}}</div>
              </div>
            </div>
            <div class="right">
              <div class="name double-line">{{exchangeData.showTitle}}</div>
              <div class="price single-line">兑换价：
                <PriceOrder :listitem="exchangeData" :isRMBEnd="true"></PriceOrder>
              </div>
            </div>
          </div>
          <div class="detail">
            <div class="count-line">
              <div class="full theme_font_common">购买数量</div>
              <van-stepper v-model="selectedNum" :min="minNum" :max="maxNum" :step="stepNum" @plus="numChange" @minus="numChange" @blur	="numBlur" integer/>
            </div>
            <!--<div class="title">详情</div>-->
            <!--<div class="detail-info" v-html="introduction1"></div>-->
          </div>
        </div>
        <div class="bottom-div">
          <div class="tip line_bottom">您当前账户还有{{getAssetsValue({rewardType: '100'})}}{{excTypeName(exchangeData)}}</div>
          <div class="exchange-event">
            <div class="left">
              <div class="amount">
                <div class="text">合计：</div>
                <div class="price">
                  <div class="rmb-div" v-if="Object.keys(occurData).length">
                    <span class="" v-show="getOccurShowPrice(occurData)">￥</span>
                    <span class="left-no-space price-big "
                          v-show="getOccurShowPrice(occurData)">{{getTotalPriceDuan(0)}}</span>
                    <span class=""
                          v-show="getOccurShowPrice(occurData)">.{{getTotalPriceDuan(1)}}</span>
                    <div class="digital-div" v-for="(digital,digitalindex) in occurData.digitalList"
                         v-if="getTotalUsePoints(digital)>0">

                <span class="price-big "
                      v-if="digitalindex != getFirstVartualIndex(occurData) || getOccurShowPrice(occurData) ">+</span>
                      <span class="price-big ">{{getTotalUsePoints(digital)}}</span>
                      <span class="">{{getTotalUnitStr(digital.acctType)}}</span>
                    </div>
                  </div>

                </div>
              </div>
            </div>
            <div class="btn" @click="redeemNow(detailData)">确认兑换</div>
          </div>
        </div>
      </div>
    </pop-view>
  </div>
</template>

<script>
  import Loading from '@/components/Vendor/Loading/index'
  import Toast from '@/components/Vendor/toast/index'
  import http from "@/utils/http";
  import util from "../../../utils/util";
  import store from "../../../vuex/store";
  import router from '@/router'
  import DigitalPwd from "@/components/mall2/common/digital-pwd";
  import md5String from "../../../utils/md5";
  import PriceOrder from '@/components/commonui/price/price-order'
  import mallCommon from "../../../utils/mall2";

  export default {
    name: "exchange-pop",
    components: {
      PriceOrder
    },
    data() {
      return {
        visible: false,
        exchangeData: {},
        detailData: {},
        amount: 0,
        stockNum: 99,
        selectedNum: 1,
        minNum: 1,
        maxNum: 99,
        stepNum: 1,
        introduction1: '',
        digitalPWD: '',
        occurData: {},
        exchangeSuccess: function () {
          console.log('exchanges success!')
        },
        provinceType: 0, // 0 北京 1 广东
      }
    },
    methods: {
      getTotalUnitStr: function (d) {
        return mallCommon.getTotalUnitStr(d)
      },
      getOccurShowPrice: function (d) {
        return mallCommon.getOccurShowPrice(d)
      },
      getTotalUsePoints: function (d) {
        return mallCommon.getTotalUsePoints(d)
      },
      getFirstVartualIndex: function (d) {
        return mallCommon.getFirstVartualIndex(d)
      },
      getTotalPriceDuan: function (index) {
        let str = util.toDecimal2(this.occurData.payAmount);
        let arr = str.split(".");
        return arr[index];
      },
      // 重新结算
      _reSettleCart: function (carts, cardNo) {
        Loading.open();
        let url = "/app/json/fee_life_order/settle";
        let paramsData = {
          deliveryType: 2
        }
        paramsData.carts = [{
          number: this.selectedNum,
          skuId: this.detailData.skuId,
          storeOuCode: this.detailData.storeOuCode,
          selfActivityId: this.detailData.activityId,
          checked: 1
        }];
        paramsData.couNo = ['-1'];

        http.post(url, paramsData).then(
          res => {
            Loading.close();
            let data = res.data;
            if (data.status == 0) {
              this.occurData = data.data.occur[0];
            } else {
              Toast(data.info);
            }
          },
          error => {
            Loading.close();
            Toast("请求数据失败！");
          }
        );
      },
      // submit
      submit: function () {
        Loading.open();
        let paramsData = {
          deliveryType: 2
        }
        paramsData.carts = [{
          number: this.selectedNum,
          skuId: this.detailData.skuId,
          storeOuCode: this.detailData.storeOuCode,
          selfActivityId: this.detailData.activityId,
          checked: 1
        }];
        // paramsData.couNo = ['-1'];
        if (this.digitalPWD != "") {
          paramsData.payPwd = md5String(this.digitalPWD);
        }

        let digitalList = this.occurData.digitalList

        paramsData.payDigital = digitalList;

        this.$http.post('/app/json/fee_life_order/submit', paramsData).then(res => {
          let data = res.data
          if (data.status == 0) {
            this.$refs.myPop.closeEvent()
            Toast('兑换成功')
            this.exchangeSuccess()
          } else {
            Toast(data.info)
          }
          Loading.close()
        })
      },
      checkNeedPwd: function () {
        this.digitalPWD = "";
        let occurData = this.occurData
        console.log(occurData)
        if (occurData.needPayPwd) {
          // 是否需要支付密码
          let hasDigitail = true;
          if (hasDigitail) {
            // 是否需要虚拟支付
            if (occurData.payPwdState == "1") {
              Toast("支付密码已锁定，请稍后再试！");
              return;
            }
            DigitalPwd.open({
              initData: {
                payPwdState: occurData.payPwdState
              },
              toSettingPwd: () => {
                router.push({
                  path: "/usercenter/nosetpwd",
                  query: {
                    isSet: 0
                  }
                });
                DigitalPwd.close();
                this.visible = false
              },
              inputFinished: value => {
                this.digitalPWD = value;
                this.submit();
                DigitalPwd.close();
              }
            });
          } else {
            this.submit();
          }
        } else {
          this.submit();
        }
      },
      // 立即兑换
      redeemNow(item) {

        if (item.distCntCurUser >= item.discountGoodsCntPerUser) {
          this.$Toast(`每人限购${item.discountGoodsCntPerUser}个，您已到达上限，去看看其它商品吧！`)
        } else if (item.remainNum == 0) {
          this.$Toast('已售完')
        } else if (item.selfSoldNum == 100) {
          this.$Toast('今日可领取次数已用尽')
        } else {
          this.checkNeedPwd();
        }
      },
      numBlur: function () {
        this._reSettleCart()
      },
      numChange: function () {
        if (this.myTimer) {
          clearTimeout(this.myTimer)
          this.myTimer = null
        }

        this.myTimer = setTimeout(() => {
          this._reSettleCart()
        }, 300)
      },
      getAssetsValue: function (item) {

        if (item.rewardType) {
          let rewardList = store.state.mall2.myAssets.rewardList
          for (let i = 0; rewardList && i < rewardList.length; i++) {
            if (rewardList[i].rewardsSurplusOrderType == item.rewardType) {
              return rewardList[i].rewardsSurplus
            }
          }
          return '0'
        }

        return store.state.mall2.myAssets[item.countKey]
      },
      excTypeVal(item) {
        if (item.activityTags.indexOf('YouDouExCoupon') >= 0) {
          return item.perDiscountEmpRewardsPrice
        } else if (item.activityTags.indexOf('RewardExCoupon') >= 0) {
          return item.perDiscountRewardsPrice
        }
        return item.points
      },
      excTypeName(item) {
        let name = ''
        if (item.activityTags.indexOf('YouDouExCoupon') >= 0) {
          name = store.state.globalConfig.Employees_wallet || '福豆'
        } else if (item.activityTags.indexOf('RewardExCoupon') >= 0) {
          name = store.state.globalConfig.Employees_wallet || '福豆'
        } else {
          name = '优客点'
        }
        return name
      },
      // 请求详情信息
      _getProductDetail: function () {
        Loading.open();
        let url = '/app/json/product/getAppProDetail';
        let paramsData = {
          productType: this.exchangeData.productType,
          skuId: this.exchangeData.skuId,
          deliverType: this.exchangeData.deliveryType,
          activityId: this.exchangeData.activityId,
        };
        paramsData.id = this.exchangeData.id

        http.post(url, paramsData).then(
          res => {
            Loading.close();
            let data = res.data;
            if (data.status == 0) {
              this.detailData = data.data;
              if (this.detailData.remainNum === 0) {
                Toast('活动商品库存已售空，需原价购买！')
              }
              if (this.selectedNum < this.detailData.saleNumBegin) {
                this.selectedNum = this.detailData.saleNumBegin != '' ? this.detailData.saleNumBegin : 1
              }
              this.stepNum = this.detailData.saleNumStep != '' ? this.detailData.saleNumStep : 1
              this.minNum = this.detailData.saleNumBegin != '' ? this.detailData.saleNumBegin : 1
              this.maxNum = this.detailData.saleNumMax != '' ? this.detailData.saleNumMax : -1
              if (this.detailData.discountGoodsCntPerOrder != undefined && this.detailData.discountGoodsCntPerOrder != '') {
                if (this.maxNum > this.detailData.discountGoodsCntPerOrder) {
                  this.maxNum = this.detailData.discountGoodsCntPerOrder
                }
              }
              this.mktStockNum = this.detailData.mktStockNum != '' ? this.detailData.mktStockNum : -1
              this.introduction1 = this.detailData.proSkuMediaModel.mobileDetail.replace(/\<title\>.*\<\/title\>/, '')
              // 这里是临时匹配某些京东商品详情，去掉写死的宽高样式
              this.introduction1 = util.removeWidthAndHeight(this.introduction1)

              this.id = this.detailData.id

              // this.amount = this.selectedNum * this.excTypeVal(this.exchangeData)
              this._reSettleCart()
            } else {
              Toast(data.info);
            }
          },
          error => {
            Loading.close();
            Toast('请求数据失败！')
          }
        );
      },
      open: function () {
        this.visible = true;
        this._getProductDetail();
      },
    },
    created() {
      if (util.getShortName(store.state.indexData.province) == '广东') {
        this.provinceType = 1
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .exchagne-coupon {

    .coupon {
      display flex;
      align-items center;

      .left {
        position relative;
        width 120px;
        text-align center;

        img {
          width 100%;
        }

        .coupon-info {
          position absolute;
          left 0;
          right 0;
          top 0;
          bottom 0;
          padding 10px;

          .couFaceValue {
            margin-top 6px;
            font-size 14px;
            font-weight 600;
            color #FD6802;
          }

          .name {
            margin-top 10px;
            font-size 14px;
            color #FD6802;
          }
        }
      }

      .right {
        flex 1;
        overflow hidden;
        padding-left 10px;

        .name {
          font-size 16px;
          line-height 20px;
        }

        .price {
          //color #FD6802 !important;
          margin-top 10px;
          >>>.theme_font_red {
            color #FD6802
          }
        }
      }
    }

    .detail {
      padding 6px;

      .title {
        font-size 16px;
      }

      .detail-info {
        margin 10px 0;
      }
    }

    .bottom-div {
      .tip {
        text-align center;
        background-color #FCF4E6;
        color #FD6802
        padding 10px;
      }

      .exchange-event {
        display flex;
        align-items center;
        justify-content space-between;
        padding 10px;

        .left {
          .number {
            display flex;
            align-items center;
          }

          .amount {
            display flex;
            align-items center;

            .text {
              font-weight 500;
              font-size 16px;
            }

            .price {
              color #FD6802;
              overflow: hidden;
              // line-height 50px;
              font-size: 0px;
              display: flex;
              flex-direction: column;
              justify-content: center;

              .digital-div {
                padding-top: 3px;
                display: inline-block;
                font-size: 0px;

              }

              span {
                font-size: 14px;
                margin: 0;
                padding: 0;
              }

              .price-big {
                font-size: 20px;
              }
            }

          }
        }

        .btn {
          background-color #FD6802;
          padding 10px 15px;
          border-radius 5px;
          color white;
          font-size 16px;
        }
      }
    }
  }
</style>
