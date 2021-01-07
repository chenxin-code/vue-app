<template>
  <div class="rebate-bonus-details" v-if="complete">
    <nav-top @backEvent="backEvent" :title="title"></nav-top>
    <nav-content class="rebate-bonus-details-container">
      <div class="main">
        <div class="integral-title" :class="{one: dict.dictKey == 2, two: dict.dictKey == 3, 'is-diesel-rebase': isDieselRebate}">
          <div class="now-integral">
            <p class="explain-num">{{details.balanceUnit}}</p>
            <p class="text">当前余额</p>
          </div>
        </div>
        <div class="content">
          <div class="top">
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
          <commonList ref="list" :statusObj='statusObj' :source="acctType"/>
        </div>
      </div>
    </nav-content>
  </div>
</template>
<script>
  import mixin from '@/components/usercenter/setting/rebate-bonus/mixin.js'
  import commonList from '@/components/usercenter/setting/common-list/index.vue'
  export default {
    name: "rebate-bonus-list",
    mixins: [mixin],
    data() {
      return {
        isDieselRebate: false, // 柴油豆
        complete: false,
        tabId: '1',
        page: 0,
        rows: 10,
        payTypeCodes: '100,300',
        source: 8, // 返利红包的acctType是8
        statusObj: {
          is: 10,
          status: '1',
          effective: 'envelopes-red',
          invalid: 'envelopes-grey',
          diesel: 'diesel',
          payTypeCodes: '100,300',
          totalAddUnit: '',
          totalConsumeUnit: '',
          expireBalanceUnit: '',
          url: '/app/json/acct/getAccountPaymentList',
          groupValue: ''
        },
        tabs: [
          {text:'奖励明细',id:'1'},
          {text:'消费明细',id:'2'},
          {text:'过期明细',id:'3'}
        ],
        details: '',
        title: '',
        expireUnit: '0' // 过期积分
      }
    },
    computed: {
      acctType() {
        let type = 8
        if (this.isDieselRebate) {
          type = 21
        }
        return type
      }
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        if (to.path === '/diesel-rebate') {
          vm.isDieselRebate = true
        }
      })

    },
    mounted() {
      this.getlist()
    },
    methods: {
      getlist() {
        // 获取返利红包分组
        this.$Loading.open()
        let paramsData = {
          token: this.$store.state.login.token,
          alias: 'rewards_group' // 返利红包分组--字典表
        }
        this.$http.post('/app/json/app_dict/getDictByAlias', paramsData).then(res => {
          let data = res.data
          this.$Loading.close()
          if (data.status == 0) {
            let list = data.data || []
            list.map(item => { // 循环 为了拿dictKey值 作为查询当前余额的参数
              if (item.dictKey == 1) {
                this.dict = item
                if (!this.isDieselRebate) {
                  this.title = item.dictValue
                }
                this.statusObj.groupValue = item.dictKey
                this.getAccountBaseInfo(item.dictKey)
                this.getAboutExpireUnit(item.dictKey)
              }
            })
            this.complete = true
          } else {
            this.$Toast(data.info)
          }
        })
      },
      getAccountBaseInfo(groupValue) {
        console.log(this.dict)
        // 获取红包金额
        let paramsData = {
          token: this.$store.state.login.token,
          acctType: this.acctType,
          groupValue: groupValue
        }
        this.$http.post('/app/json/acct/getAccountBaseInfo', paramsData).then(res => {
          let data = res.data || {}
          if (data.status == 0) {
            this.details = data.data
            this.statusObj.totalAddUnit = this.details.totalAddUnit
            this.statusObj.totalConsumeUnit = this.details.totalConsumeUnit
            this.statusObj.expireBalanceUnit = this.details.expireBalanceUnit
            console.log(this.details)
          } else {
            this.$Toast(data.info ? data.info : '获取失败')
          }
        })
      },
      getAboutExpireUnit(dictKey) {
        // 获取过期积分接口
        let paramsData = {
          token: this.$store.state.login.token,
          acctType: this.acctType,
          groupValue: dictKey,
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
        this.$router.push({path: '/mall2/expire-integralinfo', query: {expireUnit: this.expireUnit, acctType: this.acctType, groupValue: this.dict.dictKey, title: this.title}})
      },
      backEvent: function () {
        this.$router.go(-1)
      },
      tabEvent(id){
        if(this.tabId !=id){
          this.tabId = id
          this.statusObj.status = id
        if(id ==1){
          this.statusObj.payTypeCodes = '100,300'
        } else if(id == 2){
          this.statusObj.payTypeCodes = '200'
        } else if(id == 3){
          this.statusObj.payTypeCodes = '400'
        }
        }
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
    .rebate-bonus-details-container {
      overflow-y auto
    }
    .main {
      position relative
      .integral-title {
        width: 100%
        height 150px
        background-image: url('./image/bg1@2x.png')
        background-size: 100% 100%
        border-radius 4px
        text-align center
        display flex
        justify-content space-between
        flex-direction column
        padding-bottom: 50px; /*no*/
        &.is-diesel-rebase{
          background-image: url('./image/bg4.png')
        }
        .now-integral {
          letter-spacing 1px
          color: #fff
          font-size 16px
          padding-top: 20px

          .explain-num {
            margin-bottom: 5px
            font-size 36px
            font-weight bold
          }
        }
      }

      .content {
        position absolute
        top: 95px
        left: 10px
        right: 10px
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
          margin-bottom: 10px

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
    .one {
      background-image: url('./image/bg2@2x.png')
      background-size: 100% 100%
    }
    .two {
      background-image: url('./image/bg3@2x.png')
      background-size: 100% 100%
    }
    .list {
      padding-top: 50px
    }
  }
</style>
