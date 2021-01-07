
<template>
  <div class="oil-group">
    <nav-top @backEvent="$router.go(-1)">
      <div class="my-cards" @click.stop="myGroup">我的拼团</div>
    </nav-top>
    <nav-content class="oil-group-container">
      <div class="group-list" v-for="(item, index) in groupList" :key="index">
        <Group :details="item" @updateData="updateData"></Group>
      </div>
      <div class="no-data" v-if="!groupList.length">
        <div class="img">
          <img src="./image/no-group.png" alt="">
        </div>
        <div class="tips">暂无可参与的团</div>
      </div>
    </nav-content>
  </div>
</template>

<script>
  import Group from './components/group'

  export default {
    data() {
      return {
        groupList: [] // 拼团列表
      }
    },
    mounted() {
      this.queryAssembleActivityList()
    },
    methods: {
      updateData() {
        // 重新获取列表信息
        this.queryAssembleActivityList()
      },
      queryAssembleActivityList() {
        // 获取拼团活动
        this.$request.post('/app/json/app_assemble_activity/queryAssembleActivityList').then(res => {
          if (res.status == 0) {
            this.groupList = res.data
          } else {
            this.$Toast(res.info ? res.info : '获取活动失败')
          }
        })
      },
      myGroup() {
        // 我的拼团
        this.$router.push({path: '/my-oil-group'})
      }
    },
    components: {
      Group
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/variable.styl"
  .oil-group {
    .my-cards {
      position absolute
      right 10px
      top 0
      font-size 13px
    }
    .oil-group-container {
      padding: 11px 15px
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
</style>
