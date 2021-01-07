<template>
  <div class="my-oil-group">
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="my-oil-group-container">
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
      <div class="list">
        <div class="group-list" v-for="(item, index) in groupList" :key="index">
          <Group :type="type" :currentIndex="currentIndex" :details="item"></Group>
        </div>
        <div class="no-data" v-if="!groupList.length">
          <div class="img">
            <img src="./image/no-data.png" alt="">
          </div>
          <div class="tips">暂无数据</div>
        </div>
      </div>
    </nav-content>
  </div>
</template>

<script>
  import Group from './components/group'
  export default {
    data() {
      return {
        groupList: [], // 拼团列表
        currentIndex: 0,
        goldMenu: [
          {
            text: "拼团中"
          },
          {
            text: "拼团成功"
          },
          {
            text: "拼团失败"
          }
        ], // tab
        type: '1' // 我的拼团 标识
      }
    },
    mounted() {
      this.queryMyAssemble()
    },
    methods: {
      queryMyAssemble() {
        // 获取我的拼团活动
        this.$request.post('/app/json/app_assemble_activity/queryMyAssemble', {
          assembleState: this.currentIndex + 1 // 拼团状态1: 拼团中（默认） 2: 拼团成功 3: 拼团失败
        }).then(res => {
          if (res.status == 0) {
            this.groupList = res.data
          } else {
            this.$Toast(res.info ? res.info : '获取我的拼团失败')
          }
        })
      },
      tabChange(index) {
        this.currentIndex = index
        this.groupList = []
        this.queryMyAssemble()
      }
    },
    components: {
      Group
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/variable.styl"
  .my-oil-group {
    .my-oil-group-container {
      padding: 11px 0
      display: flex
      flex-direction: column
      .nav-bar {
        height: 44px
        line-height: 44px
        display: flex
        background: #fff
        flex-shrink: 0
        padding: 0 15px

        .nav-bar-item {
          text-align: center
          flex: 1
          font-size: 14px

          .text {
            font-weight bold
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
                height: 3px
                background: $color-theme-r
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
        .no-data {
          padding: 50px
          text-align center
          display flex
          justify-content center
          align-items center
          flex-direction column
          .img {
            padding-bottom: 20px
            img {
              width: 200px
            }
          }
          .text {
            color: $color-text-d
          }
        }
      }
    }
  }
</style>
