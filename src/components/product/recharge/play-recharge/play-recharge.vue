<template>
  <div class="phone-bill-recharge">
    <nav-top title="游戏充值" @backEvent="$router.go(-1)">
      <div class="phone-bill" @click="openPhoneBill">充值记录</div>
    </nav-top>
    <nav-content class="phone-bill-recharge-details">
      <div class="phone-bill-recharge-content">
        <div class="video-recharge">
          <div class="name">
            <span class="title">游戏名称：</span>
            <input type="text" v-model="playName">
          </div>
          <div class="name">
            <span class="title">充值账号：</span>
            <input type="text" @input="overPhone" v-model="playAccount" placeholder="请输入账号">
          </div>
          <div class="name">
            <span class="title">选择大区：</span>
            <input type="text" v-model="playArea">
          </div>
        </div>
        <div class="tips-top">
          <span>选择面值</span>
        </div>
        <recharge-grid :col="3" :list="list" @change="change" :status="status"></recharge-grid>
        <div class="tips-top small">
          <span>购买数量</span>
          <span class="num">
            <van-stepper
              @plus="plusBtn"
              @minus="minusBtn"
              v-model="value"
            />
          </span>
        </div>
        <div class="tips-top small">
          <span>需支付</span>
          <span class="num">
            ￥<span class="text">{{needPayNum}}</span>
          </span>
        </div>
      </div>
      <div class="re-btn" @click="nowRecharge">立即充值</div>
      <van-action-sheet v-model="showRecharg" title="确认付款">
        <div class="recharge-popup">
          <div class="num">
            ￥<span class="text">{{changeNum}}</span>
          </div>
          <div class="info">
            <div class="details">
              <span class="title">订单信息</span>
              <span class="content">手机号{{phone}}充值{{changeNum}}元</span>
            </div>
            <div class="details">
              <span class="title">支付方式</span>
              <span class="content">微信支付</span>
            </div>
          </div>
        </div>
        <div class="re-btn" @click="nowRecharge">立即支付</div>
      </van-action-sheet>
    </nav-content>
  </div>
</template>

<script type="text/ecmascript-6">
  import RechargeGrid from '../components/recharge-grid'
  export default {
    name: '',
    data() {
      return {
        showRecharg: false, // 充值页面弹框
        playName: '地下城勇士', // 游戏名称
        playAccount: '', // 充值账号
        playArea: '', // 选择大区
        value: 1, // 步进器值
        changeNum: '', // 选择的面额
        phone: '', // 输入的手机号
        status: true,
        list: ['10', '20', '30', '40'], // 话费面额 列表
        needPayNum: '', // 需支付金额
        changeNeedNum: '', // 选择的需要支付的面额 初始值
      }
    },
    created() {
    },
    mounted() {
      this.phone = this.$store.state.login.phone
      this.needPayNum = this.list[0]
      this.changeNeedNum = this.list[0]
    },
    methods: {
      openPhoneBill() {
        // 打开游戏账单
        this.$router.push({path: '/recharge-bill', query: {name: 'play'}})
      },
      openQQCharge() {
        // 打开qq充值
        this.$router.push('/qq-recharge')
      },
      nowRecharge() {
        // 立即充值按钮
        this.showRecharg = true
      },
      change(num) {
        // 子组件点击事件
        this.changeNum = num
        this.needPayNum = num // 显示的选择的面额
        this.changeNeedNum = num // 给第一次选择的面额 赋值  为计算总额使用
        this.value = 1 // 充值面额时 步进器的值归为
      },
      overPhone() {
        // 输入账号

      },
      plusBtn() {
        // 步进器的增加按钮
        this.needPayNum = (this.value + 1) * this.changeNeedNum
      },
      minusBtn() {
        // 步进器的减少按钮
        this.needPayNum = (this.value - 1) * this.changeNeedNum
      }
    },
    computed: {},
    components: {
      RechargeGrid
    }
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  @import "~@/common/stylus/variable.styl"
  @import "../asset/recharge.styl"
  .phone-bill-recharge-content {
    padding: 11px 15px
    .video-recharge {
      box-shadow: 0 0 9px 0 rgba(197, 197, 197, 0.3)
      border-radius 4px
      padding: 5px
      margin-bottom 20px
      font-size: 14px
      .name {
        padding: 10px 5px
        & + .name {
          border-top: 0.5px solid #ecebeb
        }
      }
    }
    .inp {
      padding-bottom 15px
      input {
        font-size 24px
      }
    }
    .tips-top {
      padding: 10px 0
      font-size: 20px
    }
    .small {
      font-size 16px
      display flex
      justify-content space-between
      align-items center
      .num {
        font-size 12px
        .text {
          font-size: 20px
        }
      }
    }
    .more-recharge-list {
      display: flex
      flex-wrap wrap
      text-align center
      padding: 20px 0
      .more-recharge-item {
        width: 25%
        padding-bottom: 20px
        .img {
          padding-bottom 5px
          width: 100%
          height: 40px
          text-align center
          display flex
          justify-content center
          align-items center
          img {
            width: 30%
            display inline-block
            vertical-align middle
          }
        }
      }
    }
  }

  .phone-bill {
    text-align right
    padding-right: 10px
    img {
      width: 30px
      vertical-align middle
    }
  }

  .recharge-popup {
    padding: 11px 15px
    height: 350px
    .num {
      text-align center
      font-weight bold
      padding: 20px 0
      .text {
        font-weight bold
        font-size 34px
      }
    }
    .info {
      .details {
        padding: 15px 0
        display flex
        justify-content space-between
        align-items center
        font-size 14px
        border-bottom: 0.5px solid #ecebeb
        .title {
          color: $color-text-l
        }
      }
    }
  }

  /deep/ .van-action-sheet--withtitle {
    border-top-left-radius 10px
    border-top-right-radius 10px
  }

  .phone-bill {
    text-align right
    padding-right: 10px
    img {
      width: 20px
      vertical-align middle
    }
  }

  /deep/ .van-stepper__plus {
    border: none
    background #fff
  }

  /deep/ .van-stepper__minus--disabled::before {
    background: $color-text-d
  }

  /deep/ .van-stepper__minus {
    border: none
    background #fff
  }

  /deep/ .van-stepper__plus::before {
    background: $color-text-d
  }

  /deep/ .van-stepper__input {
    border: none
    color: $color-text
    background: #f3f2f2
    border-radius 6px
  }
  /deep/ .van-stepper {
    margin-right -14px
  }

</style>
