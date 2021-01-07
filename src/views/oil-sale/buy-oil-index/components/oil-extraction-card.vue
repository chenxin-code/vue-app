<template>
  <div class="oil-extraction-card">
    <div class="order-list">
      <div class="order-item" @click="openAppointmentOil">
        <div class="img">
          <img src="../../assets/image/yyty.png" alt="">
        </div>
        <div class="text">预约提油</div>
      </div>
      <div class="order-item" @click="openNoMention">
        <div class="img">
          <img src="../../assets/image/yswt.png" alt="">
        </div>
        <div class="text">已售未提</div>
      </div>
      <div class="order-item" @click="openHaveMention">
        <div class="img">
          <img src="../../assets/image/ysyt.png" alt="">
        </div>
        <div class="text">已售已提</div>
      </div>
      <div class="order-item" @click="openBuyOilRecord">
        <div class="img">
          <img src="../../assets/image/gyjl.png" alt="">
        </div>
        <div class="text">购油记录</div>
      </div>
    </div>
    <ul class="rebate-envelopes-list">
      <li class="rebate-envelopes-item" v-for="(item, index) in cardList" :key="index"
          :class="{'lose': cardStatus == false}">
        <div class="card-show">
          <div class="title">
            <div class="left-title">提油卡号&nbsp;&nbsp;{{item.userCard}}</div>
            <div class="right-record" v-show="cardStatus">正常</div>
            <div class="right-record" v-show="!cardStatus">注销</div>
          </div>
          <div class="go-use-btn" @click="openMentionOilRecord(item.userCard)">
            提油记录<img src="../../assets/image/arrowWrite.png" alt="">
          </div>
        </div>
      </li>
    </ul>
    <div class="no-data theme_font_tint" v-show="!hasMore">没有更多数据了~</div>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        cardList: [],
        cardStatus: true, // 卡的状态
        hasMore: true
      }
    },
    mounted() {
      this.getOilCardList()
    },
    methods: {
      openAppointmentOil() {
        // 打开预约提油页面
        this.$router.push({path: '/appointment-oil'})
      },
      openNoMention() {
        // 打开已售未提页面
        this.$router.push({path: '/not-mention'})
      },
      openHaveMention() {
        // 打开已售已提页面
        this.$router.push({path: '/have-mention'})
      },
      openBuyOilRecord() {
        // 打开购油记录页面
        this.$router.push({path: '/buy-oil-record'})
      },
      openMentionOilRecord(card) {
        // 打开提油记录页面
        this.$router.push({path: '/mention-oil-record', query: {oilCardno: card}})
      },
      getOilCardList() {
        // 获取油卡列表
        this.cardList = []
        this.$request.post('/app/json/app_oil_appoint/appQueryTakeOilCardList')
          .then(res => {
            this.hasMore = false
            if (res.status === 0) {
              let data = res.data
              this.cardList = data
            } else {
              this.$Toast(res.info ? res.info : '获取卡列表失败')
            }
          }).catch(err => {
          this.$Toast(res.info ? res.info : '获取卡列表失败')
        })
      }
    },
    components: {}
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/variable.styl"
  .oil-extraction-card {
    padding: 11px 15px

    .order-list {
      box-shadow: 0 0 9px 0 rgba(197, 197, 197, 0.3)
      background: #fff
      border-radius 4px
      padding: 15px 15px 11px 15px
      display flex
      justify-content space-between
      align-items center
      text-align center
      line-height 20px
      color: $color-text

      .img {
        img {
          width: 30px

        }
      }
    }

    .rebate-envelopes-list {
      color: #fff
      font-size: 14px
      padding: 10px 0

      .rebate-envelopes-item {
        padding: 11px 15px
        background url('../../assets/image/bg1.png') no-repeat
        background-size 100% 100%
        line-height 28px
        height: 120px

        .card-show {
          height: 100%
          display flex
          justify-content space-between
          align-items left
          flex-direction column

          .title {
            display flex
            justify-content space-between
            align-items center

            .left-title {
              font-size: 18px
            }

            .right-record {
              font-size 12px
            }
          }

          .go-use-btn {
            display flex
            align-items center

            img {
              display inline-block
              width: 6px
              margin-left: 5px
            }
          }
        }

        & + .rebate-envelopes-item {
          margin-top: 10px
        }
      }

      .lose {
        background url('../../assets/image/bg2.png') no-repeat
        background-size 100% 100%
      }
    }
  }

  .no-data {
    text-align center
    padding: 15px 0
  }
</style>
