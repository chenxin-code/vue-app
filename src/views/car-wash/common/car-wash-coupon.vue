<template>
  <div class="container">
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content>
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="loadMore">
        <ul class="coupon">
          <li class="item" v-for="(item,index) in couponSkuList" :key="index">
            <div class="titer">
              <p>{{item.skuName}}</p>
              <span class="text" v-html="item.couDesc"></span>
            <div class="amountBox">
              <span class="amountTip">￥</span>
              <span class="amount">{{$util.toDecimal2(item.salePrice)}}</span>
            </div>
            </div>
            <div class="selectImg">
              <span class="btn" @click="purchase(item)">购买</span>
            </div>
          </li>
        </ul>
      </van-list>
    </nav-content>
    <van-popup position="bottom" round class="buy-modal" v-model="isShowBuyModal" @closed='closed'>
      <div class="top">
        <p class="titer">购买洗车优惠券</p>
        <van-icon name="cross" color="#979797" size="18" @click="isShowBuyModal = false"/>
      </div>
      <span class="solid"></span>
      <div class="prod-info">
        <img src="../images/商品图.png" alt="" class="prod-img">
        <div class="right">
          <p class="name">{{purchaseGouponObj.skuName}}</p>
          <span class="price"><i>¥</i>{{$util.toDecimal2(purchaseGouponObj.salePrice)}}</span>
        </div>
      </div>
      <span class="solid"></span>
      <div class="purchase-quantity">
        <p class="title">购买数量</p>
        <van-stepper v-model="purchaseNum" :min="purchaseGouponObj.saleNumBegin" :max="purchaseGouponObj.saleNumMax" :step="purchaseGouponObj.saleNumStep"  disable-input integer class="reset-setpper"/>
      </div>
      <span class="solid"></span>
      <div class="modal-submit-btn">
        <van-button round block type="info" color="#FF6745" @click="settleCart">立即购买</van-button>
      </div>
    </van-popup>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isShowBuyModal: false,
      couponSkuList: [],
      purchaseGouponObj: {},
      purchaseNum: 1,
      loading: false,
      finished: false,
      pageInfo: {
        row: 10,
        page: 0
      }
    }
  },
  mounted() {

  },
  methods: {
    loadMore() {
      this.pageInfo.page++
      this.$Loading.open()
      this.$http.post('/app/json/app_selfservice_device/getWashCarCouponList', {
        ...this.pageInfo
      }).then(res => {
        this.loading = false
        this.$Loading.close()
        let data = res.data
        if (data.status == 0) {
          if (data.data instanceof Array && data.data.length > 0) {
            this.couponSkuList.push(...data.data)
            // if (this.couponSkuList.length > data.data)
            this.finished = true
          } else {
            this.finished = true
          }
        } else {
          this.$Toast(data.info)
          this.finished = true
        }
      }).catch(err => {
        this.finished = true
        this.$Loading.close()
        this.$Toast(`getWashCarCouponList err ${err}`)
      })
    },
    purchase(item) {
      this.getAppProDetail({skuId: item.skuId, deliverType: 2})
    },
    getAppProDetail(obj) {
      this.$Loading.open()
      this.$http.post('/app/json/product/getAppProDetail', obj).then(res => {
        this.$Loading.close()
        let data = res.data
        if (data.status == 0) {
          this.purchaseGouponObj = data.data || {}
          this.isShowBuyModal = true
        } else {
          this.$Toast(data.info)
        }
      }).catch(err => {
        this.$Loading.close()
        this.$Toast(`getAppProDetail err ${err}`)
      })
    },
    closed() {
      this.isShowBuyModal = false
      this.purchaseNum = 1
    },
    settleCart() {
      let paramsData = {
        token: this.$store.state.login.token,
        carts: [{
          skuId: this.purchaseGouponObj.skuId,
          storeOuCode: this.purchaseGouponObj.storeOuCode,
          number: this.purchaseNum,
          checked: '1'
        }],
        deliveryType: this.purchaseGouponObj.deliveryType,
        userAddress: this.$store.state.mall2.selectAddress,
        pickupId: this.$store.state.mall2.zitiAddress.id
      };
      if (this.purchaseGouponObj.deliveryType == 2) {
        if (this.$store.state.mall2.selectAddress.id > 0) {
          paramsData.userAddressId = this.$store.state.mall2.selectAddress.id
        }
      }
      this.$Loading.open()
      this.$http.post('/app/json/app_cart/SettleCart', paramsData).then(res => {
        this.$Loading.close()
        let data = res.data
        if (data.status == 0) {
          let params = {
            res: data.data,
            paramsData: paramsData,
            deliveryType: this.purchaseGouponObj.deliveryType,
            skuCode: this.purchaseGouponObj.skuCode, // 商品编码
            storeOuCode: this.purchaseGouponObj.storeOuCode, // 店铺编码
          };
          if (!(this.$store.state.mall2.selectAddress.id > 0) && this.purchaseGouponObj.deliveryType == 2) {
            if (this.matchAddress) {
              this.$store.state.mall2.selectAddress = this.matchAddress;
              this.$bridgefunc.vuexStorage(() => {
              })
            } else {
              params.noMatch = true;
            }
          }
          this.closed()
          if (this.$mallCommon.isExistCanNotAttendActivity(data.data.occur) == true) {
            this.$MessageBox.confirm('部分商品不能参加活动</br>将按原价购买，是否继续？', '提示', {confirmButtonText: '确定'}).then(action => {
              this.$router.replace({
                name: '填写订单',
                params: params
              })
            }).catch(action => {
            });
          } else {
            this.$router.replace({
              name: '填写订单',
              params: params
            })
          }
        } else {
          this.$Toast(data.info)
        }
      }).catch(err => {
        this.$Loading.close()
        this.$Toast(`SettleCart err ${err}`)
      })
    }
  }
}
</script>
<style lang="stylus" scoped>
@import '~@/common/stylus/mixin.styl';

