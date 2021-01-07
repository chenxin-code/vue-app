<template>
  <div class="my-ebay" v-if="complete">
    <nav-top :title="title" class="theme_bg_orange_i theme_font_white_i" :bgImg="1" @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="my-ebay-container">
      <div class="top">
        <div class="help-tips">
          <span class="text"  @click="openHelp">帮助说明</span>
        </div>
        <div class="title">当前拥有</div>
        <div class="ebay-num">
          <span class="num">{{balanceUnit}}</span>{{getDigitalDisplayName('Rewards')}}
        </div>
      </div>
      <div class="my-ebay-info">
        <div class="my-ebay-title" @click="show = true">
          <div class="table-view">
            <div class="table-view-cell circle">
              <div class="table-view-cell-text">
                <div class="left">{{getDigitalDisplayName('Rewards')}}收支明细记录</div>
              </div>
              <div class="table-view-cell-arrow special">{{showInfoTitle}}</div>
            </div>
          </div>
        </div>
        <commonList ref="list" :statusObj='statusObj' :source="source"/>
<!--        <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="loadMore">-->
<!--          <ul class="record-list">-->
<!--            <li class="record-item" v-for="(item, index) in recordList" :key="index">-->
<!--              <div class="left">-->
<!--                <div class="text-title">签到</div>-->
<!--                <div class="text-time">2019-1-2 8:00:00</div>-->
<!--              </div>-->
<!--              <div class="right">+2</div>-->
<!--            </li>-->
<!--          </ul>-->
<!--        </van-list>-->
      </div>
<!--      弹框-->
      <van-action-sheet v-model="show">
        <van-picker :columns="columns" @cancel="show = false"
                    @confirm="onConfirm" show-toolbar />
      </van-action-sheet>
    </nav-content>
  </div>
</template>

<script>
  import commonList from '../../components/usercenter/setting/common-list/index'
  export default {
    data() {
      return {
        loading: false,
        finished: false,
        page: 0,
        recordList: [1, 2], // 列表
        columns: ['奖励明细', '消费明细', '过期明细'],
        show: false,
        showInfoTitle: '奖励明细',
        source: 8, // 返利红包的acctType是8
        dict: '', // 油贝信息
        balanceUnit: '', // 当前拥有油贝总额
        statusObj: {
          is: 10,
          status: '1',
          effective: 'envelopes-red',
          invalid: 'envelopes-grey',
          payTypeCodes: '100,300',
          totalAddUnit: 0,
          url: '/app/json/acct/getAccountPaymentList',
          groupValue: '',
          types: 0
        },
        title: '', // 标题
        complete: false
      }
    },
    mounted() {
      this.getlist() // 获取返利红包分组
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
            this.cardList = data.data
            let list = this.cardList || []
            list.map(item => { // 循环 为了拿dictKey值 作为查询当前余额的参数
              if (item.dictKey == 3) {
                this.getAccountBaseInfo(item.dictKey)
                this.dict = item
                this.title = this.dict.dictValue
                this.statusObj.groupValue = this.dict.dictKey
              }
            })
          } else {
            this.$Toast(data.info)
          }
          this.complete = true
        })
      },
       getDigitalDisplayName: function (acctType) {
        return this.$mallCommon.accTypeToName(acctType, '200001')
      },
      getAccountBaseInfo(groupValue) {
        // 获取红包金额
        let paramsData = {
          token: this.$store.state.login.token,
          acctType: 8,
          groupValue: groupValue
        }
        this.$http.post('/app/json/acct/getAccountBaseInfo', paramsData).then(res => {
          let data = res.data || {}
          if (data.status == 0) {
            this.balanceUnit = data.data.balanceUnit
            // this.$set(item,'_balanceUnit',data.data.balanceUnit) // 新增参数 以获取 当前余额 解决新增属性 视图不更新
            // this.completeRequest = true
            // item._balanceUnit = data.data.balanceUnit // 新增参数 以获取 当前余额
          } else {
            this.$Toast(data.info ? data.info : '获取失败')
          }
        })
      },
      onConfirm(value, index) {
        this.showInfoTitle = value
        console.log(index)
        if (index == 0) {
          this.statusObj.payTypeCodes = '100, 300'
        } else if (index == 1) {
          this.statusObj.payTypeCodes = '200'
        } else if (index == 2) {
          this.statusObj.payTypeCodes = '400'
        }

        this.show = false
      },
      openHelp() {
        // 打开帮助说明
        this.$router.push({path: '/help-instructions'})
      }
    },
    components: {
      commonList
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/variable.styl"
  .my-ebay {
    .my-ebay-container {
      .top {
        height: 130px
        background: -webkit-linear-gradient(90deg, #ee6c65, #f08160)
        color: #fff
        padding: 15px
        line-height 24px

        .help-tips {
          text-align right

          .text {
            padding: 5px 8px
            background #e46651
            border-radius 20px
            color: #f4e9e5
          }
        }

        .title, .ebay-num {
          text-align center
          font-size: 16px

          .num {
            font-size: 28px
            font-weight bold
          }
        }

        .ebay-num {
          padding-top: 5px
        }
      }

      .my-ebay-info {
        position relative
        top: -10px
        left: 0
        right: 0

        .my-ebay-title {
          box-shadow: 0 0 15px 0 rgba(197, 197, 197, 0.5)

          .circle {
            border-top-left-radius 10px
            border-top-right-radius 10px
            padding: 20px 15px
            font-size: 16px
          }

          .special {
            color: $color-theme-r
          }
        }

        .record-list {
          padding: 15px 11px

          .record-item {
            box-shadow: 0 0 15px 0 rgba(197, 197, 197, 0.5)
            border-radius 6px
            padding: 11px 15px
            line-height 20px
            display flex
            justify-content space-between
            align-items center
            margin-bottom: 10px

            .text-time {
              color: $color-text-l
            }

            .right {
              color: $color-theme-r
              font-size: 18px
              font-weight bold
            }
          }
        }
      }
    }
  }
  .nav-content {
    overflow-y auto
  }
</style>
