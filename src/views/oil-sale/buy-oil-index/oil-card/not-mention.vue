<template>
  <div class="no-mention">
    <nav-top title="已售未提" @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="no-mention-container" v-if="complete">
      <div class="my-title-info" v-if="saledUnreceive.departname">
        <!-- 公司详情 -->
        <div class="top">
          <div class="img">
            <img src="../../assets/image/tx2.png" alt="">
          </div>
          <div class="info">
            <div class="name">{{ saledUnreceive.departname }}</div>
            <div class="company-num">单位税务编号：{{ saledUnreceive.taxcode }}</div>
          </div>
        </div>
        <!-- 公司库存汇总 -->
        <div class="list">
          <div class="item" v-for="(item, index) in oilInfoList" :key="index">
            <div class="left">{{item.oilcode}}{{item.oilname}}</div>
            <div class="right">剩余{{item.num}}t</div>
          </div>
        </div>
      </div>
      <!-- 提油卡余量详情 -->
      <div class="my-title-info" v-for="(item, index) in cardList" :key="index">
        <div class="top">
          <div class="card-num">提油卡号：{{item.cardno}}</div>
        </div>
        <div class="list">
          <div class="item" v-for="(item, index) in oilInfoList" :key="index">
            <div class="left">{{item.oilname}}</div>
            <div class="right">剩余{{item.num}}t</div>
          </div>
        </div>
      </div>
      <div class="no-data theme_font_tint" v-show="!hasMore">没有更多数据了~</div>
    </nav-content>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'

  export default {
    data() {
      return {
        oilInfoList: [],
        cardList: [],
        departcode: '', // 单位编码
        departname: '', // 单位名称
        taxcode: '', // 税务编码
        complete: false,
        hasMore: true,
        saledUnreceive: '' // 已售未提 详情
      }
    },
    mounted() {
      this.getInfo()
    },
    methods: {
      getInfo() {
        // 先清空data 
        this.saledUnreceive = '' // 已售未提 详情
        this.oilInfoList = []   // 未提油品总数信息
        this.cardList = []      // 单卡未提油品信息
        this.$request.post('/app/json/app_oil_appoint/appSaledUnreceive', {
          vipUnitUserCode: this.vipUnitUser.vipUnitUserId, // 单位用户id
        })
          .then(res => {
            this.complete = true
            this.hasMore = false
            if (res.status === 0) {
              let data = res.data
              this.saledUnreceive = data
              this.oilInfoList = this.saledUnreceive.totalOilInfo  // 未提油品总数信息
              this.cardList = this.saledUnreceive.cardoilInfo      // 单卡未提油品信息
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
    components: {}
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/variable.styl"
  .no-mention {
    background-color: #f8f8f8 !important

    .no-mention-container {
      padding: 11px 15px
      -webkit-overflow-scrolling touch
      overflow-y auto

      .my-title-info {
        box-shadow: 0 0 9px 0 rgba(197, 197, 197, 0.3)
        background: #b9dff2
        border-radius 4px
        margin-bottom: 10px

        .top {
          padding 15px
          display flex
          justify-content left
          align-items center
          border-bottom: 0.5px solid #a7d1e6

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

  .no-data {
    text-align center
    padding: 15px 0
  }
</style>
