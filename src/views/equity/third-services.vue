/**第三方权益*/
<template>
  <div class="body">
    <nav-top @backEvent="$router.go(-1)" title="权益详情" :bgImg="bg"></nav-top>
    <nav-content>
      <div class="containerTop">
        <div class="card">
          <img src="./imgs/card.png" alt="">
          <div class="wenjuan"><img :src="detail.equityPic" alt="">
            <div>
              <p>{{detail.equityName}}</p>
              <p>{{detail.equityValue}}</p>
            </div>
          </div>
          <div class="youxiao"><span>{{detail.Effective}}</span><span>{{detail.levelEquity}}</span></div>
          <span class="describe" @click="equityData">权益描述</span>
        </div>
      </div>
      <div class="box">
        <div class="div1">
          <div class="div_p"><p>可用<span class="span1">{{detail.cumulativeNum}}张</span>问卷</p><span @click="toDetail">权益明细<span
            class="img iconfont mall-gengduojiantou"></span></span></div>
        </div>
<!--        <div class="codeDiv">-->
<!--          <p class="title">权益使用</p>-->
<!--          <div>-->
<!--            <div class="qrcode">-->
<!--              <canvas class="code-img" id="codeDiv"></canvas>-->
<!--            </div>-->
<!--            <p class="pTitle">劵编号:2020202020</p>-->
<!--            <div class="ma">-->
<!--              <canvas class="qrcode" id="qrcode"></canvas>-->
<!--            </div>-->
<!--            <p class="pTitle pTitle1 "><img src="./imgs/shua.png" alt=""><span>2分钟内有效</span></p>-->
<!--            <p class="pTitle">客服电话：{{detail.servicePhone}}</p>-->
<!--          </div>-->
<!--        </div>-->
      </div>
    </nav-content>
  </div>
</template>

<script>
  import JsBarcode from 'jsbarcode'
  import QRCode from "qrcode";

  export default {
    name: "couponList",
    components: {
      QRCode
    },
    data() {
      return {
        detail: {}
      }
    },
    mounted() {
      this.detail = JSON.parse(this.$route.query.detail);
      console.log(this.detail);
      this.eType = String(this.detail.equityType).substr(0, 1);
      var detail = this.detail;
      if (detail.validityType == 1) {
        detail.Effective = '永久有效';
      } else if (detail.validityType == 2) {
        detail.Effective = detail.days + '天内有效';
      } else if (detail.validityType == 3) {
        detail.Effective = detail.endTime + '前有效';
      }
      this.$nextTick(() => {
        let barcode = document.getElementById('codeDiv')
        JsBarcode(barcode, this.detail.qrCode)
        QRCode.toCanvas(document.getElementById('qrcode'), this.detail.qrCode, {
          margin: 0,
          width: 150
        })
      })
    },
    computed: {
      bg() {
        return require('./imgs/bg1.png')
      }
    },
    methods: {
      equityData() {
        this.$router.push({
          path: '/equity/magnification',
          query: {
            equityType: this.detail.equityType
          }
        })
      },
      toDetail() {
        this.$router.push({
          path: '/equity/equityRecord',
          query: {
            equityType: this.detail.equityType
          }
        })
      },

    }
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  /deep/ .nav-content {
    overflow-y auto !important
  }

  .containerTop {
    width: 100%
    height 100px;
    background-position: 50% 50%
    background: url("./imgs/bg2.png") no-repeat center
    overflow: hidden
    background-size: 100% 100%

    .card {
      width 90%;
      position absolute;
      left 5%

      img {
        width 100%
      }

      .youxiao {
        position: absolute;
        bottom: 22px;
        width: 80%;
        left: 50%;
        margin-left: -40%;
        color: #896123;
        font-size: 14px;
        display: flex;
        justify-content: space-between;
      }

      .wenjuan {
        position: absolute;
        top: 20%;
        left: 8%;

        img {
          width 40px !important
          float left
        }

        div {
          float left
          display flex
          flex-direction column
          height 40px;
          margin-left 6px

          p {
            margin auto 0
          }

          p:nth-child(1) {
            font-size 14px
          }

          p:nth-child(2) {
            font-size: 14px;
            color: #626763;
          }
        }
      }
    }

    .describe {
      width 60px;
      height 22px
      line-height 22px;
      text-align center
      z-index 999
      border-bottom-left-radius 5px;
      border-top-left-radius 5px;
      background #835419
      color: #dbc68f
      position absolute
      top 50%
      margin-top -11px;
      right: 4%;
    }
  }

  .box {
    margin: 70px 0 20px 0

    .div1 {
      padding: 0.213333rem;
      margin 0 auto
      /*box-shadow: 0 0 0.24rem 0 rgba(194, 192, 192, 0.3);*/

      .div_p {
        border-bottom 1px solid #ededed
        padding 20px 13px
        font-size 16px;
        display: flex;
        justify-content: space-between;

        .span1 {
          color #cb020d
        }
      }
    }
  }

  .codeDiv {
    background-color #f5f5f5
    font-weight bold
    width 90%;
    margin 0 auto
    padding 5px 10px

    .qrcode {
      text-align center
      padding: 5px 0 0 0

      .code-img {
        width: 80%
      }
    }

    .pTitle {
      line-height: 50px;
      text-align: center;
      font-size: 14px;
    }

    .pTitle1 {
      display flex
      justify-content center

      img, span {
        margin auto 0
      }
    }

    .ma {
      width: 150px;
      height: 150px;
      margin: 10px auto 10px auto;

      /deep/ .qrcode {
        width: 150px !important;
        height: 150px !important;
      }
    }

    .title {
      text-align: center;
      font-size 18px
      line-height: 40px;
    }
  }

  /deep/ .van-tabs__line {
    background-color: radial-gradient(to right, #ce000e, #ff994f) !important
  }
</style>
