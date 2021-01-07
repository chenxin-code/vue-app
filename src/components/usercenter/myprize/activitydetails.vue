<template>
  <div class="pay-settings">
    <nav-top title="活动详情" @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="pay-setting">
      <div class="pay-box">
        <ul class="prize-list">
          <li class="prize-item">
            <div class="title theme_font_common">活动名称</div>
            <div class="content theme_font_common">{{details.activityTitle}}</div>
          </li>
          <li class="prize-item">
            <div class="title theme_font_common">活动类型</div>
            <div class="content theme_font_common">{{details.activityType}}</div>
          </li>
          <li class="prize-item">
            <div class="title theme_font_common">活动时间</div>
            <div class="content theme_font_common">{{details.startDate}}-{{details.endDate}}</div>
          </li>
          <li class="prize-item">
            <div class="title theme_font_common">玩法说明</div>
            <div class="content theme_font_common">{{details.activityPriceLevel}}</div>
          </li>
        </ul>
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
        details: ''
      }
    },
    created() {
    },
    mounted() {
      this.details = this.$route.query.item
      console.log(this.details)
    },
    methods: {},
    computed: {},
    components: {
      Cell
    }
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  @import "~@/common/stylus/variable.styl"
  .pay-settings {
    .pay-box {
      height 100%
      overflow: auto
      .prize-list {
        padding: 11px 15px
        .prize-item {
          box-shadow: 0 0 9px 0 rgba(197, 197, 197, 0.3)
          border-radius 4px
          margin-bottom: 10px
          padding: 15px
          line-height 18px
          position: relative
          .title {
            font-size 14px
            font-weight bold
            padding-bottom: 3px
          }
          .content {
            font-size: 12px
          }
        }
      }
    }
  }
</style>
