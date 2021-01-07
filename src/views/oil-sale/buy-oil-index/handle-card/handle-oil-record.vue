<template>
  <div class="handle-oil-record">
    <nav-top title="办卡记录" @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="handle-oil-record-container">
      <div class="nav-bar">
        <div
          class="nav-bar-item"
          :class="{active: currentIndex === index}"
          v-for="(item, index) in goldMenu"
          @click="tabChange(index)"
        >
          <span class="text">{{item.text}}</span>
        </div>
      </div>
      <ul class="list">
        <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="loadMore">
          <li class="item" v-for="(item, index) in cardList" :key="index">
            <div class="left" @click="openDetaile(item)">
              <div class="info">办卡人姓名：{{item.cardUserName}}</div>
              <div class="info">油品信息：{{item.oilName}}</div>
              <div class="info">申请办卡时间：{{item.applyTime}}</div>
            </div>
            <div class="right" @click="cancelBtn(item)" v-if="currentIndex == 0">
              <div class="btn">取消申请</div>
            </div>
          </li>
        </van-list>
      </ul>
    </nav-content>
  </div>
</template>

<script>
  import eventBus from '@/utils/eventBus.js'

  export default {
    data() {
      return {
        currentIndex: 0,
        goldMenu: [
          {
            text: "待验证"
          },
          {
            text: "验证成功"
          },
          {
            text: "已取消"
          }
        ], // tab
        cardList: [],
        loading: false,
        finished: false,
        page: 0
      }
    },
    mounted() {
      eventBus.$on('getErpOilCardListByUserId', () => {
        this.cardList = []
        this.page = 0
        this.finished = false
        this.loadMore()
      })
    },
    methods: {
      loadMore() {
        this.page = this.page + 1
        let paramsData = {
          token: this.$store.state.login.token,
          applyState: this.currentIndex, // 0:新建申请（待验证），1：验证成功，2：已取消（验证失败）
          page: {
            index: this.page,
            pageSize: 20
          }
        }
        this.$http.post('/app/json/app_oil_appoint/getErpOilCardListByUserId', paramsData).then(res => {
          let data = res.data
          if (data.status == 0) {
            this.cardList = this.cardList.concat(data.data || [])
            if (this.cardList.length >= data.totalRecords) {
              this.finished = true
            }
          } else {
            this.finished = true
            this.$Toast(res.info ? res.info : '获取列表失败')
          }
          this.loading = false
        })
      },
      tabChange(index) {
        // 根据菜单判断操作状态  待发货 待提货 已完成 等
        this.currentIndex = index
        this.cardList = []
        this.finished = false
        this.page = 0
      },
      cancelBtn(item) {
        // 取消申请
        this.$router.push({path: '/handle-card', query: {details: JSON.stringify(item)}})
      },
      openDetaile(item) {
        // 详情
        this.$router.push({path: '/handle-card', query: {details: JSON.stringify(item), currentIndex: this.currentIndex}})
      }
    },
    components: {}
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/variable.styl"
  $color = #3c9df3
  .handle-oil-record {
    .handle-oil-record-container {
      display: flex
      flex-direction: column

      .nav-bar {
        height: 44px
        line-height: 44px
        display: flex
        background: #fff
        flex-shrink: 0

        .nav-bar-item {
          text-align: center
          flex: 1
          font-size: 14px

          .text {
          }

          &.active {
            .text {
              color: #009df8
              position: relative

              &:after {
                content: ''
                position: absolute
                bottom: -6px
                width: 100%
                left: 0
                height: 2px
                background: #009df8
              }
            }
          }
        }
      }

      .list {
        padding: 10px 15px
        flex: 1
        overflow-y auto
        -webkit-overflow-scrolling touch

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
