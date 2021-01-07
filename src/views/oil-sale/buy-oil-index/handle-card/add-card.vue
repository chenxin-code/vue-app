<template>
  <div class="add-card">
    <nav-top title="新赠提油卡" @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="add-card-container">
      <ul class="list">
        <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="loadMore">
          <li class="item" v-for="(item, index) in cardList" :key="index">
            <div class="left">
              <div class="info">订单编号：{{item.oilcode}}</div>
              <div class="info">油品名称：{{item.oilname}}</div>
              <div class="info">剩余数量：{{item.num}}</div>
            </div>
            <div class="right" @click="openHandleCard(item)">
              <div class="btn">提油卡办理</div>
            </div>
          </li>
        </van-list>
      </ul>
    </nav-content>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'

  export default {
    data() {
      return {
        cardList: [],
        loading: false,
        finished: false,
        page: 0,
        info: ''
      }
    },
    mounted() {
    },
    methods: {
      loadMore() {
        // 获取金豆兑换订单列表数据
        this.page = this.page + 1
        let paramsData = {
          token: this.$store.state.login.token,
          vipUnitUserCode: this.vipUnitUser.vipUnitUserId, // 单位用户id
          page: {
            index: this.page,
            pageSize: 20
          }
        }
        this.$http.post('/app/json/app_oil_appoint/appSaledUnreceive', paramsData).then(res => {
          let data = res.data
          if (data.status == 0) {
            this.cardList = this.cardList.concat(data.data.totalOilInfo || [])
            this.info = data.data
            if (this.cardList.length >= data.totalRecords) {
              this.finished = true
            }
            console.log(this.cardList)
          } else {
            this.finished = true
            this.$Toast(res.info ? res.info : '获取列表失败')
          }
          this.loading = false
        })
      },
      openHandleCard(item) {
        // 提油卡办理
        this.$router.push({path: '/handle-card', query: {source: 'handle', details: JSON.stringify(item), info: JSON.stringify(this.info)}})
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
  $color = #3c9df3
  .add-card {
    .add-card-container {
      padding: 11px 0 60px 0
      overflow-y auto
      height 100%

      .list {
        padding: 0 15px

        .item {
          box-shadow: 0 0 15px 0 rgba(197, 197, 197, 0.5)
          border-radius 6px
          padding: 11px 15px
          display flex
          justify-content space-between
          align-items center
          margin-bottom: 10px

          .left {
            line-height 24px
            flex: 1
          }

          .right {
            width: 85px

            .btn {
              width 100%
              background $color
              color: #fff
              border-radius 20px
              padding: 10px 1px
              text-align center
            }
          }
        }
      }
    }
  }
</style>
