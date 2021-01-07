/**Created by liaoyingchao on 2020-07-21.*/

<template>
  <div class="order-grabbing-detail">
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content>
      <div class="scroll-div">
        <div class="block">
          <div class="row">
            <div class="label">订单状态</div>
            <div class="value">{{detail.stateStr}}</div>
          </div>
          <div class="row">
            <div class="label">提货站</div>
            <div class="value">{{detail.storeOuName}}</div>
          </div>
          <div class="row">
            <div class="label">配送地址</div>
            <div class="value">{{detail.address}}</div>
          </div>
          <div class="row">
            <div class="label">收货人手机号</div>
            <div class="value">{{detail.mobile}}</div>
          </div>
          <div class="row">
            <div class="label">商品信息</div>
            <div class="value">
              <div class="pro" v-for="pro in detail.proList">
                <div class="pro-img">
                  <img :src="pro.phPictureUrl">
                </div>
                <div class="pro-info">
                  <div class="pro-name single-line">{{pro.skuName}}</div>
                  <div class="pro-number">数量：{{pro.number}}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="row" v-if="detail.state == 1">
            <div class="label">提货码</div>
          </div>
          <div class="code-div" v-if="detail.state == 1">
            <canvas id="codeDiv"></canvas>
          </div>
        </div>
      </div>
    </nav-content>
  </div>
</template>

<script>
  import JsBarcode from 'jsbarcode'

  export default {
    name: "order-grabbing-detail",
    components: {},
    data() {
      return {
        id: '',
        detail: {}
      }
    },
    created() {
      this.id = this.$route.query.id || ''
      if (this.id) {
        this.getDetail()
        this.getCode()
      } else {
        this.detail = this.$route.params.detail
      }
    },
    methods: {
      getDetail: function () {
        this.$Loading.open();
        let url = '/app/json/app_staff_dispatch/getDispatchOrderDetail';
        let paramsData = {
          id: this.id
        };
        this.$http.post(url, paramsData).then(
          res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              this.detail = data.data
              if (this.detail.itemAbstractJson) {
                this.detail.proList = JSON.parse(this.detail.itemAbstractJson)
              } else {
                this.detail.proList = []
              }
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
      getCode: function () {
        this.$Loading.open();
        let url = '/app/json/app_staff_dispatch/getPickUpcode';
        let paramsData = {
          id: this.id
        };
        this.$http.post(url, paramsData).then(
          res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              this.code = data.data.checkCode

              let barcode = document.getElementById('codeDiv');

              JsBarcode(barcode, this.code, {
                // format: "pharmacode",
                // lineColor: "#0aa",
                height: 60,
                displayValue: true
              });
            } else {
              this.$Toast(data.info);
            }
          },
          error => {
            this.$Loading.close();
            this.$Toast('请求数据失败！')
          }
        );
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .order-grabbing-detail {
    width 100%
    height 100%
    overflow hidden
    .scroll-div {
      overflow-y auto;
      .block {
        margin 8px;
        border-radius 8px;
        box-shadow 0 1px 8px #efefef;
        padding 10px 10px;
        .row {
          padding 8px 0;
          font-size 14px;
          display flex;
          align-items flex-start;
          .label {
            color #333;
            width 100px;
          }
          .value {
            flex 1;
            text-align right;
            .pro {
              margin-bottom 8px;
              text-align left;
              display flex;
              align-items center;
              .pro-img {
                img {
                  display block;
                  width 60px;
                  height 60px;
                }
              }
              .pro-info {
                flex 1;
                padding-left 8px;
                overflow hidden;
                .pro-name {
                  font-size 14px;
                }
                .pro-number {
                  margin-top 8px;
                }
              }
            }
          }
        }
        .code-div {
          width 100%
          text-align center;
          #codeDiv {
            width: 100%;
          }
        }
      }
    }
  }
</style>
