/**Created by liaoyingchao on 2020-05-28.*/

<template>
  <div class="esh-top" :style="getBgDivStyle()" v-if="$market.moduleIsShow(moduleData)">
    <div class="content" :style="getSidesStyle()">
      <div class="left">{{$market.dealPhone($store.state.userInfo.phone)}}</div>
      <div class="right" :class="hotareaClass({idCode: moduleData.idCode})" @click="hotEvent();$market.customPush({path: '/icbc/province'})">
        <img src="static/images/esh-top/dw.png">
        <span>{{$store.state.indexData.province}}</span>
      </div>
    </div>
  </div>
</template>

<script>
  import hee from "../_js/hotarea-extend-event";

  export default {
    name: "esh-top",
    components: {},
    props: ['myIndex', 'usePorpData', 'propData'],
    computed: {
      pageData: function () {
        if (this.usePorpData == true) {
          return this.propData;
        }
        return this.$store.state.pageData;
      },
      moduleData: function () {
        return this.pageData.moduleList[this.myIndex].data;
      },
    },
    mixins: [hee],
    data() {
      return {}
    },
    methods: {
      /**
       * @description 热力统计事件
       */
      hotEvent(eKey=''){
        this.actionBtnEvent(this.pageData.pgCode, this.moduleData.idCode + eKey)
      },
      getSidesStyle: function (noBottom = false) {
        let styleStr = '';
        let sidesMargin = this.moduleData.sidesMargin
        if (sidesMargin > 0) {
          styleStr += 'margin-left: ' + sidesMargin + '%; margin-right: ' + sidesMargin + '%;'
        }
        let upMargin = this.moduleData.upMargin
        let downMargin = this.moduleData.downMargin
        if (upMargin > 0) {
          styleStr += 'padding-top: ' + upMargin + '%;'
        }
        if (downMargin > 0 && !noBottom) {
          styleStr += 'padding-bottom: ' + downMargin + '%;'
        }

        return styleStr;
      },
      getBgDivStyle: function () {
        let styleStr = '';
        let img = this.moduleData.bgImgUrl
        if (img != '') {
          styleStr += "background: url('" + img + "') no-repeat center center / 100% 100%;"
        }
        let color = this.moduleData.bgColor
        if (color != '') {
          styleStr += "background-color: " + color + ";"
        }
        return styleStr
      },
    },
    created() {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .esh-top {
    width 100%
    height 100%
    overflow hidden
    min-height 30px;
    .content {
      display flex;
      align-items center;
      .left {
        flex 1;
        color white;
        font-size 14px;
      }
      .right {
        color white;
        font-size 14px;
        display flex;
        align-items center;
        img {
          height 16px;
          margin-right 3px;
        }
      }
    }
  }
</style>
