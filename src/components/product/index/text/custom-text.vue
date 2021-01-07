/**Created by liaoyingchao on 2019-04-26.*/

<template>
  <div class="custom-text" :style="getFloatUp()">
    <div v-html="moduleData.content" v-if="refresh" :style="getSidesStyle()"></div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex';
  import Bus from "../bus";
  import hee from "../_js/hotarea-extend-event";

  export default {
    name: "custom-text",
    components: {},
    props: ['myIndex', 'usePorpData', 'propData'],
    mixins: [hee],
    data() {
      return {
        imgStyle: '',
        refresh: true
      };
    },
    computed: {
      ...mapGetters(['clientWidth']),
      pageData: function() {
        if (this.usePorpData == true) {
          return this.propData;
        }
        return this.$store.state.pageData;
      },
      moduleData: function() {
        return this.pageData.moduleList[this.myIndex].data;
      },
    },
    methods: {
      getFloatUp: function () {
        let styleStr = '';
        let img = this.moduleData.bgImgUrl
        if (img != '') {
          styleStr += "background: url('" + img + "') no-repeat center center / 100% 100%;"
        }
        let color = this.moduleData.bgColor
        if (color != '') {
          styleStr += "background-color: " + color +";"
        }
        let floatUp = this.moduleData.floatUp
        if (floatUp > 0) {
          styleStr += 'margin-top: -' + floatUp + '%;'
        }
        return styleStr
      },
      getSidesStyle: function () {
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
        if (downMargin > 0) {
          styleStr += 'padding-bottom: ' + downMargin + '%;'
        }

        return styleStr;
      },
    },
    created() {
      Bus.$on('refreshCustomText', () => {
        this.refresh = false
        this.$nextTick(() => {
          this.refresh = true
        })
      });
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .custom-text {
    width 100%
    min-height 20px;
    overflow hidden
  }
</style>
