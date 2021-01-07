<template>
  <div class="placeorder mall2">
    <nav-top title="礼单详情" @backEvent="$router.go(-1)"></nav-top>
    <nav-content>
      <div class="flex-div">
        <div class="scroll-div">
          <div class="block-div no-padding-bottom">
            <div @click="toSelectAddress">
              <div class="flex-row">
                <div class="name theme_font_black">{{$store.state.mall2.selectAddress.receiverName}}</div>
                <div class="name theme_font_black">{{$store.state.mall2.selectAddress.mobile}}</div>
                <div class="act-item-full theme_standard_bg theme_font_white"
                     v-if="$store.state.mall2.selectAddress.isDefault == 1">默认
                </div>
              </div>
              <div class="flex-row">
                <div class="full theme_font_tint font-small">{{$store.state.mall2.selectAddress.addressFull}}
                </div>
                <div>
                  <i class="iconfont mall-gengduojiantou theme_font_tint icon-font"></i>
                </div>
              </div>
            </div>
            <div v-if="(!($store.state.mall2.selectAddress.id > 0)) && deliveryType == 2" @click="toSelectAddress">
              <div class="flex-row">请选择地址信息</div>
            </div>
            <div class="colorfulline">
              <img src="static/image/mall2/colorfulline.png"/>
            </div>
          </div>
          <div class="block-div">
<!--            <p class="institution-name">{{ goodsDetails.storeName }}</p>-->
            <div class="prod-container">
              <img :src="goodsDetails.goodsImg" alt="" class="prod-img">
              <div class="right">
                <p class="prod-name">{{ goodsDetails.goodsName }}</p>
                <span class="prod-num">x 1</span>
              </div>
            </div>
            <div class="flex-row">
              <div class="label-middle theme_font_common">备注</div>
              <div class="full">
                <input class="row-input theme_font_common" placeholder="请留下您想说的话" v-model="remark"/>
              </div>
            </div>
          </div>
        </div>
        <div class="btns-receive btns">
          <div @click="receiveGiftBtn">立即领取</div>
        </div>
      </div>
    </nav-content>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        deliveryType: '',
        giftOrderDetails: {},
        remark: '',
        goodsDetails: {}
      }
    },
    created() {
      this.deliveryType = this.$route.query.deliveryType
        ? this.$route.query.deliveryType
        : "2";
    },
    mounted() {
      console.log(this.$route.query)
      this.goodsDetails = JSON.parse(this.$route.query.goodsDetails)
    },
    methods: {
      toSelectAddress: function () {
        this.$router.push({
          path: "/mall2/addresslist"
        });
      },
      receiveGiftBtn() {
        this.$request.post('/app/json/app_send_gift_order/getGitf', {
          userId: this.$route.query.userId,
          orderId: this.$route.query.orderId,
          receiveAddress: this.$store.state.mall2.selectAddress.addressFull,
          receivePhone: this.$store.state.mall2.selectAddress.mobile,
          receiveName: this.$store.state.mall2.selectAddress.receiverName,
          message: this.remark,
          userAddress: this.$store.state.mall2.selectAddress
        }).then((res) => {
          if (res.status === 0) {
            this.$router.replace({
              path: '/receive-gift',
              query: {
                userId: this.$route.query.userId,
                orderId: this.$route.query.orderId,
                orderType: this.$route.query.orderType
              }
            })
            this.repla
          } else {
            this.$Toast(res.info)
          }
        })
      }
    },
  }
</script>
<style lang='stylus' scoped rel='stylesheet/stylus'>
  @import '~@/common/stylus/variable.styl';
  @import '~@/common/stylus/mixin.styl';

  .placeorder {
    width: 100%;
    height: 100%;
    overflow: hidden;

    .pick-up-tip {
      line-height: 1.4;
      margin: -5px 0px;
      color: red;
    }

    .points-rule-btn {
      margin: -10px 0;
      padding: 10px 0;
    }

    .pickup-shop {
      display: flex;
      align-items: center;
    }

    .flex-div {
      height: 100%;
      display: flex;
      flex-direction: column;

      .scroll-div {
        flex: 1;
        overflow-x: hidden;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;

        .prod-container {
          display: flex;
          margin: 10px 0;

          .prod-img {
            display: block;
            width: 80px;
            height: 80px;
          }

          .right {
            padding-left: 10px;
            font-size: 14px;
            flex: 1;
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: space-between;

            .prod-name {
              line-height: 20px;
              ellipse-2();
              margin-top: 12px;
            }

            .prod-price {
              font-size: 12px;
              color: $color-theme-r;
              margin-bottom: 12px;

              span {
                font-size: 15px;
              }
            }

            .prod-num {
              position: absolute;
              right: 0;
              bottom: 12px;
            }
          }
        }

        .prod-container {
        }
      }

      .btns {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        height: 45px;
        line-height: 45px;
        font-size: 14px;
        text-align: center;
        background: red;
        color: #fff;
      }
    }
  }
</style>
