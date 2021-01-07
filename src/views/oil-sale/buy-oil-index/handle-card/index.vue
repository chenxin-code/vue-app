<template>
  <div class="handle-card">
    <nav-top title="提油卡" @backEvent="$router.go(-1)">
      <div class="phone-bill" @click="openBill">
        <img src="../../assets/image/zd.png" alt="">
      </div>
    </nav-top>
    <nav-content class="handle-card-container">
      <div class="top">
        <div class="left">
          <img src="../../assets/image/icon-card.png" alt="">
          <span>已办提油卡({{cardList.length || 0}})</span>
        </div>
        <div class="right" @click="addCardBtn">
          <van-icon name="add" size="20"/>
          <span>新赠提油卡</span>
        </div>
      </div>
      <ul class="list">
        <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="loadMore">
          <li class="item" v-for="(item, index) in cardList" :key="index">
            <div class="info">提油卡号：{{item.cardNo}}</div>
            <div class="info">持卡人名称：{{item.cardUserName}}</div>
            <div class="info">{{item.oilName}}&nbsp;&nbsp;{{item.cardOilScale}}t</div>
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
        page: 0
      }
    },
    mounted() {
    },
    methods: {
      loadMore() {
        this.page = this.page + 1
        let paramsData = {
          token: this.$store.state.login.token,
          vipUnitCode: this.vipUnitUser.vipUnitUserCode, // 单位用户id
          applyState: 3, // 0:新建申请（待验证），1：审核通过，2：已取消（验证失败） 3：成功
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
            console.log(this.cardList)
          } else {
            this.finished = true
            this.$Toast(res.info ? res.info : '获取列表失败')
          }
          this.loading = false
        })
      },
      openBill() {
        // 打开记录
        this.$router.push({path: '/handle-oil-record'})
      },
      addCardBtn() {
        // 新赠提油卡
        this.$router.push({path: '/add-card'})
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
  .handle-card {
    .handle-card-container {
      padding: 11px 0
      display flex
      flex-direction column

      .top {
        display flex
        justify-content space-between
        align-items center
        flex-shrink 0
        padding: 0 15px

        .left, .right {
          display flex
          justify-content center
          align-items center

          img {
            width: 25px
          }

          span {
            margin-left: 3px
          }
        }
      }

      .list {
        padding: 10px 15px
        overflow-y auto
        flex 1
        -webkit-overflow-scrolling touch

        .item {
          box-shadow: 0 0 15px 0 rgba(197, 197, 197, 0.5)
          border-radius 6px
          padding: 11px 15px
          line-height 24px
          margin-bottom: 10px
        }
      }
    }

    .phone-bill {
      text-align right
      padding-right: 10px

      img {
        width: 20px
        vertical-align middle
      }
    }
  }
</style>
