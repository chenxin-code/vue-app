<template>
  <div class="apply-card">
    <nav-top title="办卡申请" @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="apply-card-details">
      <div class="no-apply-card-content">
        <div class="card" v-for="(item, index) in cardList" :key="index" @click="openCardDetails(item.id)">
          <div class="img">
            <img src="./image/icon4@2x.png" alt="">
          </div>
          <div class="details">
            <div class="title">加油卡</div>
            <!--<div class="status" v-if="item.applyState == 1 || item.applyState == 2">申请状态：已申请</div>-->
            <div class="status" v-if="item.applyState == 1">申请状态：待审核</div>
            <div class="status" v-else-if="item.applyState == 3">申请状态：已审核待发卡</div>
            <div class="status" v-else-if="item.applyState == 4 && item.distriMode == 1">申请状态：已发卡待收货</div>
            <div class="status" v-else-if="item.applyState == 4 && item.distriMode == 2">申请状态：已发卡待提货</div>
            <div class="status" v-else-if="item.applyState == 5">申请状态：完成</div>
            <div class="status" v-else-if="item.applyState == 0">申请状态：审批未通过</div>
            <div class="status" v-else-if="item.applyState == -1">申请状态：取消办理</div>
            <div class="time">申请时间：{{item.applyTime}}</div>
          </div>
        </div>
        <div class="submit-btn" @click="openNoApplyCard">申请新卡</div>
      </div>
    </nav-content>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: '',
    data() {
      return {
        cardList: [], // 加油卡列表
      }
    },
    created() {
    },
    mounted() {
      this.applyCardList()
    },
    methods: {
      applyCardList() {
        // app办卡列表
        this.$Loading.open()
        let paramsData = {
          token: this.$store.state.login.token,
        }
        this.$http.post('/app/json/user_apply_card/applyCardList', paramsData).then(res => {
          let data = res.data
          if (data.status == 0) {
            this.cardList = data.data
          } else {
            this.$Toast(data.info)
          }
          this.$Loading.close()
        })
      },
      openNoApplyCard() {
        // 打开办卡页面
        if (this.cardList.length == 0) {
          // 没有卡
          this.$router.push({path: '/no-apply-card'})
        } else {
          const cardList = [5, 0, -1] // 5是完成 0是审批未通过 -1 取消审核
          for (let i = 0; i < this.cardList.length; i++) {
            if (!cardList.includes(this.cardList[i].applyState)) {
              this.$Toast('油卡还在审批中，审批完再申请吧')
              break
            } else {
              this.$router.push({path: '/no-apply-card'})
            }
          }
        }
      },
      openCardDetails(id) {
        // 进到加油卡详情页
        this.$router.push({path: '/applyed-card', query: {cardId: id}})
      }
    },
    computed: {},
    components: {}
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  @import "~@/common/stylus/variable.styl"
  .apply-card-details {
    overflow auto

    .no-apply-card-content {
      padding: 11px 15px
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      overflow-y auto
      -webkit-overflow-scrolling touch
      padding-bottom: 60px

      .card {
        background: #fff
        box-shadow: 0 0 9px 0 rgba(197, 197, 197, 0.3)
        border-radius 6px
        padding: 11px 15px
        display flex
        justify-content left
        align-items center
        margin-bottom: 10px

        .img {
          padding-right: 15px

          img {
            width: 40px
          }
        }

        .details {
          line-height 24px
          color: $color-text-d

          .title {
            font-weight bold
            font-size: 16px
          }
        }
      }

      .submit-btn {
        background-color: #f02c2d;
        color: #fff;
        text-align: center;
        padding: 0.32rem 0;
        border-radius: 50px;
        position: fixed;
        bottom: 20px;
        left: 0
        right: 0
        width: 90%;
        margin: 0 auto
        box-shadow: 0 3px 10px 1px rgba(240, 44, 45, 0.5);

        &[disabled] {
          opacity 0.5
        }
      }
    }
  }
</style>
