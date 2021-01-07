<template>
  <div class="rebate-bonus-details">
    <nav-top @backEvent="backEvent" :title="title"></nav-top>
    <nav-content class="rebate-bonus-details-container" v-if="complete">
      <div class="main">
        <div class="integral-title" :class="{one: dictKey == 2, two: dictKey == 3}">
          <div class="now-integral">
            <p class="explain-num">{{details.balanceUnit}}</p>
            <p class="text">当前余额</p>
          </div>
        </div>
        <div class="content">
          <div class="top">
            <div class="tips" v-if="expireUnit != 0">余额过期提醒：您有<span @click="openInfo" class="num">&nbsp;{{expireUnitexpireUnit || '0'}}&nbsp;</span>余额即将过期，请尽快使用！</div>
            <div class="tabs">
              <div class="tab-item" :class="{ active : item.id === tabId }" v-for="item in tabs" @click="tabEvent(item.id)"
                   :key="item.id">
                <div class="text">
                  {{item.text}}
                </div>
              </div>
            </div>
          </div>
          <commonList ref="list" :statusObj='statusObj' :source="source"/>
        </div>
      </div>
    </nav-content>
  </div>
</template>
<script>
  import mixin from './mixin'
  import commonList from '../common-list/index.vue'
  export default {
    name: "rebate-bonus-list",
    mixins: [mixin],
    data() {
      return {
        tabId: '1',
        complete: false,
        page: 0,
        rows: 10,
        title: '',
        payTypeCodes: '100,300',
        source: 8, // 返利红包的acctType是8
        dictKey: '', // 返利红包 分组标识
        statusObj: {
          is: 10,
          status: '1',
          effective: 'envelopes-red',
          invalid: 'envelopes-grey',
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
        expireUnit: '0' // 过期积分
      }
    },
    mounted() {
      this.dictKey = this.$route.query.dictKey
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
            list.forEach((item) => { // 循环 为了拿dictKey值 作为查询当前余额的参数
              if (this.dictKey == item.dictKey) {
                this.statusObj.groupValue = item.dictKey
                this.getAboutExpireUnit(item.dictKey)
                this.title = item.dictValue
                 let paramsData = {
                  token: this.$store.state.login.token,
                  acctType: 8,
                  groupValue: this.statusObj.groupValue
                }
                 this.$http.post('/app/json/acct/getAccountBaseInfo', paramsData).then(res => {
                  let data = res.data || {}
                  if (data.status == 0) {
                    this.details = data.data
                    this.statusObj.totalAddUnit = this.details.totalAddUnit
                    this.statusObj.totalConsumeUnit = this.details.totalConsumeUnit
                    this.statusObj.expireBalanceUnit = this.details.expireBalanceUnit
                    this.complete = true
                  } else {
                    this.$Toast(data.info)
                  }
                })
              }
            })
          } else {
            this.$Toast(data.info)
          }
        })
      },
      getAboutExpireUnit(dictKey) {
        // 获取过期积分接口
        let paramsData = {
          token: this.$store.state.login.token,
          acctType: 8,
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
        this.$router.push({path: '/mall2/expire-integralinfo', query: {expireUnit: this.expireUnit, acctType: 8, groupValue: this.statusObj.groupValue, title: this.title}})
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
    .main {
      position relative
      height 100%
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
        bottom: 0
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
