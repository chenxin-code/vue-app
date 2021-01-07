<template>
  <div class="rubik" :style="getBaseStyle(moduleData)" ref="rubik" v-if="$market.moduleIsShow(moduleData)">
    <div class="rubik-re" :style="getSidesStyle(moduleData)">
      <div class="rubik-content" :style="getStyle(moduleData)">
        <div :style="getImgStyle(moduleData,idx)" class="rubik-img" v-for="(item, idx) in moduleData.rows" :class="hotareaClass(item)" :key="idx"
             @click="hotEvent(item.idCode);enterNav(item)" >
          <img :src="item.imgUrl"/>
        </div>
      </div>
    </div>
    <!--<RubikEdit v-if="!usePorpData && pageData.moduleList[myIndex].editing"></RubikEdit>-->
  </div>
</template>

<script>
  // import RubikEdit from './rubik-edit';
  import {mapGetters} from 'vuex';
  import hee from "../_js/hotarea-extend-event";

  export default {
    name: 'rubik',
    components: {
      // RubikEdit,
    },
    props: [
      'myIndex',
      'usePorpData',
      'propData'
    ],
    computed: {
      ...mapGetters(['clientWidth']),
      pageData: function () {
        if (this.usePorpData == true) {
          return this.propData
        }
        return this.$store.state.pageData
      },
      moduleData: function () {
        return this.pageData.moduleList[this.myIndex].data;
      },
      contentWidth: function () {
        let sidesMargin = this.moduleData.sidesMargin
        if (sidesMargin > 0) {

          return this.clientWidth * (100 - sidesMargin - sidesMargin) / 100
        }
        return this.clientWidth
      }
    },
    mixins: [hee],
    data() {
      return {
        myWidth: 0,
        myHeight: 0,
      };
    },
    methods: {
      hotEvent: function (idCode) {
        this.actionBtnEvent(this.pageData.pgCode, idCode);
      },
      enterNav: function (nav) {
        this.$market.enterNav(nav, this.pageData.pgCode);
      },
      getBaseStyle: function (data) {
        let styleStr = '';
        if (data.bgColor != '') {
          styleStr += 'background-color: ' + data.bgColor + ';';
        }
        if (data.bgImgUrl != '') {
          styleStr += "background: url('" + data.bgImgUrl + "') no-repeat center center / 100% 100%;"
        }
        let floatUp = this.moduleData.floatUp
        if (floatUp > 0) {
          styleStr += 'margin-top: -' + floatUp + '%;'
        }
        // styleStr += 'width:' + this.clientWidth + 'px;';

        let tempHeight;
        //一行2个 3个 4个
        if (data.type <= 3 && data.ratio != '') {
          tempHeight = ((this.contentWidth - data.type*data.space) / (data.type + 1)) * data.ratio;
        } else if (data.type == 8) {

          if (data.customInfo.layouts.length) {
            let cellW = this.contentWidth / data.customInfo.size;
            let maxY = 0;
            for (let i = 0; i < data.customInfo.layouts.length; i++) {
              let layoutInfo = data.customInfo.layouts[i];
              let temph = layoutInfo.position_y + layoutInfo.height;
              if (maxY < temph) {
                maxY = temph;
              }
            }
            tempHeight = cellW * maxY;
          } else {
            tempHeight = this.contentWidth;
          }
        }
        else {
          tempHeight = this.contentWidth;
        }

        styleStr += 'height:' + tempHeight + 'px;';
        this.myWidth = this.contentWidth + data.space;

        this.myHeight = tempHeight + data.space;
        return styleStr;
      },
      getSidesStyle: function () {
        let styleStr = '';
        let sidesMargin = this.moduleData.sidesMargin
        if (sidesMargin > 0) {
          styleStr += 'margin-left: ' + sidesMargin + '%; margin-right: ' + sidesMargin + '%;'
        }
        return styleStr;
      },
      getStyle: function (data) {
        let styleStr = '';
        styleStr += 'margin:-' + data.space / 2 + 'px;';
        styleStr += 'width:' + this.myWidth + 'px;';
        styleStr += 'height:' + this.myHeight + 'px;';
        return styleStr;
      },

      getImgStyle: function (moduleData, idx) {
        let styleStr = '';
        styleStr += 'margin:' + moduleData.space / 2 + 'px;';
        //计算width
        if (moduleData.type <= 3) {
          let width = this.myWidth / (moduleData.type + 1) - moduleData.space;
          let height = this.myHeight - moduleData.space;
          styleStr += 'width:' + width + 'px;';
          styleStr += 'height:' + height + 'px;';
          styleStr += 'top:0px;' + 'left:' + idx * (width + moduleData.space) + 'px;';
        } else if (moduleData.type == 4) {
          let width = this.myWidth / 2 - moduleData.space;
          styleStr += 'width:' + width + 'px;';
          styleStr += 'height:' + width + 'px;';
          styleStr +=
            'top:' +
            parseInt(idx / 2) * (width + moduleData.space) +
            'px;' +
            'left:' +
            (idx % 2) * (width + moduleData.space) +
            'px;';
        } else if (moduleData.type == 5) {
          let width = this.myWidth / 2 - moduleData.space;
          styleStr += 'width:' + width + 'px;';
          let height = idx == 0 ? this.myHeight - moduleData.space : width;
          styleStr += 'height:' + height + 'px;';
          styleStr +=
            'top:' +
            parseInt(idx / 2) * (width + moduleData.space) +
            'px;' +
            'left:' +
            (idx > 0 ? 1 : 0) * (width + moduleData.space) +
            'px;';
        } else if (moduleData.type == 6) {
          let height = this.myWidth / 2 - moduleData.space;
          let width = idx > 0 ? height : this.myWidth - moduleData.space;
          styleStr += 'width:' + width + 'px;';
          styleStr += 'height:' + height + 'px;';
          styleStr +=
            'top:' +
            (idx > 0 ? 1 : 0) * (height + moduleData.space) +
            'px;' +
            'left:' +
            parseInt(idx / 2) * (height + moduleData.space) +
            'px;';
        } else if (moduleData.type == 7) {
          let width = this.myWidth / 2 - moduleData.space;
          let halfWidth = this.myWidth / 4 - moduleData.space;
          let height = idx > 0 ? width : this.myHeight - moduleData.space;
          styleStr += 'width:' + (idx > 1 ? halfWidth : width) + 'px;';
          styleStr += 'height:' + height + 'px;';
          let left = 0;
          if (idx > 0) {
            left = width + moduleData.space;
          }
          if (idx == 3) {
            left += halfWidth + moduleData.space;
          }
          styleStr += 'top:' + (idx > 1 ? 1 : 0) * (width + moduleData.space) + 'px;' + 'left:' + left + 'px;';
        } else if (moduleData.type == 8) {
          if (moduleData.customInfo.layouts.length < idx + 1) {
            return '';
          }
          let layoutInfo = moduleData.customInfo.layouts[idx];
          let cellW = this.myWidth / moduleData.customInfo.size;
          let width = cellW * layoutInfo.width;
          let height = cellW * layoutInfo.height;
          let top = cellW * layoutInfo.position_y;
          let left = cellW * layoutInfo.position_x;

          styleStr += 'width:' + (width - moduleData.space) + 'px;';
          styleStr += 'height:' + (height - moduleData.space) + 'px;';

          styleStr += 'top:' + top + 'px;' + 'left:' + left + 'px;';
        }

        return styleStr;
      },
    },
    created() {
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import '~@/common/stylus/variable.styl';
  @import '~@/common/stylus/mixin.styl';
  .rubik {
    position relative;
    z-index 10;
    overflow: hidden;
    width 100%
    .rubik-re {
      position: relative;
      /*width 100%*/
      height 100%
    }
    .rubik-content {
      position: absolute;

      // overflow: hidden;
      .rubik-img {
        position: absolute;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
</style>
