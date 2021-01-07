/**Created by liaoyingchao on 2020-09-07.*/

<template>
  <div class="btn-product" :style="getFloatUp">
    <div class="content-div">
      <div class="left-btn" :class="hotareaClass({idCode: moduleData.idCode + 'leftBtnEvent'})" :style="getLeftBtnStyle" @click="hotEvent('leftBtnEvent');leftBtnEvent();">
        <img :src="moduleData.leftBtnImg">
      </div>
      <div class="btn-label" :class="hotareaClass({idCode: moduleData.idCode + 'buyEvent'})" :style="getSidesStyle" @click="hotEvent('buyEvent');buyEvent()">
        <span>{{getLabelText}}</span>
        <span class="line-text">{{moduleData.lineText}}</span>
      </div>
    </div>
    <div class="agreement" v-if="moduleData.showAgreement">
      <van-checkbox v-model="checked" icon-size="16px"></van-checkbox>
      <div class="text" :class="hotareaClass({idCode: moduleData.idCode + 'toAgreement'})" @click="hotEvent('toAgreement');toAgreement()">{{moduleData.agreementText}}</div>
    </div>
  </div>
</template>

<script>
  import payHelper from "@/utils/payHelper";
  import {mapGetters} from 'vuex';
  import Bus from "../bus";
  import hee from "../_js/hotarea-extend-event";

  export default {
    name: "btn-product",
    components: {},
    mixins: [hee],
    data() {
      return {
        checked: true,
        canEvent: true
      }
    },
    props: ['myIndex', 'usePorpData', 'propData'],
    computed: {
      ...mapGetters(['clientWidth']),
      pageData: function () {
        if (this.usePorpData == true) {
          return this.propData;
        }
        return this.$store.state.pageData;
      },
      moduleData: function () {
        return this.pageData.moduleList[this.myIndex].data;
      },
      getLabelText: function () {
        let text = this.moduleData.labelText
        if (this.moduleData.product && this.moduleData.product.activityPrice != undefined) {
          text = text.replace('[price]', this.moduleData.product.activityPrice + '');
          return text
        }
        return text
      },
      getFloatUp: function () {
        let styleStr = '';
        let img = this.moduleData.bgImgUrl
        if (img != '') {
          styleStr += "background: url('" + img + "') no-repeat center center / 100% 100%;"
        }
        let color = this.moduleData.bgColor
        if (color != '') {
          styleStr += "background-color: " + color + ";"
        }
        let floatUp = this.moduleData.floatUp
        if (floatUp > 0) {
          styleStr += 'margin-top: -' + floatUp + '%;'
        }
        let isFloat = this.moduleData.isFloat
        if (isFloat) {
          if (this.$store.state.webtype == -1) {
            styleStr += 'position: absolute;'
          } else {
            styleStr += 'position: fixed;'
          }
          styleStr += 'z-index: 20;left: 0;right: 0;bottom: 0;'
        }
        return styleStr
      },
      getSidesStyle: function () {
        let styleStr = '';
        let upMargin = this.moduleData.upMargin
        let downMargin = this.moduleData.downMargin
        if (upMargin > 0) {
          styleStr += 'padding-top: ' + upMargin + '%;'
        }
        if (downMargin > 0) {
          styleStr += 'padding-bottom: ' + downMargin + '%;'
        }

        let img = this.moduleData.btnImage
        if (img != '') {
          styleStr += "background: url('" + img + "') no-repeat center center / 100% 100%;"
        }

        let labelColor = this.moduleData.labelColor
        styleStr += 'color: ' + labelColor + ';'

        return styleStr;
      },
      getLeftBtnStyle: function () {
        let styleStr = '';

        let leftBtnWidth = this.moduleData.leftBtnWidth
        if (leftBtnWidth) {
          styleStr += 'width: ' + leftBtnWidth + '%;'
        }

        return styleStr;
      },
    },
    methods: {
      /**
       * @description 热力统计事件
       */
      hotEvent(eKey=''){
        this.actionBtnEvent(this.pageData.pgCode, this.moduleData.idCode + eKey)
      },
      leftBtnEvent: function () {
        this.$market.enterNav({link: this.moduleData.leftLink})
      },
      getProductDetail: function (product) {
        this.$Loading.open();
        let url = this.$market.apiBaseURL() + '/app/json/product/getAppProDetail';
        let paramsData = {
          productType: product.productType,
          skuId: product.skuId,
          lng: this.$store.state.currentLocation.posx,
          lat: this.$store.state.currentLocation.posy
        };

        paramsData.deliverType = '2'

        this.$http.post(url, paramsData).then(
          res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              this.moduleData.product = data.data
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
      buyEvent: function () {
        if (this.$store.state.webtype == -1) {
          return;
        }
        if (this.moduleData.showAgreement) {
          if (this.checked == false) {
            this.$Toast('请先阅读并同意相关须知或政策')
            return ;
          }
        }
        // 这个事件会接收通知，防止多个通知
        if (!this.canEvent) {
          return
        }
        this.canEvent = false
        setTimeout(() => {
          this.canEvent = true
        }, 1000)

        let item = this.moduleData.product
        this.$Loading.open()
        let paramsData = {
          deliveryType: 2,
          virtualUserPhone: this.$store.state.login.phone
        }
        paramsData.carts = [{
          number: 1,
          skuId: item.skuId,
          storeOuCode: item.storeOuCode,
          selfActivityId: item.activityId,
          "checked": 1,
          "isGift": 0
        }]
        this.$http.post('/app/json/app_shopping_order/submit', paramsData).then(res => {
          let data = res.data
          if (data.status == 0) {
            const payData = data.data || {}
            if (this.$store.state.webtype == '4') { // e生活app
              this.$market.payEvent({payMode: 305, payModeSub: 305005}, payData.orderType, payData.orderId, '/icbc/ryhysuccess').then(() => {
                // this.resultHand("1", payData);
              }).catch(() => {
                this.$Toast("支付失败！")
                // this.resultHand("0", payData);
              })
            } else if (this.$store.state.webtype == '3') { // 小程序
              payHelper.payEvent({payMode: 210, payModeSub: 210005}, payData.orderType, payData.orderId, '/icbc/ryhysuccess').then(res1 => {

              }).catch(() => {
                this.$Toast("支付失败！")
              });
            } else if(this.$store.state.webtype == 2) { // 公众号
              payHelper.payEvent({payMode: 210, payModeSub: 210002}, payData.orderType, payData.orderId, '/icbc/ryhysuccess').then(res1 => {

              }).catch(() => {
                this.$Toast("支付失败！")
              });
            }
          } else {
            this.$Toast(data.info)
          }
          this.$Loading.close()
        })
      },
      toAgreement: function () {
        let value = this.moduleData.agreementValue
        if (value) {
          this.$market.customPush({
            path: '/usercenter/agreement',
            query:{
              value: value
            }
          })
        }
      }
    },
    created() {
      if (this.$store.state.webtype != -1) {
        if (this.moduleData.product) {
          this.getProductDetail(this.moduleData.product)
        }
      }
      Bus.$on('productBtnEvent', () => {
        this.buyEvent()
      })
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .btn-product {
    position relative;
    z-index 10;

    .content-div {
      display flex;
      align-items center;
      .left-btn {
        width: 0;
        img {
          display block;
          width 100%;
        }
      }
    }

    .btn-label {
      flex 1;
      text-align center;
      font-size 18px;
      display flex;
      align-items flex-end;
      justify-content center;

      .line-text {
        margin-left 8px;
        text-decoration: line-through;
        font-size 12px;
      }
    }

    .agreement {
      padding 6px 12px;
      display flex;
      align-items center;

      .text {
        padding-left 10px;
        font-size 12px;
        color #666;
      }
    }
  }
</style>
