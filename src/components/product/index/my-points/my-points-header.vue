/**Created by liaoyingchao on 2018/12/29.*/

<template>
  <div class="my-points-header" v-if="$store.state.webtype != '2'">
    <div class="top-div" :style="topDivStyle">
    </div>
    <div class="back-div" @click="backEvent">
      <img style="margin: 14px;width: 16px;height: 16px;" src="static/images/header/back.png"/>
    </div>
    <div style="line-height: 44px;position: absolute;left: 100px;right: 100px;
bottom: 0px;height: 44px;font-size: 18px;text-align: center;color: #fff;">我的积分</div>
    <div class="right-btns" style="padding: 12px 0;">
      <div style="padding: 3px 6px;border-radius: 10px;" class="btn-div" @click.stop="toAgreement">
        规则说明
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "my-points-header",
    components: {},
    props: ['barHeight', 'scrollSite'],
    data() {
      return {
        topDivStyle: 'height: 64px;padding-top: 20px;opacity: 0;'
      }
    },
    watch: {
      'scrollSite' : function(val, oldVal) {
        if (val > 60) {
          let h = this.barHeight + 44;
          this.topDivStyle = 'height: ' + h + 'px; ' + 'opacity: ' + 1 + ';'
        } else {
          let harf = val / 60;
          let h = this.barHeight + 44;
          this.topDivStyle = 'height: ' + h + 'px; ' + 'opacity: ' + harf + ';'
        }
      }
    },
    methods: {
      backEvent: function () {
        this.$market.customGo(-1)
      },
      toAgreement: function () {
        this.$market.customPush({
          path: '/usercenter/agreement',
          query:{
            value:11
          }
        })
      },
      getFloatTop: function () {
        if (this.usePorpData == true) {
          return 'top: 50px;'
        }
        return ''
      },
    },
    created() {
      let h = this.barHeight + 44;
      this.topDivStyle = 'height: ' + h + 'px; ' + 'opacity: ' + 0 + ';'
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .my-points-header {
    position absolute;
    top 0px;
    left 0px;
    right 0px;
    overflow hidden;
    z-index 99;

    .top-div {
      background-color #F63A3C;
      .header-div {
        overflow hidden;
        img {
          margin-top 5px;
          margin-left 10px;
          overflow hidden;
          display block;
          width 34px;
          height 34px;
          border-radius 17px;
        }
      }
    }
    .right-btns {
      position absolute;
      bottom 0px;
      right 8px;
      display flex;
      align-items center;
      .btn-div {
        font-size 12px;
        color white;
        border 0.6px solid white;
      }
    }
    .back-div {
      position absolute;
      bottom 0px;
      left 0px;
    }
  }
</style>
