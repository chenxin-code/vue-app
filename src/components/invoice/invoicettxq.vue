/**Created by 黄金辉 on 2018/10/12.*/

<template>
  <div class="invoicettxq">
    <!--<nav-top @backEvent="backEvent">-->
    <!--</nav-top>-->
    <div class="addressInfo">
      <div class="block-divs">
        <div class="row row-s">
          <span class="title">抬头名称</span>
          <span class="label">{{invoiceInfo.invoicetitle}}</span>
        </div>
        <div class="row row-s">
          <span class="title">税号</span>
          <span class="label">{{invoiceInfo.taxcode}}</span>
        </div>
        <div class="row row-s">
          <span class="title">地址</span>
          <span class="label">{{invoiceInfo.addressTax}}</span>
        </div>
        <div class="row row-s">
          <span class="title">电话</span>
          <span class="label">{{invoiceInfo.telephone}}</span>
        </div>
        <div class="row row-s">
          <span class="title">开户银行</span>
          <span class="label">{{invoiceInfo.openingbank}}</span>
        </div>
        <div class="row row-s">
          <span class="title">银行账号</span>
          <span class="label">{{invoiceInfo.bankaccount}}</span>
        </div>
        <div class="img">
          <canvas id="canvas"></canvas>
        </div>
        <p class="tops">商家扫描二维码，快速获取抬头信息</p>
      </div>

      <div class="btns">
        <button class="btnleft" @click="editInvoice">编辑</button>
        <button class="btnright" @click="deleteInvoice">删除</button>
      </div>
    </div>
  </div>
</template>

<script>
  import QRCode from 'qrcode'
  import {Toast} from 'mint-ui';

  export default {
    name: "invoicettxq",
    components: {
      Toast,
    },
    data() {
      return {
        invoiceInfo: {},
        brightnessResult:{},
//        infoArr: [{
//          title: '抬头名称',
//          label: '中国石油天然气有限公司'
//        }, {
//          title: '税号',
//          label: '01001203'
//        }, {
//          title: '地址',
//          label: '北京市场区'
//        }, {
//          title: '电话',
//          label: '138000138000'
//        }, {
//          title: '开户银行',
//          label: '招商银行'
//        }, {
//          title: '银行账号',
//          label: '6002 2222 0201 030404'
//        },
//        ],
      }
    },
    methods: {
      editInvoice: function () {
        this.$bridgefunc.customPush({
          path: '/xzinvoicetaitou',
          isnativetop: '1',
          query: {
            invoiceTitle: encodeURIComponent(JSON.stringify(this.invoiceInfo)),
          }
        })
      },
      deleteInvoice: function () {
        this.$Loading.open('请求中')
        let url = 'app/json/invoice/deleteInvoiceTitle';
        let token = this.$store.state.login.token
        let params1 = {
          token: token,
          id: this.invoiceInfo.id,
        }
        let _this = this
        this.$http.post(url, params1).then(res => {
          _this.$Loading.close();
          let data = res.data;
          if (data.status == 0) {
            Toast({
              message: data.info ? data.info : '删除成功！',
              position: 'bottom',
              duration: 2000,
            });
            this.$bridgefunc.customGo(-1);
          } else {
            Toast({
              message: data.info ? data.info : '删除失败！',
              position: 'bottom',
              duration: 2000,
            });
          }
        }, error => {
          _this.$Loading.close();
          console.log('删除失败', error)
          Toast({
            message: '删除失败！',
            position: 'bottom',
            duration: 2000,
          });
        })
      },
      getInvoiceTitleDetail: function (invoiceInfo) {
        this.$Loading.open('请求中')
        let url = 'app/json/invoice/getInvoiceTitleDetail';
        let token = this.$store.state.login.token
        let params1 = {
          token: token,
          id: invoiceInfo.id,
        }
        let _this = this
        this.$http.post(url, params1).then(res => {
          _this.$Loading.close();
          let data = res.data;
          if (data.status == 0) {
            _this.invoiceInfo = data.data;
            let canvas = document.getElementById('canvas');
            QRCode.toCanvas(canvas, _this.invoiceInfo.qrCode, function (error) {
              if (error) console.error(error);
              console.log('success!');
            })
          } else {
            Toast({
              message: data.info ? data.info : '获取电子发票抬头详情失败！',
              position: 'bottom',
              duration: 2000,
            });
          }
        }, error => {
          _this.$Loading.close();
          console.log('获取电子发票抬头详情失败', error)
          Toast({
            message: '获取电子发票抬头详情失败！',
            position: 'bottom',
            duration: 2000,
          });
        })
      },
      backEvent: function () {
        this.$bridgefunc.customGo(-1)
      },
    },
    created() {
      let invoiceInfo = JSON.parse(decodeURIComponent(this.$route.query.invoiceInfo));
      this.getInvoiceTitleDetail(invoiceInfo);
      this.$bridgefunc.brightness(1, 0, (result) => {
        this.brightnessResult = result
      })
    },
    destroyed() {
      this.$bridgefunc.brightness(this.brightnessResult.value, this.brightnessResult.isauto, (result) => {})
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .invoicettxq {
    width 100%
    height 100%
    overflow hidden
    background-color: $color-background-lll;
    .addressInfo {
      overflow-y scroll
      -webkit-overflow-scrolling touch;
      background $color-background-lll

    }
    .btns {
      width: 100%;
      display flex
      justify-content space-around
      .btnleft {
        background #ff6801
        color #fff
        width 46%
        height 45px
        border none
        border-radius 40px
      }
      .btnright {
        background #fd615a
        color #fff
        width 46%
        height 45px
        border none
        border-radius 40px
      }
    }
    .block-divs {
      margin 10px 10px 10px;
      border-radius 3px;
      box-shadow: 0px 0px 3px #ccc;
      border-top 3px solid #d3d3d4
      padding 5px 0px;
      background #fff
      .row-s:first-child {
        border-bottom 1px solid $color-line-gray-l
        padding 10px 0
      }
      .row-s {
        margin 5px 10px

        .title {
          flex: 1;
          font-size 14px;
          color #9fa0a0;

        }
        .label {
          font-size 14px
          color #4c4948
          float right
        }
      }
      .img {
        display flex
        justify-content center
        margin-top 10px
        canvas {
          max-width 158px
          max-height 158px
        }
      }
      .tops {
        text-align center
        margin 15px 0
        color #9fa0a0
        font-size 14px
      }
    }
  }
</style>
