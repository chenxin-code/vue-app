<template>
  <div class="mall2 servers-detail" v-if="visible">
    <pop-view @closeEvent="popClose">
      <div class="pop-body">
        <div class="pop-title theme_font_common">服务说明</div>
        <div class="pop-scroll-div">
          <div v-for="(server, idx) in initData.list">
            <div class="server-name">{{server.serviceName}}</div>
            <div class="server-detail" v-html="server.serviceDetail"></div>
          </div>
        </div>
        <div class="bottom-btn theme_font_white theme_bg_red" @click="popClose">确定</div>
      </div>
    </pop-view>
  </div>
</template>

<script>

  export default {
    name: 'servers-detail',
    components: {},
    data() {
      return {
        initData: {
          list: []
        },
        visible: false,
      }
    },
    methods: {
      popClose: function () {
        this.visible = false;
      },
    },
    mounted() {

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .servers-detail {
    position fixed;
    left 0px;
    right 0px;
    top 0px;
    bottom 0px;
    z-index 199;
    overflow hidden

    .server-name {
      padding 0 5px;
      font-size 12px;
      line-height 16px;
    }
    .server-detail {
      padding 0 5px;
      font-size 12px;
      line-height 18px;
      color #999;
      padding-bottom 10px;
    }
  }

</style>
