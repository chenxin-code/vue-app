<template>
  <div class="have-mention">
    <nav-top class="nav-top" title="已售已提" @backEvent="$router.go(-1)">
      <div>
        <ScreenPopup @childToDadValue="screenChild" :isShowChangeOilName="isShowChangeOilName"></ScreenPopup>
      </div>
    </nav-top>
    <nav-content class="have-mention-container">
      <div class="my-title-info" v-for="(item, index) in cardList" :key="index" v-if="complete">
        <div class="top">
          <div class="card-num">油品名称：{{item.oilname}}</div>
        </div>
        <div class="list">
          <div class="item">
            <div class="left">提油油库</div>
            <div class="right">{{item.oilHouse}}</div>
          </div>
          <div class="item">
            <div class="left">提油卡号</div>
            <div class="right">{{item.userCard}}</div>
          </div>
          <div class="item">
            <div class="left">提油数量</div>
            <div class="right">{{item.tons}}</div>
          </div>
          <div class="item">
            <div class="left">提油时间</div>
            <div class="right">{{item.receiveTime}}</div>
          </div>
        </div>
      </div>
      <div class="no-data theme_font_tint" v-show="!hasMore">没有更多数据了~</div>
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
        oilName: '',
        complete: false,
        hasMore: true,
        isShowChangeOilName: true
      }
    },
    mounted() {
      this.getInfo()
    },
    methods: {
      screenChild(data) {//筛选子组件传过来的值
        this.startTime = data[0]
        this.endTime = data[1]
        this.oilCardno = data[2]
        this.oilName = data[3]
        this.cardList = []
        this.getInfo();
      },
      getInfo() {
        let formDataJson = {
          oilCardno: this.oilCardno,
          startTime: this.startTime,
          endTime: this.endTime,
          oilName: this.oilName,
          vipUnitUserCode: this.vipUnitUser.vipUnitUserId, // 单位用户id
        }
        this.$request.post('/app/json/app_oil_appoint/appQueryCompleteOrder', formDataJson)
          .then(res => {
            this.complete = true
            this.hasMore = false
            if (res.status === 0) {
              let data = res.data
              this.cardList = data
            } else {
              this.$Toast(res.info ? res.info : '获取数据失败')
            }
          }).catch(err => {
          console.log(err);
        })
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
      -webkit-overflow-scrolling touch
      overflow-y auto

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

  .nav-top {
    overflow visible !important

    /deep/ .navcontent {
      overflow visible !important
    }
  }

  .no-data {
    text-align center
    padding: 15px 0
  }
</style>
