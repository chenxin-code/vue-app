<template>
  <div class="oil-pay">
    <nav-top title="加油支付" @backEvent="$router.go(-1)">
      <div class="credentials" @click="goPaymentVoucher">支付凭证</div>
    </nav-top>
    <nav-content class="oil-pay-content">
      <div class="f-safe">请在安全区域内使用手机</div>
      <div class="content">
       <div class="tabs">
        <div class="oil-num">
          <div class="text">加油金额</div>
          <div class="inp">
            <input type="number"
                   class="num"
                   clickable
                   placeholder="请输入加油金额"
                   @input="inputNum"
                   v-model="payNum">
          </div>
        </div>
        <ul class="num-list">
          <li class="num-item" v-for="(item, index) in list" >
            <div class="text" :class="{active: currentIndex === index}" @click="tabChange(index, item)">{{item}}</div>
          </li>
        </ul>
      </div>
       <div class="tabs change-oil">
        <div class="oil-num">
          <div class="text">选择油品</div>
        </div>
        <ul class="num-list">
          <li class="num-item" v-for="(item, index) in list2" >
            <div class="text" :class="{active: currentIndexOil === index}" @click="tabChangeOil(index, item)">{{item}}</div>
          </li>
        </ul>
      </div>
      </div>
      <div class="bottom">
        <div class="oil-station">中国石化云南加油站</div>
        <div class="btn" :class="{btnChange: btnChange == 1}" @click="confirmBill">选好了</div>
      </div>
    </nav-content>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        list: [100, 200, 300, 400, 500, 600, 700, 800, 900, 6],
        list2: ['0号柴油', '92号汽油', '0号柴油', '92号汽油', '0号柴油', '92号汽油', '0号柴油', '92号汽油', '0号柴油', '92号汽油'],
        payNum: '', // 输入金额
        currentIndex: -1,
        currentIndexOil: -1, // 选择油品
        changeNum: '', // 选中金额
        oil: '', // 选择的油品
        btnChange: 0 // 是否选好 都选好后 ‘选好了’按钮颜色变成红色
      }
    },
    mounted() {
    },
    methods: {
      goPaymentVoucher() {
        // 加油支付凭证
        this.$router.push({path: '/offline_payment/payment_voucher', query:{source: 1}})
      },
      tabChange(index, item) {
        // 选择金额
        this.currentIndex = index
        this.payNum = item
        this.changeNum = item
        if (this.payNum && this.oil) {
          this.btnChange = 1
        }
      },
      tabChangeOil(index, item) {
        // 选择油品
        this.currentIndexOil = index
        this.oil = item
        if (this.payNum && this.oil) {
          this.btnChange = 1
        }
      },
      inputNum() {
        if (this.payNum && this.oil) {
          this.btnChange = 1
        } else {
          this.btnChange = 0
        }
        for (var a = 0; a < this.list.length; a++) {
          if (Number(this.payNum) !== this.list[a]) {
            this.currentIndex = -1
          } else if (Number(this.payNum) == this.list[a]) {
            this.currentIndex = a
            return
          }
        }
      },
      confirmBill() {
        // 选好了
        if (this.btnChange == 1) {
          this.$router.push({path: '/offline_payment/confirm_bill'})
        }
      }
    },
    components: {}
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/variable.styl"
  .oil-pay {
    .credentials {
      font-size: 14px
      text-align right
      margin-right: 15px
    }
    .oil-pay-content {
      display flex
      flex-direction column
      .f-safe {
        flex-shrink 0
        padding: 11px 15px;
        background-color: rgba(253, 250, 229, 0.9);
        color: #e68e4c
        font-size: 12px;
        text-align center
      }
      .content {
        flex 1
        overflow-y auto
        -webkit-overflow-scrolling touch
        padding: 11px 15px
        .tabs {
          padding: 11px 15px 11px 0
          box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.1);
          background: #fff
          border-radius 6px
          overflow hidden
          margin-bottom: 10px
          .oil-num {
            padding-left: 15px
            display flex
            .text {
              padding-right: 20px
              font-size 16px
              line-height 34px
            }
            .inp {
              flex: 1
              border-bottom: 1px solid $color-line-gray-l
              .num {
                line-height 34px
                width 100%
              }
            }
          }
          .num-list {
            margin-top: 10px
            .num-item {
              float left
              width 25%
              text-align center

              .text {
                padding: 10px 0
                border: 1px solid $color-line-gray-l
                border-radius 4px
                &.text {
                  margin-left: 15px
                }
              }
              .active {
                border: 1px solid $color-theme-r
                color: $color-theme-r
              }
              &.num-item {
                margin-bottom: 10px
              }
            }
          }
        }
      }
      .bottom {
        flex-shrink 0
        padding-left: 15px
        box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.1);
        display flex
        justify-content space-between
        div {
          padding: 15px 0
        }
        .text {
          width 80%
        }
        .btn {
          text-align center
          width 30%
          background $color-background-ll
          color: #fff
          font-size 16px
        }
        .btnChange {
          background $color-theme-r
        }
      }
    }
  }
</style>
