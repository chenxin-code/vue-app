<template>
  <div class="tab" :class="{special: type == 1}" @click.stop v-if="isnativetop == 1">
    <div class="item" v-for="(item, index) in tabList" :key="index" @click="showTab(item)">
      <div class="text" @click="linkTo(item)" :class="{active: item.showClick}" >{{item.text.substr(0, 2)}}<br />{{item.text.substr(2, 2)}}</div>
    </div>
  </div>
</template>

<script>
  import Cookie from 'js-cookie'
  export default {
    data() {
      return {
        tabList: [
          {text: '套餐说明', type: 1, showClick: false},
          {text: '我的邀约', type: 2, showClick: false},
          {text: '历史签约', type: 3, showClick: false},
        ],
        active: true,
        isnativetop: '',
      }
    },
    props: {
      type: ''
    },
    mounted() {
      this.isnativetop = Cookie.get('isnativetop')
    },
    methods: {
      linkTo(item) {
        // 右上角菜单
        if (item.showClick == true && this.isnativetop == 1) {
          if (item.type == 1) {
            // 套餐说明
            this.$router.push({path: '/instructions'})
          } else if (item.type == 2) {
            // 我的邀约
            this.$router.push({path: '/my-invitation'})
          } else {
            // 历史签约
            this.$router.push({path: '/history-invitation'})
          }
        } else {
          if (item.type == 1) {
            // 套餐说明
            this.$router.push({path: '/instructions'})
          } else if (item.type == 2) {
            // 我的邀约
            this.$router.push({path: '/my-invitation'})
          } else {
            // 历史签约
            this.$router.push({path: '/history-invitation'})
          }
        }
      },
      showTab(item) {
        item.showClick = true
        this.tabList.forEach(tab => {
          if (item != tab) {
            tab.showClick = false
          }
        })
      }
    },
    components: {}
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .tab {
    position absolute
    right: 0
    top: 15px
    z-index: 99999

    .item {
      .text {
        width: 50px
        position: relative;
        right: -25px; /*no*/
        border-top-left-radius 20px
        border-bottom-left-radius 20px
        background-color: rgba(0, 0, 0, 0.6);
        color: #fff
        margin-bottom: 10px
        height: 33px;
        display: flex;
        justify-content: center;
        align-items: center
      }

      .active {
        right 0
      }
    }
  }
  .index-tab {
    .item {
      .text {
        right: 0; /*no*/
      }
    }
  }

</style>
