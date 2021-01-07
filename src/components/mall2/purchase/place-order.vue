/**Created by liaoyingchao on 2019-04-26.*/

<template>
  <div class="place-order mall2">
    <nav-top @backEvent="backEvent"></nav-top>
    <nav-content>
      <div class="scroll-div">
        <div class="block-div no-padding-bottom">
          <div v-if="$store.state.mall2.selectAddress.id > 0 && deliveryType == 2" @click="toSelectAddress">
            <div class="flex-row">
              <div class="name theme_font_black">{{$store.state.mall2.selectAddress.receiverName}}</div>
              <div class="name theme_font_black">{{$store.state.mall2.selectAddress.mobile}}</div>
              <div class="act-item-full theme_bg_red theme_font_white"
                   v-if="$store.state.mall2.selectAddress.isDefault == 1">默认
              </div>
            </div>
            <div class="flex-row">
              <div class="full theme_font_tint font-small">{{$store.state.mall2.selectAddress.addressFull}}</div>
              <div>
                <i class="iconfont mall-gengduojiantou theme_font_tint icon-font"></i>
              </div>
            </div>
          </div>
          <div v-if="(!($store.state.mall2.selectAddress.id > 0)) && deliveryType == 2" @click="toSelectAddress">
            <div class="flex-row">
              请选择地址信息
            </div>
          </div>
          <div v-if="$store.state.mall2.zitiAddress.id > 0 && deliveryType == 1" @click="toSelectZitiAddress">
            <div class="pickup-shop">
              <div style="flex: 1;">
                <div class="flex-row">
                  <div class="name theme_font_black">自提店铺：{{$store.state.mall2.zitiAddress.storeName}}</div>
                </div>
                <div class="flex-row">
                  <div class="full theme_font_tint font-small" style="line-height: 1.4;">
                    {{$store.state.mall2.zitiAddress.addressFull}} {{$store.state.mall2.zitiAddress.phone &&
                    $store.state.mall2.zitiAddress.phone != '' ? '('+$store.state.mall2.zitiAddress.phone+')' : ''}}
                  </div>
                </div>
              </div>
              <div>
                <i class="iconfont mall-gengduojiantou theme_font_tint icon-font"></i>
              </div>
            </div>
          </div>
          <div class="colorfulline">
            <img src="static/image/mall2/colorfulline.png"/>
          </div>
        </div>
        <div v-if="pageType == 2">
          <div class="block-div">
            <div class="flex-row" @click="payWayPopShow = true">
              <div class="label-middle theme_font_common">支付方式</div>
              <div class="full"></div>
              <div class="theme_font_common right-margin">{{payWayText}}</div>
              <div>
                <i class="iconfont mall-gengduo more-icon theme_font_tint"></i>
              </div>
            </div>
          </div>
          <div class="block-div theme_bg_white">
            <div class="flex-row">
              <div class="theme_font_gray full">预约单联系方式</div>
            </div>
            <div class="flex-row">
              <div class="label theme_font_common">姓名</div>
              <div class="full input-bg">
                <input v-model="name" placeholder="请输入您的姓名"/>
              </div>
            </div>
            <div class="flex-row">
              <div class="label theme_font_common">联系电话</div>
              <div class="full input-bg">
                <input type="tel" v-model="phone" placeholder="请输入手机号码" maxlength="11" onkeypress='return( /[\d]/.test(String.fromCharCode(event.keyCode)))' pattern="[0-9]*" @input="phone = /^\d+/.exec(phone) ? /^\d+/.exec(phone)[0] : ''">
              </div>
            </div>
          </div>
          <div class="block-div theme_bg_white">
            <div class="pro-row">
              <div class="img-div">
                <img :src="this.img">
              </div>
              <div class="info-div">
                <div class="title theme_font_black">{{showTitle}}</div>
                <div class="price theme_font_red">
                  <div class="price-item" v-for="(price, idx) in getPrices()">
                    <span class="xian" v-if="idx != 0"> ~ </span>
                    <span>¥</span>
                    <span class="big">{{price.iNum}}.</span>
                    <span>{{price.dNum}}</span>
                  </div>
                  <div class="theme_font_gray" style="text-align: right;flex: 1;">x {{number}}</div>
                </div>
              </div>
            </div>
            <div class="flex-row">
              <div class="label theme_font_common">备注</div>
              <div class="full input-bg">
                <input v-model="remark" placeholder="请留下您想说的话"/>
              </div>
            </div>
          </div>
          <div class="block-div theme_bg_white">
            <div class="flex-row">
              <div class="label theme_font_gray">订单金额</div>
              <div class="full"></div>
              <div class="theme_font_red total"><span class="font-small">¥</span> {{$util.toDecimal2(this.price * this.number)}}</div>
            </div>
          </div>
        </div>
        <div v-else>
          <div class="block-div theme_bg_white">
            <div class="flex-row">
              <div class="theme_font_gray full">预约单联系方式</div>
            </div>
            <div class="flex-row">
              <div class="label theme_font_common">姓名</div>
              <div class="full input-bg">
                <input v-model="name" placeholder="请输入您的姓名"/>
              </div>
            </div>
            <div class="flex-row">
              <div class="label theme_font_common">联系电话</div>
              <div class="full input-bg">
                <input type="tel" v-model="phone" placeholder="请输入手机号码" maxlength="11" onkeypress='return( /[\d]/.test(String.fromCharCode(event.keyCode)))' pattern="[0-9]*" @input="phone = /^\d+/.exec(phone) ? /^\d+/.exec(phone)[0] : ''">
              </div>
            </div>
          </div>
          <div class="block-div theme_bg_white">
            <div class="pro-row">
              <div class="img-div">
                <img :src="this.img">
              </div>
              <div class="info-div">
                <div class="title theme_font_black">{{showTitle}}</div>
                <div class="price theme_font_red">
                  <div class="price-item" v-for="(price, idx) in getPrices()">
                    <span class="xian" v-if="idx != 0"> ~ </span>
                    <span>¥</span>
                    <span class="big">{{price.iNum}}.</span>
                    <span>{{price.dNum}}</span>
                  </div>
                  <div class="theme_font_gray" style="text-align: right;flex: 1;">x {{number}}</div>
                </div>
              </div>
            </div>
            <div class="flex-row">
              <div class="label theme_font_common">备注</div>
              <div class="full input-bg">
                <input v-model="remark" placeholder="请留下您想说的话"/>
              </div>
            </div>
          </div>
          <div class="block-div theme_bg_white">
            <div class="flex-row">
              <div class="label theme_font_gray">订单金额</div>
              <div class="full"></div>
              <div class="theme_font_red total"><span class="font-small">¥</span> {{$util.toDecimal2(this.price * this.number)}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="bottom-div">
        <div class="btn theme_bg_red" @click="submitOrder">提交订单</div>
        <div class="other">
          <div class="theme_font_red total"><span class="font-small">¥</span> {{$util.toDecimal2(this.price * this.number)}}</div>
        </div>
      </div>
      <pop-view v-if="payWayPopShow" @closeEvent="payWayPopShow = false">
        <div class="pop-body">
          <div class="pop-title theme_font_common">请选择支付方式</div>
          <div class="items-div pop-scroll-div">
            <div
              class="item theme_font_common theme_bg_white_ef"
              :class="{theme_light_bg: payWaySelected == payway.tag, theme_standard_font_i: payWaySelected == payway.tag, theme_standard_bdr_i: selectedPayWay.tag == payway.tag}"
              @click="payWayEvent(payway)"
              v-for="payway in payWays"
            >{{payway.text}}
            </div>
          </div>
          <div
            class="bottom-btn theme_font_white theme_standard_bg bottom-space"
            @click="popSureEvent"
          >确定
          </div>
        </div>
      </pop-view>
    </nav-content>
  </div>
</template>

<script>
  import purchase from './js/index'

  export default {
    name: "place-order",
    components: {},
    data() {
      return {
        number: 1,
        img: '',
        showTitle: '',
        price: 0,
        name: '',
        phone: '',
        proId: '',
        remark: '',
        deliveryType: '',
        pageType: '1',
        carts: [],
        microStoreCode: '',
        payWayPopShow: false,
        selectedPayWay: {},
        payWays: [
          {
            text: "在线支付",
            tag: "1"
          },
          {
            text: "货到付款",
            tag: "0"
          },
          {
            text: "提货付款",
            tag: "0"
          }
        ],
      }
    },
    methods: {
      payWayEvent: function (payway) {
        if (payway.tag == 0) {
          this.$Toast("暂不支持！");
          return;
        }
        this.selectedPayWay = payway
      },
      backEvent: function () {
        this.$router.go(-1)
      },
      toSelectZitiAddress: function () {
        let skuIds = [this.proId]
        this.$router.push({
          path: '/mall2/mypickupaddress',
          query: {
            skuIds: JSON.stringify(skuIds)
          }
        })
      },
      toSelectAddress: function () {
        this.$router.push({
          path: '/mall2/addresslist'
        })
      },
      settleCart: function () {
        let url = '/app/json/app_purchase_order/settleCart'
        let paramsData = {
          deliveryType: this.deliveryType,
          carts: this.carts,
          microStoreCode: this.microStoreCode
        };
        if (this.deliveryType == 1) {
          paramsData.pickupId = this.$store.state.mall2.zitiAddress.id
        } else {
          paramsData.userAddressId = this.$store.state.mall2.selectAddress.id
        }
        this.$http.post(url, paramsData).then(
          res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              this.$router.replace({
                path: '/mall2/submitfinished',
                query: data.data
              })
            } else {
              this.$Toast(data.info);
            }
          },
          error => {
            this.$Loading.close();
            this.$Toast('请求数据失败！')
          }
        );
      },
      submitOrder: function () {
        if (this.name == '' || this.phone == '') {
          this.$Toast('请完善预约单信息')
          return
        }
        let url = '/app/json/app_purchase_order/submitOrder'
        let paramsData = {
          token: this.$store.state.login.token,
          skuId: this.proId,
          buyCount: this.number,
          deliverType: this.deliveryType,
          subscOrdReceiver: this.name,
          subscOrdMobile: this.phone,
          Remark: this.remark
        };
        if (this.deliveryType == 1) {
          paramsData.pickupId = this.$store.state.mall2.zitiAddress.id
        } else {
          paramsData.userAddressId = this.$store.state.mall2.selectAddress.id
        }
        this.$http.post(url, paramsData).then(
          res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              this.$router.replace({
                path: '/mall2/submitfinished',
                query: data.data
              })
            } else {
              this.$Toast(data.info);
            }
          },
          error => {
            this.$Loading.close();
            this.$Toast('请求数据失败！')
          }
        );
      },
      getPrices: function () {
        let arr = [{
          price: this.price
        }]
        return purchase.getPriceShow(arr)
      },
    },
    created() {
      this.phone = this.$store.state.login.phone ? this.$store.state.login.phone : ''
      this.name = this.$store.state.userInfo.nickName ? this.$store.state.userInfo.nickName : ''
      this.proId = this.$route.query.id
      this.number = this.$route.query.number
      this.img = this.$route.query.img
      this.showTitle = this.$route.query.showTitle
      this.price = this.$route.query.price
      this.deliveryType = this.$store.state.mall2.staticDeliverType
      this.pageType = this.$route.query.pageType || '1'
      if (this.pageType == '2') {
        this.carts = JSON.parse(this.$route.query.carts)
        this.microStoreCode = this.$route.query.microStoreCode || ''
        this.settleCart()
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .place-order {
    width 100%
    height 100%
    overflow hidden
    .scroll-div {
      position absolute;
      left 0;
      right 0;
      top 0;
      bottom 48px;
      overflow-y auto;
      -webkit-overflow-scrolling touch;

      .pickup-shop {
        display flex;
        align-items center;
      }

      .colorfulline {
        margin 0 -8px;
        height 3px;

        img {
          width 100%;
          height 100%;
          display block;
        }
      }

      .input-bg {
        margin-right 5px;
        border-radius 20px;
        background-color #efefef;
        padding 0 15px;
        input {
          width 100%;
          height 34px;
          background none;
          border none;
        }
      }
      .total {
        font-size 18px;
      }
      .price {
        font-size 12px;
        display flex;
        align-items center
        font-weight 500;

        .price-item {
          display flex;
          align-items flex-end;
          line-height 1;

          .xian {
            font-size 16px;
            padding 0 2px;
          }

          .big {
            font-size 20px;
          }
        }
      }
    }
    .bottom-div {
      position absolute;
      left 0;
      right 0;
      bottom 0px;
      height 48px;
      z-index 1;
      box-shadow 0 -1px 8px #eee;
      line-height 48px;
      .btn {
        height 48px;
        float right;
        padding 0 30px;
        font-size 18px;
        font-weight 500;
        color white;
      }
      .other {
        overflow hidden;
        padding 0 15px;
        .total {
          font-size 18px;
        }
      }
    }
  }
</style>
