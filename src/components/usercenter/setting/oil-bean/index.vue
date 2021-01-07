<template>
  <div class="rebate-bonus-details">
    <nav-top @backEvent="backEvent" :title="globalConfig.Employees_wallet"></nav-top>
    <nav-content class="rebate-bonus-details-con">
      <div class="main">
        <div class="integral-title">
          <div class="now-integral">
            <p class="explain-num">
              <span class="num">{{integralList.balanceUnit}}</span>
              <span class="explain" @click="explainBtn">规则说明 </span>
            </p>
            <p class="text">当前{{globalConfig.Employees_wallet}}</p>
          </div>
        </div>
        <div class="content">
          <div class="tips" v-if="expireUnit != 0">余额过期提醒：您有<span @click="openInfo" class="num">&nbsp;{{expireUnit || '0'}}&nbsp;</span>余额即将过期，请尽快使用！</div>
          <div class="tabs">
            <div class="tab-item" :class="{ active : item.id === tabId }" v-for="item in tabs" @click="tabEvent(item.id)"
                 :key="item.id">
              <div class="text">
                {{item.text}}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="list">
        <commonList ref="list" :statusObj='statusObj' :source="source"/>
      </div>
    </nav-content>
  </div>
</template>
<script>
  import mixin from './mixin'
  import commonList from '../common-list/index.vue'
  import { mapState } from 'vuex';

  export default {
    name: "rebate-bonus-list",
    mixins: [mixin],
    data() {
      return {
        page: 0,
        rows: 10,
        payTypeCodes: '100,300',
        tabId: '1',
        integralList: {},
        source: 9, // 豌豆的acctType是9
        statusObj: {
          is: 36,
          status: '1',
          effective: 'effective-beans',
          invalid: 'failed-beans',
          payTypeCodes: '100,300',
          totalAddUnit: 0,
          expireBalanceUnit: 0,
          totalConsumeUnit: 0,
          url: '/app/json/acct/getAccountPaymentList'
        },
        tabs: [
          {text: '奖励明细', id: '1'},
          {text: '消费明细', id: '2'},
          {text: '过期明细', id: '3'}
        ],
        expireUnit: '0' // 过期积分
      }
    },
    computed: {
      ...mapState([
        'globalConfig'
      ])
    },
    mounted() {
      // 获取豌豆接口
      let paramsData = {
        token: this.$store.state.login.token,
        acctType: 9
      }
      this.$http.post('/app/json/acct/getAccountBaseInfo', paramsData).then(res => {
        let data = res.data
        if (data.status == 0) {
          this.integralList = data.data
          this.statusObj.totalAddUnit = data.data.totalAddUnit
          this.statusObj.expireBalanceUnit = data.data.expireBalanceUnit
          this.statusObj.totalConsumeUnit = data.data.totalConsumeUnit
        } else {
          this.$Toast(data.info)
        }
      })
      this.getAboutExpireUnit()
    },
    methods: {
      getAboutExpireUnit() {
        // 获取过期积分接口
        let paramsData = {
          token: this.$store.state.login.token,
          acctType: 9,
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
        this.$router.push({path: '/mall2/expire-integralinfo', query: {expireUnit: this.expireUnit, acctType: 9}})
      },
      backEvent: function () {
        this.$router.go(-1)
      },
      explainBtn() {
        this.$router.push({
          path: '/usercenter/rule',
        })
      },
      tabEvent(id) {
        this.tabId = id
        this.statusObj.status = id
        if (id == 1) {
          this.statusObj.payTypeCodes = '100,300'
        } else if (id == 2) {
          this.statusObj.payTypeCodes = '200'
        } else if (id == 3) {
          this.statusObj.payTypeCodes = '400'
        }
        // this.$refs.list.loadMore()
      }
    },
    components: {commonList}
  }
</script>

<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .rebate-bonus-details {
    width 100%
    height 100%
    overflow hidden

    .rebate-bonus-details-con{
      display flex
      flex-direction column
    }
    .main {
      flex-shrink 0
      position relative
      .integral-title {
        width: 100%
        height 150px
        background-image: url('./img/hyqy.png')
        background-size: 100% 100%
        border-radius 4px
        text-align center
        display flex
        justify-content space-between
        flex-direction column

        .now-integral {
          letter-spacing 1px
          color: #fff
          font-size 16px
          padding-top: 20px

          .explain-num {
            margin-bottom: 5px

            .num {
              font-size 36px
              font-weight bold
            }

            .explain {
              font-size 15px
              position absolute
              top: 46px
              right 10px
            }
          }
        }
      }
      .content {
        position absolute
        top: 95px
        left: 15px
        right: 15px
        .tips {
          text-align left
          padding: 0 0 5px 10px
          color: #fff
          .num {
            text-decoration underline
          }
        }
        .tabs {
          display flex
          border-radius 10px
          background-color #fff
          font-size 40px
          box-shadow: 0 0 9px 0 rgba(197, 197, 197, 0.3)

          .tab-item {
            flex 1
            text-align center
            padding 20px 0
          }

          .active {
            color $color-theme-r

            .text {
              &:after {
                content ''
                position: absolute
                width 54%
                left: 23%
                border-bottom 2px solid #f62e2e
                bottom -3px
              }
            }
          }

          .text {
            position: relative
            padding 6px 0
            font-size $font-size-medium-x
            font-weight $font-weight-m
          }
        }
      }
    }
    .list {
      flex 1
      padding-top: 30px
      overflow hidden
    }
  }
</style>
