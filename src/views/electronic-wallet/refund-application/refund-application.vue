<template>
  <div class="refund-application" v-if="application">
    <nav-top title="退款申请" @backEvent="$router.go(-1)" class="theme_bg_red_i theme_font_white_i" :bgImg="1">
      <div class="my-cards" @click.stop="history">申请历史</div>
    </nav-top>
    <nav-content class="refund-application-container">
      <div class="top">
        <div class="title">钱包余额（元）</div>
        <div class="money">{{walletBalance}}</div>
      </div>
      <div class="main">
        <div class="center">
          <div class="refund-num">
            <div class="left">退款金额</div>
            <div class="inp">
              <input type="number" placeholder="请输入退款金额" v-model="money">
            </div>
          </div>
          <div class="tips">可申请金额{{walletBalance}}，<span class="btn" @click="allApplication">全部申请</span></div>
          <div class="refund-num info">
            <div class="left">申请备注</div>
            <div class="inp">
              <textarea placeholder="必填" cols="30" rows="8" v-model="applyRemark"></textarea>
            </div>
          </div>
        </div>
        <div class="submit-btn" @click="refundApply">立即申请</div>
        <div class="warm-prompt">
          <div class="title">温馨提示</div>
          <div class="content" v-for="(item, index) in newsList" :key="index" v-html="item.content"></div>
        </div>
      </div>
    </nav-content>
  </div>
  <div class="application-result" v-else>
    <nav-top title="退款申请" @backEvent="$router.go(-1)">
      <div class="my-cards" @click.stop="history">申请历史</div>
    </nav-top>
    <nav-content class="application-result-container">
      <div class="top">
        <div class="img">
          <img src="../image/icon3@2x.png" alt="">
        </div>
        <div class="text">申请成功</div>
        <div class="tips">客服人员稍后将与您联系，请耐心等待</div>
      </div>
      <div class="submit-btn" @click="completeBtn">完成</div>
    </nav-content>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        money: '', // 退款金额
        applyRemark: '', // 备注
        walletBalance: 0.00, // 钱包余额
        application: true,
        newsList: []
      }
    },
    mounted() {
      this.getWalletBalance()
      this.showagreement()
    },
    methods: {
      showagreement() {
        this.$request.post('/app/json/news/getNewsList', { values: 30 }).then(res => {
          if (res.status == 0) {
            this.newsList = res.data
          }
        })
      },
      getWalletBalance() {
        // 电子钱包余额
        this.$request.post('/app/json/acct/getAccountBaseInfo', {
          acctType: 1
        }).then(res => {
          if (res.status === 0) {
            this.walletBalance = res.data.balanceUnit ? res.data.balanceUnit : '0.00'
          } else {
            this.$Toast(res.info ? res.info : '获取信息失败')
          }
        })
      },
      refundApply() {
        // 申请退款
        if (!this.money) {
          this.$Toast('请输入退款金额')
        } else if (this.money == 0) {
          this.$Toast('退款金额不正确')
        } else if (!this.applyRemark) {
          this.$Toast('请输入申请备注')
        } else {
          this.$request.post('/app/json/my_wallet/refundApply', {
            refundAmount: this.money, //退款金额
            applyRemark: this.applyRemark // 备注
          }).then(res => {
            this.complete = true
            if (res.status === 0) {
              if (res.data == true) {
                this.application = false
              }
            } else {
              this.$Toast(res.info ? res.info : '申请退款失败')
            }
          })
        }
      },
      allApplication() {
        // 全部申请按钮
        this.money = this.walletBalance
      },
      completeBtn() {
        // 完成按钮
        this.$router.go(-1)
      },
      nowApplication() {
        // 立即申请按钮
      },
      history() {
        // 申请历史
        this.$router.push({path: '/application-history'})
      }
    },
    components: {}
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/variable.styl"
  .refund-application {
    .refund-application-container {
      .top {
        height: 90px
        background $color-theme-r
        color: #fff
        padding: 25px 15px 0 15px
        font-weight bold
        .money {
          font-size: 28px
          padding: 10px 0
        }
      }
      .main {
        padding: 11px 15px
        .center {
          box-shadow: 0 0 15px 0 rgba(197, 197, 197, 0.5)
          border-radius 6px
          padding: 11px 15px
          margin-bottom: 30px
          .refund-num {
            display flex
            justify-content space-between
            align-items center
            .inp {
              flex 1
              input {
                border-radius 4px
                border: 1px solid #ece6e6
                line-height 34px
                width 100%
                padding: 0 5px
              }
              textarea {
                border-radius 4px
                border: 1px solid #ece6e6
                width 100%
                padding: 10px 5px
              }
            }
            .left {
              width: 70px
            }
          }
          .tips {
            text-align right
            color: $color-text-l
            padding: 10px 0
            .btn {
              color: $color-theme-r
            }
          }
        }
        .info {
          align-self: flex-start;
          padding-top: 6px
        }
        .submit-btn {
          background-color: $color-theme-r;
          color: #fff;
          text-align: center;
          padding: 0.32rem 0;
          border-radius: 50px;
          width: 90%;
          margin: 0 auto
          box-shadow: 0 3px 10px 1px rgba(240, 44, 45, 0.5);

          &[disabled] {
            opacity 0.5
          }
        }
        .warm-prompt {
          padding: 11px 0
          .title {
            color: $color-text
          }
          .content {
            color: $color-text-d
            padding: 10px 0
            line-height 20px
          }
        }
      }
    }
  }
  .my-cards {
    position absolute
    right 10px
    top 0
    font-size 13px
  }
  .application-result {
    .application-result-container {
      padding: 30px 15px
      .top {
        text-align center
        .img {
          img {
            width: 50px
          }
        }
        .text {
          padding: 20px 0 10px 0
        }
        .tips {
          color: $color-text-d
          padding-bottom: 30px
        }
      }
      .submit-btn {
        background-color: $color-theme-r;
        color: #fff;
        text-align: center;
        padding: 0.32rem 0;
        border-radius: 50px;
        width: 100%;
        margin: 0 auto
        box-shadow: 0 3px 10px 1px rgba(240, 44, 45, 0.5);

        &[disabled] {
          opacity 0.5
        }
      }
    }
  }
</style>
