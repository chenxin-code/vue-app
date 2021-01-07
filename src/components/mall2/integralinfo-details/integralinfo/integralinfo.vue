/**Created by dmj on 2018/1/2.*/

<template>
  <div class="integral-info">
    <nav-top title="积分" @backEvent="backEvent"></nav-top>
    <nav-content class="integral-info">
      <div class="integral-title">
        <div class="now-integral">
          <div class="num">{{integralList.balanceUnit ? integralList.balanceUnit : 0}}</div>
          <div class="text">
            <div class="left">当前积分</div>
            <div @click="goUse" v-if="$store.state.globalConfig.useIntegral == 1" class="btn">去使用</div>
          </div>
        </div>
        <div class="content">
          <div class="tips" v-if="expireUnit != 0">积分过期提醒：您有<span @click="openInfo" class="num">&nbsp;{{expireUnit || '0'}}&nbsp;</span>积分即将过期，请尽快使用！
          </div>
          <div class="info-list">
            <ul class="jf-list">
              <li class="jf-item" @click="changeList(index)" v-for="(item, index) in showJfList" :key="index">
                <div class="jf-item-con">
                  <div class="allinfo"
                       :class="{'active':ind === index,'first': index == 0,'earn': index == 1,'pay': index == 2,'invalid': index == 3}">
                    <p class="num">
                    <span class="num-info"
                          v-if="index == 0">{{integralList.balanceUnit ? integralList.balanceUnit : 0}}</span>
                      <span class="num-info" v-if="index == 1">+{{integralList.totalAddUnit ? integralList.totalAddUnit : 0}}</span>
                      <span class="num-info" v-if="index == 2">-{{integralList.totalConsumeUnit ? integralList.totalConsumeUnit : 0}}</span>
                      <span class="num-info" v-if="index == 3">{{integralList.expireBalanceUnit ? integralList.expireBalanceUnit : 0}}</span>
                    </p>
                    <span class="tips">{{item}}</span>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="show-list">
        <ul class="integral-list"
            v-infinite-scroll="loadMore"
            infinite-scroll-disabled="loading"
            :infinite-scroll-immediate-check="true"
            infinite-scroll-distance="80">
          <li class="list" v-for="(item, index) in integralListInfo" :key="index">
            <div class="info">
              <p class="title">{{item.orderTypeName}}</p>
              <p class="time-info">{{item.paidTime}}</p>
            </div>
            <div class="num">
              <span class="num-info" v-if="item.payType == 100 || item.payType == 300">+{{item.amountUnit}}</span>
              <span class="num-info" v-if="item.payType == 200 || item.payType == 400">{{item.amountUnit}}</span>
            </div>
          </li>
        </ul>
        <div class="no-data theme_font_tint" v-show="!hasMore">没有更多数据了~</div>
      </div>
    </nav-content>
  </div>
</template>

