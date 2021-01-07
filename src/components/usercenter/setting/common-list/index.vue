<template>
  <div class="envelopes-list">
    <div class="content-title" v-if="dataArr.length && statusObj.types == 1">
      <span class="content-title-left">累计</span>
      <span class="content-title-right" :class="classArr[statusObj.status-1]" v-if="statusObj.status == 1">{{`+${statusObj.totalAddUnit}`}}</span>
      <span class="content-title-right" :class="classArr[statusObj.status-1]" v-else-if="statusObj.status == 2">{{`-${statusObj.totalConsumeUnit}`}}</span>
      <span class="content-title-right" :class="classArr[statusObj.status-1]" v-else>{{`-${statusObj.expireBalanceUnit}`}}</span>
    </div>
    <div class="content-row">
  
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="loadMore">
        <ul>
          <li class="envelopes-list-box" v-for="(item, index) in dataArr" :key="index">
            <!--        柴油豆 oil-point-history-->
            <img v-if="statusObj.diesel && source == 21" class="img"
                 :src="require(`../../../../../static/image/login2/diesel.png`)" alt="">
            <img v-else class="img"
                 :src="require(`../../../../../static/image/login2/${statusObj.status != 3 ? statusObj.effective : statusObj.invalid}.png`)"
                 alt="">
            <div class="details">
              <div class="details-left">
                <span class="title">{{item.changeReason?item.changeReason:item.orderTypeName}}</span>
                <span class="money textColor">{{item.amountYuan}}</span>
                <span class="time textColor"><i>{{item.paidTime}}</i></span>
              </div>
              <div class="details-right">
                <span class="text" :class="classArr[statusObj.status-1]">{{`${statusObj.status == 1 ? '+' : ''}${item.amountUnit}`}}</span>
              </div>
            </div>
            <div class="used" v-if="statusObj.status != 1">
              <img class="used-img"
                   :src="require(`../../../../../static/image/login2/${statusObj.status == 2 ? 'already-used' : 'expired'}.png`)"
                   alt="">
            </div>
          </li>
        </ul>
      </van-list>
      
