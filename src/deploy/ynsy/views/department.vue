<template>
  <div class="department">
    <nav-top :title="title" @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="department-container">
      <div class="nav-bar">
        <div
          class="nav-bar-item"
          :class="{active: currentIndex === index}"
          v-for="(item, index) in tabList"
          @click="tabChange(index)"
        >
          <span class="text">{{item.text}}</span>
        </div>
      </div>
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="loadMore">
        <ul class="list">
          <li class="item" v-for="(item, index) in list" :key="index" @click="openDetails(item.id)">
            <div class="left">
              <div class="text">
                <div class="title">员工编号</div>
                <div class="info">{{item.staffCode}}</div>
              </div>
              <div class="text">
                <div class="title">姓名</div>
                <div class="info">{{item.name}}</div>
              </div>
              <div class="text">
                <div class="title">职位</div>
                <div class="info">{{item.position}}</div>
              </div>
              <div class="text">
                <div class="title">提交时间</div>
                <div class="info">{{item.submitTime}}</div>
              </div>
            </div>
            <div class="right">
              <div class="btn" v-if="currentIndex == 0" @click="goEvaluation(item.id)">{{type == 1 ? '评价' : '考评'}}</div>
            </div>
            <div class="tips" v-if="currentIndex == 1">
              <img src="../images/icon@2x.png" v-if="type == 1" alt="">
              <img src="../images/kaoping@2x.png" v-else alt="">
            </div>
          </li>
        </ul>
      </van-list>
    </nav-content>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        active: 1,
        currentIndex: 0,
        tabList: [],
        loading: false,
        finished: false,
        page: 0,
        list: [],
        title: '',
        type: '',
        complete: false
      }
    },
    mounted() {
      this.type = this.$route.query.type || ''
      this.tabList = [
        {text: `待${this.type == 1 ? '评价' : '考评'}`, type: 1},
        {text: `已${this.type == 1 ? '评价' : '考评'}`, type: 2}
      ]
      this.title = this.type == 1 ? '部门负责人评价' : '考评中心'
    },
    methods: {
      goEvaluation(id) {
        this.$router.push({path: '/evaluation', query: {type: this.type, id: id}})
      },
      openDetails(id) {
        if (this.currentIndex == 1) {
          this.$router.push({path: '/evaluation', query: {type: this.type, id: id, currentIndex: this.currentIndex}})
        }
      },
      loadMore() {
        let url = ''
        url = this.type == 1 ? '/app/json/evaluation_center/evaluationList' : '/app/json/evaluation_center/evaluationManageList'
        // 获取金豆兑换订单列表数据
        this.page = this.page + 1
        let paramsData = {
          token: this.$store.state.login.token,
          state: this.currentIndex, // 0:待评论1:已评论
          page: {
            index: 0,
            pageSize: 20
          }
        }
        this.$http.post(url, paramsData).then(res => {
          let data = res.data
          if (data.status == 0) {
            this.list = this.list.concat(data.data).reverse()
            if (this.list.length >= data.totalRecords) {
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
        this.currentIndex = index
        this.list = []
        this.page = 0
        this.finished = false

      }
    },
    components: {}
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/variable.styl"
  .department {
    .department-container {
      display flex
      flex-direction column

      .nav-bar {
        flex-shrink 0
        height: 44px
        line-height: 44px
        display: flex
        background: #fff
        padding: 11px 15px
        margin-bottom: 10px

        .nav-bar-item {
          text-align: center
          flex: 1
          font-size: 14px

          .text {
          }

          &.active {
            .text {
              color: $color-theme-r
              position: relative

              &:after {
                content: ''
                position: absolute
                bottom: -6px
                width: 100%
                left: 0
                height: 2px
                background: $color-theme-r
              }
            }
          }
        }
      }

      /deep/ .van-list {
        flex: 1
        overflow-y auto
        -webkit-overflow-scrolling touch

        .list {
          padding: 11px 15px

          .item {
            position relative
            margin-bottom: 10px
            box-shadow: 0 0 15px 0 rgba(197, 197, 197, 0.5)
            background: #fff
            border-radius 6px
            display flex
            justify-content space-between
            align-items center
            padding: 11px 0 11px 15px

            .tips {
              position absolute
              right: 0
              top: 0

              img {
                width 40px
              }
            }

            .left {
              line-height 24px
              flex: 1

              .text {
                display flex
                justify-content left
                align-items center

                .title {
                  width: 65px
                  color: $color-text-d
                }

                .info {
                  color: $color-text
                }
              }
            }

            .right {
              width: 90px

              .btn {
                margin: 0 auto
                width 80%
                text-align center
                border-radius 20px
                border: 1px solid $color-theme-r
                color: $color-theme-r
                padding: 10px 0
              }
            }
          }
        }
      }
    }
  }
</style>
