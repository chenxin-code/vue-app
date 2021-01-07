/**Created by dmj on 2018/1/2.*/

<template>
  <div class="integral-info">
    <nav-top title="成长历程" @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="integral-info">
      <div class="bg-red">
        <img src="./img/hyqy.png" class="img" alt="">
      </div>
      <div class="integral-title">
        <div class="now-integral">
          <p class="num">{{integralList.balanceUnit ? integralList.balanceUnit : 0}}</p>
          <p class="text">成长值</p>
        </div>
        <div class="info-list">
          <div class="jf-title">
            <div class="jf-cumulative">
              <p class="num"
                 v-if="integralList.totalAddUnit == 0 || integralList.totalAddUnit == '' || integralList.totalAddUnit == null">
                0</p>
              <p class="num" v-else>+{{integralList.totalAddUnit}}</p>
              <p class="text">成长值累计获取</p>
            </div>
            <div class="jf-invalid">
              <p class="num"
                 v-if="integralList.expireBalanceUnit == 0 || integralList.expireBalanceUnit == ''|| integralList.expireBalanceUnit == null">
                0</p>
              <p class="num" v-else>-{{integralList.expireBalanceUnit}}</p>
              <p class="text">成长值失效</p>
            </div>
          </div>
        </div>
      </div>
      <div class="show-list">
        <p class="title-text">成长值明细</p>
        <ul class="integral-list"
            v-infinite-scroll="loadMore"
            infinite-scroll-disabled="loading"
            :infinite-scroll-immediate-check="true"
            infinite-scroll-distance="80">
          <li class="list" v-for="(item, index) in integralListInfo" :key="index">
            <div class="info">
              <p class="title">{{item.orderTypeName}}</p>
              <p class="time-info title2">{{item.remark}}</p>
              <p class="time-info">{{item.tradeTime}}</p>
            </div>
            <div class="num">
              <span class="num-info" v-if="item.payType == 100">+{{item.amountUnit}}</span>
              <span class="num-info" v-else-if="item.payType == 400">{{item.amountUnit}}</span>
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
        payTypeCodes: '',
        index: ''
      }
    },
    mounted() {
      this.getAccountBaseInfo()  // 获取积分接口
      this.loadMore()
    },
    methods: {
      getAccountBaseInfo() {
        // 获取积分接口
        let paramsData = {
          token: this.$store.state.login.token,
          acctType: 4
        }
        this.$http.post('/app/json/acct/getAccountBaseInfo', paramsData).then(res => {
          let data = res.data
          if (data.status == 0) {
            this.integralList = data.data
          } else {
            this.$Toast('获取成长值失败')
          }
        })
      },
      loadMore() {
        // 查询积分
        this.$Loading.open()
        this.page++
        this.loading = true
        let paramsData = {
          page: this.page,
          rows: this.rows,
          distOuCode: 1000612,
          token: this.$store.state.login.token,
          acctType: 4
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
          } else {
            this.$Toast('获取成长值明细失败')
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
    .bg-red {
      width: 100%
      .img {
        width: 100%
      }
    }

    .integral-title {
      flex-shrink 0
      border-radius 4px
      overflow: hidden
      text-align center
      margin-bottom 10px
      position absolute
      top: 20px
      width: 100%

      .now-integral {
        letter-spacing 1px
        color: #fff
        font-size 16px
        padding-top: 20px

        .num {
          font-size 28px
          font-weight bold
          margin-bottom: 5px
        }
      }

      .info-list {
        display: flex
        width: 95%
        margin: 0 auto
        margin-top: 30px

        .jf-title {
          width: 100%
          border-radius 6px
          background: -webkit-linear-gradient(180deg, #fde3a2, #c6b382)
          display: flex
          padding: 15px 0
          .jf-cumulative, .jf-invalid {
            flex: 1
            color: #6d5721
            font-size: 16px
            .num {
              margin-bottom: 6px
              font-size: 18px
            }
          }
          .jf-cumulative {
            border-right: 1px solid #d0b676
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
      padding: 5px 8px

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
            width: 80%
            color: #1a1a1a

            .title {
              font-size: 16px
            }

            .title2 {
              margin: 8px 0
            }

            .time-info {
              color: #898989
            }
          }

          .num {
            width: 20%
            position relative
            margin-left: 5px

            .num-info {
              position: absolute
              top: 50%
              left: 50%
              transform translate(-50%, -50%)
              color: #ad2331
              font-size 18px
              font-weight bold
            }
          }
        }
      }

      .no-data {
        padding: 15px;
        text-align: center;
      }
      .title-text {
        font-size: 20px
        font-weight bold
        color: #4c4c4c
        padding: 11px 8px
      }
    }

  }
</style>