<!--      <ul v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" :infinite-scroll-immediate-check="true"-->
<!--          infinite-scroll-distance="80">-->
<!--        <li class="envelopes-list-box" v-for="(item, index) in dataArr" :key="index">-->
<!--          &lt;!&ndash;        柴油豆 oil-point-history&ndash;&gt;-->
<!--          <img v-if="statusObj.diesel && source == 21" class="img"-->
<!--               :src="require(`../../../../../static/image/login2/diesel.png`)" alt="">-->
<!--          <img v-else class="img"-->
<!--               :src="require(`../../../../../static/image/login2/${statusObj.status != 3 ? statusObj.effective : statusObj.invalid}.png`)"-->
<!--               alt="">-->
<!--          <div class="details">-->
<!--            <div class="details-left">-->
<!--              <span class="title">{{item.changeReason?item.changeReason:item.orderTypeName}}</span>-->
<!--              <span class="money textColor">{{item.amountYuan}}</span>-->
<!--              <span class="time textColor"><i>{{item.paidTime}}</i></span>-->
<!--            </div>-->
<!--            <div class="details-right">-->
<!--              <span class="text" :class="classArr[statusObj.status-1]">{{`${statusObj.status == 1 ? '+' : ''}${item.amountUnit}`}}</span>-->
<!--            </div>-->
<!--          </div>-->
<!--          <div class="used" v-if="statusObj.status != 1">-->
<!--            <img class="used-img"-->
<!--                 :src="require(`../../../../../static/image/login2/${statusObj.status == 2 ? 'already-used' : 'expired'}.png`)"-->
<!--                 alt="">-->
<!--          </div>-->
<!--        </li>-->
<!--      </ul>-->
<!--      <div class="no-data theme_font_tint" v-if="!hasMore">没有更多数据了~</div>-->
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import Scroll from '@/components/base/scroll/scroll'

  export default {
    props: {
      statusObj: {
        type: Object,
        default() {
          return {}
        }
      },
      valueKey: {
        type: Object,
        default() {
          return {}
        }
      },
      source: {
        type: Number
      }
    },
    mounted() {
      console.log(this.statusObj)
    },
    data() {
      return {
        page: 0,
        newPage: 0,
        hasMore: true,
        loading: false,
        finished: false,
        classArr: ['text1', 'text2', 'text3'],
        dataArr: []
      }
    },
    watch: {
      'statusObj.payTypeCodes': {
        handler: function (val) {
          this.page = 0
          this.loading = false
          this.hasMore = true
          this.dataArr = []
          this.loadMore()
        },
        immediate: true
      }
    },
    methods: {
      loadMore() {
        console.log(123213321231232332321)
        this.page++
        // this.loading = true
        // this.$Loading.open()
        let paramsData = {
          page: this.page,
          rows: 10,
          distOuCode: 1, // 发单机构
          payTypeCodes: this.statusObj.payTypeCodes,
          token: this.$store.state.login.token,
          groupValue: this.statusObj.groupValue,
          acctType: this.source
        }
        
        this.$request.post(this.statusObj.url, paramsData).then(res => {
          if(res.status == 0){
            this.dataArr = this.dataArr.concat(res.data || [])
            if(this.dataArr.length >= res.totalRecords){
              this.finished = true
            }
          }else{
            this.finished = true
            this.$Toast(res.info ? res.info : '获取列表失败')
          }
          this.loading = false
        })
        
        // this.$http.post(this.statusObj.url, paramsData).then(res => {
        //   let data = res.data
        //   if (data.status == 0) {
        //     this.dataArr = this.dataArr.concat(data.data || [])
        //     this.newPage = data.page
        //     if (this.dataArr.length < data.totalRecords) {
        //       this.loading = false
        //     } else {
        //       this.hasMore = false
        //     }
        //   } else {
        //     this.$Toast(data.info)
        //   }
        //   this.$Loading.close()
        // })
      }
    },
    components: {Scroll}
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  @import "~@/common/stylus/variable.styl"
  .envelopes-list {
    display flex
    flex-direction column
    height 100%;
    overflow-y auto

    .content-title {
      padding: 11px
      font-size $font-size-medium-x

      .content-title-right {
        float right
        font-weight $font-weight-m
        color #A6202B
      }

      .content-title-left {
        font-weight $font-weight-m
      }
    }

    .content-row {
      padding: 0 10px
      flex 1
      overflow-y auto
      -webkit-overflow-scrolling touch

      .envelopes-list-box {
        overflow: hidden
        margin 10px 0
        position relative
        padding 10px 2px
        border-radius 5px
        box-shadow: 0 0 9px 0 rgba(197, 197, 197, 0.3)
        background white
        display flex

        .img {
          width 36px
          height 50px
          margin auto 16px
        }

        .details {
          display flex
          align-items center

          span {
            display block
          }

          .details-left {
            .opacity {
              opacity: 0
            }

            .textColor {
              font-size $font-size-medium
              color #9e9494
            }

            .title {
              margin 10px 0
              font-size $font-size-medium-x
            }

            .money {
              margin 10px 0
            }

            .time {
              margin 10px 0

              i {
                font-style: normal
              }
            }
          }

          .details-right {
            position absolute
            right 6%

            .text {
              font-size $font-size-medium-x
              font-weight $font-weight-m
            }
          }
        }
      }
    }

    .used {
      position: absolute
      right: -14px
      top: 16%
      transform translateY(-50%)

      .used-img {
        width 60px
      }
    }

    .no-data {
      padding: 15px;
      text-align: center;
    }

    .text1 {
      color #A6202B
    }

    .text2 {
      color #0ca237
    }

    .text3 {
      color #9e9494
    }
  }
</style>