.coupon {
  width: 100%;
  padding 0 15px;

  .item {
    width: 100%;
    height: 90px;
    margin: 10px 0;
    padding: 14px 22px;
    background-image: url('../images/券底图.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .titer {
      height: 100%;
      width: calc(100% - 80px);
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      p {
        width: 100%;
        font-size: 15px;
        font-weight: 500;
        ellipse();
      }

      .text {
        color: #999;
        width: 100%;
        line-height: 18px;
        ellipse();
      }

      .amountBox {
        color: #FF6745;

        .amountTip {
          font-weight: 500;
        }

        .amount {
          font-weight: 500;
          font-size: 15px;
        }
      }
    }

    .selectImg {
      width: 60px;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;

      .btn {
        width: 52px;
        height: 26px;
        color: #fff;
        line-height: 26px;
        text-align: center;
        display: inline-block;
        border-radius: 50px;
        background-color: #FF6745;
      }
    }
  }

  .coupon-center {
    color: #999999;
    width: 100%;
    height: 90px;
    text-align: center;
    background-image: url('../images/券底图.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    text-align: center;
    line-height: 90px;
  }
}

.buy-modal {
  width 100%
  padding 25px 20px 0;
  .solid {
    width 100%
    height 0.5px
    margin 14px 0
    display inline-block
    background-color #DCDCDC
  }
  .top {
    display flex
    justify-content space-between
    align-items center
    .titer {
      font-size: 15px
      font-weight 500
    }
  }

  .prod-info {
    display flex;
    .prod-img {
      display block;
      width 70px;
      height 70px;
      border-radius 5px;
    }
    .right {
      flex 1;
      display flex;
      padding-top 2px
      padding-bottom 2px
      padding-left 10px;
      flex-direction column;
      justify-content space-between;
      .name {
        font-weight 500;
        font-size 15px;
        line-height 18px;
        ellipse-2();
      }
      .price {
        font-size 16px;
        font-weight 500
        color rgb(255, 103, 69);
        i {
          font-weight 500
          font-size 12px;
          font-style normal
          margin-right 2px
        }
      }
    }
  }
  .purchase-quantity {
    display flex;
    justify-content space-between;
    align-items center;
    .title {
      font-size 14px;
      font-weight 500;
    }
    .reset-setpper {
      display flex;
      align-items center;
      /deep/ .van-stepper__minus,
      /deep/ .van-stepper__plus {
        font-size 15px;
        background-color: #FFF;
        border 1px solid #ddd;
        width 33px;
      }
      /deep/ .van-stepper__input {
        margin 0;
        border-top 1px solid #ddd;
        border-bottom 1px solid #ddd;
        background-color: #FFF;
      }
    }
  }
  .modal-submit-btn {
    font-weight 500
    // margin-top 54px;
    margin-bottom 10px;
  }
}
</style>