
<template>
  <div class="agreement">
    <div class="box">
      <div class="box-top"></div>
      <div class="box-bom">
        <img src="./image/btm-logo.png" alt="">
      </div>
      <div class="box-content">
        <div class="operation">
          <div class="operation-btn" @click="clickBtn">
            <img src="./image/open-btn.png" alt="">
          </div>
         <div class="operation-text">
          <van-radio-group v-model="radio">
            <van-radio checked-color="#fece92" icon-size="14px" name="1"></van-radio>
          </van-radio-group>&nbsp;&nbsp;
           <span>已阅读并同意 《<i @click.stop="agreementBtn">账单信息查看说明</i>》</span>
         </div>
        </div>
      </div>
    </div>
    <van-popup v-model="show" @click="show = false">
      <div class="block" >
        <p>信息查看相关说明</p>
        <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;为了供您了解您这一年来的加油消费情况，出于对您隐私的保护，您的账单信息只有您本人有权查看，需要您本人勾选“同意”，并允许中国石化河北石油油惠通微信公众号/APP查询您的“油滴账户”相关信息，您才能查看属于您的年度账单。
          <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;您的“中国石化河北2019年油滴账单”相关信息，仅为汇总参考，与账户当期的真实资金无关。
        </span>
        <div class="blockBtn" @click="blockBtn">
          <img src="./image/编组 4.png" alt="">
        </div>
      </div>
    </van-popup>
  </div>
</template>
<script>
import mixin from "./mixin"
export default {
  name: "agreement",
  mixins: [mixin],
  components: {},
  data() {
    return {
      radio: '',
      show: false
    };
  },
  created() {
  },
  mounted() {},
  methods: {
    clickBtn() {
      if (this.radio == '1') {
        this.$router.push({
          path: '/electronic_billing',
        })
      } else {
        this.$Toast('请先阅读账单协议！')
      }
    },
    agreementBtn() {
      this.show = true
    },
    blockBtn() {
      this.show = false
    }
  }
};
</script>

<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';
.agreement {
  position: absolute;
  left: 0px;
  right: 0px;
  bottom: 0px;
  top: 0px;
  overflow: hidden;

  .box{
    width 100%
    height 100%
    background-color #faf5ea
    display flex
    flex-direction column
    justify-content space-between
    position relative
    .box-top {
      width 100%
      height 400px
      background: url('./image/bg-bg.png') repeat center center / 100% 100%;
    }
    .box-bom {
      height 140px
      width 100%
      padding 34px 110px
      img {
        height 100%
        width 100%
      }
    }
    .box-content {
      position: absolute;
      top 4%
      left 6%
      right 6%
      bottom 20%
      background: url('./image/mid-bg.png') repeat center center / 100% 100%

      .operation {
        width 100%
        height 110px
        position: absolute;
        bottom 8%
        display flex
        flex-direction column
        justify-content space-between
        align-items center
        .operation-btn {
          height 60px
          width 250px
          img {
            width 100%
            height 100%
          }
        }
        .operation-text {
          display flex
          justify-content center
          align-items center
          color #fece92
          i {
            font-style: normal;
            text-decoration underline
          }
          /deep/ .van-radio__icon .van-icon {
            background-color: #fff
          }
        }
      }
    }
  }
  /deep/ .van-popup {
    width: 85%
    height: 60%
    border-radius 10px
  }
  .block {
    width: 100%
    height: 100%
    background-color: #fff
    padding 20px
    position relative

    p {
      margin 10px 0 20px
      font-size 18px
      font-weight 500
      color #030303
      text-align center
    }
    span {
      color #7f7f7f
      line-height 28px
    }
    .blockBtn {
      position absolute
      left 0
      right 0
      bottom 20px
      display flex
      align-items center
      justify-content center
      img {
        width 70%
        height 54px
      }
    }
  }
}
</style>
