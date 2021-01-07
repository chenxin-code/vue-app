<template>
  <div class="have-mention">
    <nav-top class="nav-top" title="提油记录" @backEvent="$router.go(-1)">
      <div>
        <ScreenPopup @childToDadValue="screenChild"></ScreenPopup>
      </div>
    </nav-top>
    <nav-content class="have-mention-container">
      <div class="card-show">提油卡号：{{oilCardno}}</div>
      <div class="my-content" v-if="complete">
        <div class="my-title-info" v-for="(item, index) in cardList" :key="index">
          <div class="top">
            <div class="card-num">油品名称：{{item.oilname}}</div>
          </div>
          <div class="list">
            <div class="item">
              <div class="left">提油油库</div>
              <div class="right">{{item.oilHouse}}</div>
            </div>
            <div class="item">
              <div class="left">提油数量</div>
              <div class="right">{{item.tons}}t</div>
            </div>
            <div class="item">
              <div class="left">提油时间</div>
              <div class="right">{{dealTime(item.orderTime)}}</div>
            </div>
          </div>
        </div>
        <div class="no-data theme_font_tint" v-show="!hasMore">没有更多数据了~</div>
      </div>
    </nav-content>
  </div>
</template>

<script>
  import ScreenPopup from '../../components/screening-popup'
  import {mapGetters} from 'vuex'

  export default {
    data() {
      return {
        cardList: [],
        startTime: '',
        endTime: '',
        oilCardno: '',
        complete: false,
        hasMore: true
      }
    },
    mounted() {
      this.oilCardno = this.$route.query.oilCardno
      this.getRecord()
    },
    methods: {
      screenChild(data) {//筛选子组件传过来的值
        this.startTime = data[0]
        this.endTime = data[1]
        this.oilCardno = data[2]
        this.cardList = []
        this.getRecord()
      },
      getRecord() {// 发送请求获取数据
        this.cardList = []
        let formDataJson = {
          oilCardno: this.oilCardno,
          startTime: this.startTime,
          endTime: this.endTime,
          vipUnitUserCode: this.vipUnitUser.vipUnitUserId, // 单位用户id
        }
        this.$request.post('/app/json/app_oil_appoint/appOilSaledRecord', formDataJson)
          .then(res => {
            this.complete = true
            this.hasMore = false
            if (res.status === 0) {
              let data = res.data
              this.cardList = data
            } else {
              this.$Toast(res.info ? res.info : '获取提油记录失败')
            }
          }).catch(err => {
          console.log(err);
        })
      },
      dealTime(time) {
        let dealtime = (this.insertStr(this.insertStr(time, 4, "-"), 7, "-"))
        return dealtime
      },
      insertStr(soure, start, newStr) {
        return soure.slice(0, start) + newStr + soure.slice(start)
      }
    },
    computed: {
      ...mapGetters(['vipUnitUser'])
    },
    components: {
      ScreenPopup
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/variable.styl"
  .have-mention {
    background-color: #f8f8f8 !important

    .have-mention-container {
      padding: 11px 15px
      display flex
      flex-direction column

      .card-show {
        background: #009cf6
        color: #fff
        border-radius 4px
        padding: 13px 0
        font-size: 14px
        text-align center
        margin-bottom: 10px
        flex-shrink 0
      }

      .my-content {
        -webkit-overflow-scrolling touch
        overflow-y auto
        flex: 1

        .my-title-info {
          box-shadow: 0 0 9px 0 rgba(197, 197, 197, 0.3)
          background: #fff
          border-radius 4px
          margin-bottom: 10px

          .top {
            padding 15px
            display flex
            justify-content left
            align-items center
            border-bottom: 0.5px solid $color-line-gray-l

            .img {
              width: 53px
              height: 53px
              border-radius 50%
              background #f8f8f8
              margin-right: 10px

              img {
                width: 100%
                height 100%
                border-radius 50%
              }
            }

            .info {
              flex: 1
              line-height 22px

              .name {
                font-size: 16px
              }

              .company-num {
                font-size: 12px
              }
            }

            .card-num {
              font-size: 14px
              font-weight bold
            }
          }

          .list {
            padding: 11px 15px
            font-size 14px
            color: $color-text

            .item {
              display flex
              justify-content space-between
              align-items center

              & + .item {
                padding-top: 11px
              }

              .right {
                color: $color-background
              }
            }
          }
        }
      }
    }
  }

  .no-data {
    text-align center
    padding: 15px 0
  }

  .nav-top {
    overflow visible !important

    /deep/ .navcontent {
      overflow visible !important
    }
  }
</style>
