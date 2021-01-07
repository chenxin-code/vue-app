<template>
  <div class="tygl">
    <nav-top @backEvent="backEvent">
    </nav-top>
    <nav-content>
      <div class="center mine-box-shodow">
        <ul class="setting-list">
          <li
            class="setting-item public-bar border-bottom"
            :class="{'icon-more': item.rightText == ''}"
            v-for="(item,index) in settingList"
            @click="jumpUrl(item)">
            <span class="left-text">{{item.name}}</span>
            <span class="right-text">{{item.rightText}}</span>
          </li>
        </ul>
      </div>
    </nav-content>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      settingList: [
        { name: '经营许可证', id: '1', rightText: '' },
        { name: '备案信息', id: '2', rightText: '' },
      ]
    }
  },
  methods: {
    backEvent() {
      this.$router.go(-1);
    },
    jumpUrl(item) {
      if (item.id == '1') {
        this.$router.push({
          path: '/usercenter/qualificationContent',
          query: {
            queryType: 69
          }
        })
      } else if (item.id == '2') {
        this.$router.push({
          path: '/usercenter/qualificationContent',
          query: {
            queryType: 70
          }
        })
      }
    },
    arrRemoveId: function(list, id) {
      let arr = []
      for (let i = 0; i < list.length; i++) {
        if (list[i].id != id) {
          arr.push(list[i])
        }
      }
      return arr
    },
  },
  created() {
  },
  beforeRouteLeave(to, from, next) {
    if (to.query.queryType == 69) {
      to.meta.title = '经营许可证'
    } else if (to.query.queryType == 70) {
      to.meta.title = '备案信息'
    }
    next()
  }
}

</script>
<style lang="stylus" scoped>
@import "~@/common/stylus/variable.styl"
@import "../css/usercenter.styl"

.tygl {
  width 100%;
  height 100%;
  overflow hidden;

  .center {
    margin 10px;
    border-radius: 5px;

    .setting-list {
      .setting-item {
        .right-text {
          margin-right: 10px;
          color: #666;
          font-size: $font-size-medium-s;
        }
      }
    }
  }
}

</style>
