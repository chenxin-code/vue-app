<template>
  <div class="pay-settings">
    <nav-top title="我的奖品" @backEvent="$router.go(-1)" >
      <span @click="openMore" class="more-btn theme_font_red">获取更多</span>
    </nav-top>
    <nav-content class="pay-setting">
      <div class="pay-box">
        <ul class="prize-list" v-infinite-scroll="loadMore"
            infinite-scroll-disabled="loading"
            :infinite-scroll-immediate-check="true"
            infinite-scroll-distance="80">
          <li class="prize-item" v-for="(item, index) in prizeList" :key="index">
            <div class="img">
              <img src="./img/jp.png" alt="">
            </div>
            <div class="time theme_font_red_i">{{item._createTime}}</div>
            <div class="content">
              <p class="title">{{item.activityTitle}}</p>
              <ul>
                <li v-for="(prize, index) in item.mktActivityAwardRecList" :key="index" class="item theme_font_tint_i">{{prize.awardName}} x {{prize.awardNum}}</li>
              </ul>
            </div>
          </li>
        </ul>
        <div class="no-data theme_font_tint" v-show="!hasMore">没有更多数据了~</div>
      </div>
    </nav-content>
  </div>
</template>

<script type="text/ecmascript-6">
  import {Cell} from 'mint-ui'

  export default {
    name: '',
    data() {
      return {
        prizeList: [], // 列表
        hasMore: true,
        loading: false,
        page: 0,
        rows: 10,
        createTime: ''
      }
    },
    created() {
    },
    mounted() {
      this.loadMore()
    },
    methods: {
      openMore() {
        // 点击获取更多
        this.$router.push({path: '/usercenter/activitylist'})
      },
      loadMore() {
        // 获取所获奖品
        this.$Loading.open()
        this.page++
        this.loading = true
        let paramsData = {
          token: this.$store.state.login.token,
          page: this.page,
          rows: this.rows,
        }
        this.$http.post('/app/json/app_market/queryMyAwardGroupByActivity', paramsData).then(res => {
          let data = res.data
          if (data.status == 0) {
            // 商品列表
            let list = data.data || []
            list.map(item => {
              if (item.mktActivityAwardRecList && item.mktActivityAwardRecList[0]) {
                item._createTime = item.mktActivityAwardRecList[0].createTime
              }
              return item
            })
            this.prizeList = this.prizeList.concat(list)
            if (this.prizeList.length < data.totalRecords) {
              this.loading = false
            } else {
              this.hasMore = false
            }
          }
          this.$Loading.close()
        })
      }
    },
    computed: {},
    components: {
      Cell
    }
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  @import "~@/common/stylus/variable.styl"
  .pay-settings {
    position relative
    .more-btn {
      position: absolute
      right 10px
      font-size 12px
      font-weight bold
    }
    .pay-box {
      height 100%
      overflow: auto
      .prize-list {
        padding: 11px 15px 11px 50px
        .prize-item {
          box-shadow: 0 0 9px 0 rgba(197, 197, 197, 0.3)
          border-radius 4px
          margin-bottom: 10px
          padding: 15px
          line-height 20px
          position: relative
          &:after {
            left: 40px
          }
          overflow visible
          &:not(:last-child):before {
            content ''
            left: -20px
            top: 23px
            position: absolute
            width: 1px
            height: 100%
            pointer-events: none
            box-sizing: border-box
            /*background: #f62e2e*/
            z-index: 9
            background-image: linear-gradient(to bottom, #f62e2e 0%, #f62e2e 50%, transparent 50%);
            background-size: 1px 8px
            background-repeat: repeat-y
            /*border: 1px dashed #f62e2e*/
          }
          .time {
            font-size 16px
            font-weight bold
            padding-bottom: 10px
          }
          .title {
            font-size 14px
          }
          .item {
            text-indent 15px
          }
          .img {
            left: -29px
            top: 8px
            position: absolute
            img {
              width: 20px
              vertical-align top
            }
          }
        }
      }
      .no-data {
        padding: 15px
        text-align: center
      }
    }
  }
</style>
