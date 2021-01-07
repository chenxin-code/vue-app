<template>
  <div class="success">
    <nav-top @backEvent="backEvent" :bgImg="require('./imgs/top-bg.png')" :title="myTitle"></nav-top>
    <nav-content>
      <div class="scroll-div" v-if="loaded">
        <img class="bg-img" src="./imgs/top-bg-1.png" alt="">>
        <div class="success-info">
          <div class="info" v-if="isSuccess">
            <van-icon class="icon" name="success"/>
            <span class="text">支付成功！</span>
          </div>
          <div class="info" v-else>
            <van-icon class="icon" name="cross"/>
            <span class="text">支付失败！</span>
          </div>
          <div class="btns">
            <van-button class="btn" @click="$router.push('/icbc/oilcoupondetail')" plain hairline color="#CE0112"
                        type="info">优惠券
            </van-button>
            <van-button class="btn" @click="toIndex" plain hairline color="#CE0112" type="info">返回首页</van-button>
          </div>
        </div>
        <div class="block">
          <div class="title-row line_bottom">
            <div class="title-icon">
              <img src="./imgs/cou-syfs.png">
            </div>
            <div class="title">使用方式</div>
          </div>
          <div class="block-content">
            <img class="test-img" src="./imgs/tt.png">
          </div>
        </div>
      </div>
    </nav-content>
  </div>

</template>

<script type="text/ecmascript-6">
  import Cookie from 'js-cookie'
  // import Eruda from 'eruda'

  export default {
    name: 'success',
    data() {
      return {
        loaded: false,
        isSuccess: false,
        tradeData: '',
        getResultTimes: 0,
        myTitle: '支付结果查询'
      }
    },
    mounted() {
      // Eruda.init()
      this.tradeData = Cookie.get('icbc_trade_data')
      // console.log(this.tradeData)
      // this.tradeData = '{"tradeNo":"20200814003213026271","orderType":"200015"}'
      // alert(this.tradeData)
      if (this.tradeData) {
        Cookie.set('icbc_trade_data', '')
        this.tradeData = JSON.parse(this.tradeData)
        if (this.tradeData.isRYHY == '1') {
          // 如果是荣耀会员购买
          this.$router.replace({
            path: '/icbc/ryhysuccess',
            query: {
              tradeNo: this.tradeData.tradeNo
            }
          })
          return ;
        }
        this.checkPayResult();
      } else {
        this.resultFailed()
      }
    },
    methods: {
      resultSuccess: function () {
        if (this.tradeData.orderType == '205002') {
          this.loaded = true
          this.isSuccess = true
          this.myTitle = '支付成功'
        } else {
          this.$router.replace({
            path: '/mall2/paysuccess'
          })
        }
      },
      resultFailed: function () {
        if (this.tradeData.orderType == '205002') {
          this.loaded = true
          this.isSuccess = false
          this.myTitle = '支付失败'
        } else {
          this.$router.replace({
            path: '/mall2/paysuccess',
            query: {
              payResult: 'icbcFailed'
            }
          })
        }
      },
      toIndex: function () {
        // window.history.go(-2)
        this.$router.replace({
          path: '/common'
        })
      },
      checkPayResult: function () {
        // this.$Loading.open();
        let url = "/app/json/app_shopping_order/queryPayState";
        if (this.tradeData.orderType == '205002') {
          // 生活缴费
          url = "/app/json/fee_life_order/queryPayState";
        }
        let paramsData = {
          tradeNo: this.tradeData.tradeNo,
        };
        this.$http.post(url, paramsData).then(
          res => {
            // this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              // 0 待支付  1支付成功  2其他(支付失败、支付取消等)
              if (data.data.state == 1) {
                this.resultSuccess()
              } else {
                this.resultFailed()
              }
            } else {
              this.resultFailed()
            }
          },
          error => {
            this.resultFailed()
            // this.$MessageBox.alert('暂未查询到您的支付信息!', '提示').then(action => {
            //   window.history.go(-2)
            // });
            // this.$Loading.close();
          }
        );
      },
      backEvent: function () {
        window.history.go(-2)
      }
    },
    components: {}
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  .success {
    .scroll-div {
      height 100%;
      overflow-y auto;
    }
    .bg-img {
      position: absolute;
      top: 0;
      width 100%
    }

    .block {
      background-color white;
      margin 10px;
      box-shadow 0 1px 8px rgba(0, 0, 0, 0.1);
      overflow hidden;
      padding 0 10px;
      border-radius 5px;
      position relative;
      z-index 10;

      .title-row {
        padding 10px 0;
        display flex;
        align-items center;

        .title-icon {
          img {
            display block;
            width 18px;
            height 18px;
          }
        }

        .title {
          font-size 16px;
          margin-left 5px;
          flex 1;
        }

        .right-btn {
          display flex;
          align-items center;

          span, i {
            font-size 12px;
          }
        }
      }

      .block-content {
        padding 10px 0;

        p {
          font-size 12px;
          line-height 16px;
        }

        .test-img {
          margin-top -10px;
          width 100%;
        }
      }
    }

    .success-info {
      background: #fff;
      position relative
      z-index 10
      margin 10px;
      padding 30px 40px;
      border-radius 4px;
      box-shadow 0 1px 8px rgba(0, 0, 0, 0.1);

      .info {
        display flex
        align-items center
        font-size: 22px;
        color #CE0112
        justify-content center

        .icon {
          font-size: 30px;
        }

        .text {
          padding-left: 20px;
        }
      }

      .btns {
        display flex
        justify-content center
        padding-top: 30px;

        .btn + .btn {
          margin-left: 20px;
        }
      }
    }
  }
</style>