<script>
  import {DatetimePicker, Toast} from 'mint-ui'
  import Verify from '@/components/commonui/common-verify/index'

  export default {
    name: "",
    components: {
      [DatetimePicker.name]: DatetimePicker,
      [Toast.name]: Toast
    },
    data() {
      return {
        integralList: '',
        integralListInfo: [],
        page: 0,
        rows: 10,
        hasMore: true,
        loading: false,
        ind: 0,
        allStyle: true,
        showJfList: ['全部', '赚', '花', '失效'],
        payTypeCodes: '',
        index: '',
        expireUnit: '0' // 过期积分
      }
    },
    mounted() {
      this.getAccountBaseInfo()  // 获取积分接口
      this.loadMore()
      this.getAboutExpireUnit()
    },
    methods: {
      backEvent() {
        if (this.$route.query.type == 'subject') {
          this.$router.push({
            path: '/questionlist'
          })
        } else if (this.$route.query.type == 'serviceSubject') {
          this.$router.push({
            path: '/service/questionlist'
          })
        } else {
          this.$router.go(-1)
        }
      },
      goUse() {
        // 去使用积分
        // 展示二维码前 先判断是否需要验证码 从配置获取
        if (this.$store.state.globalConfig.qrcodePayVerify == '1') { // 为1判断开启验证码验证, 如果不存在配置则默认不开启
          Verify.open({
            type: 'qrcodePay_verify',
            sureFunc: this.imgSureFunc,
            vertifyCancelEvent: () => {
              Verify.close()
            },
            paras: {
              phone: this.$store.state.login.phone,
              token: this.$store.state.login.token
            }
          })
        } else {
          this.imgSureFunc(null, null)
        }
      },
      imgSureFunc: function (verifyCode, uuid) {
        this.$router.push({
          path: '/mall2/integralinfo-pay',
          query: {verifyCode: verifyCode, uuid: uuid, integralinfo: this.integralList.balanceUnit}
        })
      },
      getAboutExpireUnit() {
        // 获取过期积分接口
        let paramsData = {
          token: this.$store.state.login.token,
          acctType: 3,
          queryDays: this.$store.state.globalConfig.Count_overdue_days
        }
        this.$http.post('/app/json/acct/getAboutExpireUnit', paramsData).then(res => {
          let data = res.data
          if (data.status == 0) {
            this.expireUnit = data.data.aboutExpireBalanceUnit

          } else {
            this.$Toast('获取当前过期积分失败')
          }
        })
      },
      openInfo() {
        // 打开过期积分列表
        this.$router.push({path: '/mall2/expire-integralinfo', query: {expireUnit: this.expireUnit, acctType: 3}})
      },
      changeList(index) {
        this.ind = index
        console.log(index)
        if (index == 0) {
          this.index = 0
        } else if (index == 1) {
          this.index = 1
        } else if (index == 2) {
          this.index = 2
        } else if (index == 3) {
          this.index = 3
        }
        this.page = 0
        this.loading = false
        this.hasMore = true
        this.integralListInfo = []
        this.loadMore()
      },
      getAccountBaseInfo() {
        // 获取积分接口
        let paramsData = {
          token: this.$store.state.login.token,
          acctType: 3
        }
        this.$http.post('/app/json/acct/getAccountBaseInfo', paramsData).then(res => {
          let data = res.data
          if (data.status == 0) {
            this.integralList = data.data
          } else {
            this.$Toast('获取当前积分失败')
          }
        })
      },
      loadMore() {
        // 查询积分
        this.$Loading.open()
        this.page++
        this.loading = true
        if (this.index == 0) {
          this.payTypeCodes = '100, 200, 300, 400'
        } else if (this.index == 1) {
          this.payTypeCodes = '100, 300'
        } else if (this.index == 2) {
          this.payTypeCodes = '200'
        } else if (this.index == 3) {
          this.payTypeCodes = '400'
        }
        let paramsData = {
          page: this.page,
          rows: this.rows,
          payTypeCodes: this.payTypeCodes,
          distOuCode: 1000612,
          token: this.$store.state.login.token,
          acctType: 3
        }
        this.$http.post('/app/json/acct/getAccountPaymentList', paramsData).then(res => {
          let data = res.data
          if (data.status == 0) {
            // 商品列表
            this.integralListInfo = this.integralListInfo.concat(data.data || [])
            if (this.integralListInfo.length < data.totalRecords) {
              this.loading = false
            } else {
              this.hasMore = false
            }
          }
          this.$Loading.close()
        })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .integral-info {
    display flex
    flex-direction column

    .integral-title {
      background-image: url('./img/hyqy.png')
      background-size: 100% 100%
      width: 100%
      height 150px
      text-align center
      display flex
      justify-content space-between
      flex-direction column
      position relative

      .now-integral {
        letter-spacing 1px
        color: #fff
        font-size 16px
        padding-top: 20px

        .num {
          font-size 26px
          font-weight bold
          margin-bottom: 5px
        }
        .text {
          position relative
          .btn {
            position absolute
            right 0
            top: -15px; /*no*/
            padding: 5px 10px
            border-top-left-radius 20px
            border-bottom-left-radius 20px
            background: -webkit-linear-gradient(180deg, #fde3a2, #c6b382)
          }
        }
      }

      .content {
        position absolute
        top: 95px
        left 10px
        right: 10px

        .tips {
          color: #fff
          text-align left
          padding: 0 0 5px 10px

          .num {
            text-decoration underline
          }
        }

        .info-list {
          font-size: 16px
          letter-spacing 1px
          padding: 0 5px

          .jf-list {
            display: flex
            align-items center
            width: 100%

            .jf-item {
              flex: 1

              & + .jf-item {
                padding-left: 5px
              }

              .jf-item-con {
                width 100%
                position: relative
              }

              .allinfo {
                border-radius 8px
                overflow: hidden
                background: -webkit-linear-gradient(180deg, #fde3a2, #c6b382)
                box-shadow: 0 0 9px 0 rgba(197, 197, 197, 0.3)
                width: 100%
                padding-top: 10px
                color: #4a3d1b
                /*height: 64px*/
              }

              .first, .earn, .pay, .invalid {
                .num {
                  font-size: 12px
                  margin-top: 5px

                  .num-info {
                    font-size 16px
                  }
                }

                .tips {
                  width: 50%
                  margin: 0 auto
                  line-height 40px
                }
              }

              .first {
                color: #000
              }

              .invalid {
                font-size: 14px
              }

              .active {
                box-shadow: 0 0 15px 0 rgba(197, 197, 197, 0.5)
                background: #fff
                padding-top: 15px
                /*height: 68px*/
              }
            }

          }
        }

      }
    }

    .show-list {
      position: relative
      margin-top: 40px
      width: 100%
      flex 1
      overflow-y: auto
      -webkit-overflow-scrolling touch
      padding: 5px 10px

      .integral-list {
        .list {
          padding: 11px 8px
          border-radius 4px
          overflow: hidden
          box-shadow: 0 0 9px 0 rgba(197, 197, 197, 0.3)
          background: #fff
          display flex
          margin-bottom 10px

          .info {
            width: 85%
            color: #1a1a1a

            .title {
              margin-bottom 8px
            }

            .time-info {
              color: #898989
            }
          }

          .num {
            width: 15%
            position relative
            font-size: 16px
            margin-left: 5px

            .num-info {
              position: absolute
              top: 50%
              left: 50%
              transform translate(-50%, -50%)
            }
          }
        }
      }

      .no-data {
        padding: 15px;
        text-align: center;
      }
    }
  }
</style>
