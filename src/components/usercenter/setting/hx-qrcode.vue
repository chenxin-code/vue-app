/**Created by steven on 2018/12/21.*/

<template>
  <div class="my-qrcode">
    <nav-top @backEvent="backEvent">
    </nav-top>
    <nav-content class="my-qrcode-container">
      <div class="code-content">
        <div class="qr-div">
          <div class="codeimg-content">
            <canvas class="qrcode" id="qrcode" ref="qrcode"></canvas>
          </div>
        </div>
      </div>
      <div class="danger-btn">
        <van-button
          class="btn"
          type="danger"
          @click="confirmHandler">我的优惠券
        </van-button>
      </div>
    </nav-content>
  </div>
</template>

<script>
  import QRCode from 'qrcode'
  import Config from '@/api/config.js'

  export default {
    name: "hx-qrcode",
    components: {
    },
    data() {
      return {
        myInfo: {},
        myTimeout: null
      }
    },
    methods: {
      backEvent: function () {
        this.$router.go(-1);
      },
      confirmHandler() {
        this.$router.push('/coupon_list')
      },
      getMycode: function () {

        this.$Loading.open()
        let url = '/app/json/user/queryHxQrcode';
        let params1 = {
          token: this.$store.state.login.token,
        }
        this.$http.post(url, params1).then(res => {
          this.$Loading.close();
          let data = res.data;
          if (data.status == 0) {
            this.myInfo = data.data;

            this.$nextTick(() => {
              this.toCanvas();
              //3分钟刷洗一下
              if (this.myTimeout) {
                clearTimeout(this.myTimeout)
                this.myTimeout = null
              }
              this.myTimeout = setTimeout(() => {
                this.getMycode();
              }, 3 * 60 * 1000)
            })

          } else {
            this.$Toast(data.info);
          }

        }, error => {
          this.$Loading.close();
          console.log('获取我的电子券', error)
        })
      },
      toCanvas: function () {
        let that = this
        QRCode.toCanvas(document.getElementById('qrcode'), that.myInfo)
      }

    },
    destroyed() {
      if (this.myTimeout) {
        clearTimeout(this.myTimeout)
        this.myTimeout = null
      }
      this.$bridgefunc.brightness(this.brightnessResult.value, this.brightnessResult.isauto, (result) => {})
    },
    mounted() {
    },
    created() {
      this.getMycode();
      this.$bridgefunc.brightness(1, 0, (result) => {
        this.brightnessResult = result
      })
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .my-qrcode {
    .my-qrcode-container {
      overflow-y auto
      -webkit-overflow-scrolling touch
    }
    .code-content {
      padding: 11px 15px
      .qr-div {
        position relative
        border-radius 5px
        box-shadow: 0 0 9px 0 rgba(197, 197, 197, 0.3);
        background white
        .head-div {
          width 100%
          height 100px
          top -50px
          position absolute
          display flex
          justify-content center
          .headImg {
            width 100px
            height 100px
          }
        }
        .phone {
          text-align center
          padding-top 40px
          font-size $font-size-medium
        }
        .barcode {
          margin 20px
          height 60px
          canvas {
            width 100%
            height 100%
          }
        }
        .code {
          text-align center
          font-size $font-size-medium
        }

        .codeimg-content {
          display flex
          justify-content center
          flex-direction column
          align-items center
          padding 40px 0 30px 0
          .qrcode {
            /*width 140px
            height 140px
            img {
              display block;
              width 100%;
              height 100%;
            }*/
          }
          .icon {
            padding-top: 10px
            .iconfont {
              font-size: 20px
              color: $color-text-l
            }
          }
        }

      }
      .qrcode-agreement {
        margin 20px 10px
        line-height 16px
      }

      /*.code {
          border-radius 5px
          display flex
          justify-content center
          flex-direction column
          align-items center
          margin 10px
          margin-top  20px
          overflow hidden
          background-color white
          .num{
            margin-top 20px
            margin-bottom 20px
            text-align center
            font-size $font-size-medium
            font-weight $font-weight-m
          }
          .img{
            width 140px
            height 140px
          }
          .name{
            margin 10px 0px 20px 0px
            font-size $font-size-medium
            text-align center
            font-weight $font-weight-m
          }

          & +.code{
            margin-top 0px
          }
        }
*/

    }
    .danger-btn{
      text-align: center;
      padding: 5px 0;
      .btn{
        width: 90%;
        border-radius: 4px;
      }
  }

  }
</style>
