<template>
  <div class="h-scroll" :style="getModuleBg()">
    <div class="f-div" v-if="!usePorpData"></div>
    <div class="content">
      <div class="title-img" v-if="moduleData.titleImg != ''">
        <img :src="moduleData.titleImg"/>
      </div>
      <div class="items-row">
        <HScroll :dataList="moduleData.rows" :click="false">
          <div class="item" :class="hotareaClass(item)" v-for="(item, index) in moduleData.rows" :key="index">
            <div :style="getItemStyle(index)" @click.stop="hotEvent(item.idCode);$market.enterNav(item)">
              <img :style="imgStyle" :src="item.imgUrl"/>
            </div>
          </div>
        </HScroll>
      </div>
    </div>
  </div>
</template>

<script>
  import HScroll from '@/components/base/horizontal-scroll/horizontal-scroll'
  import {mapGetters} from 'vuex';
  import hee from "../_js/hotarea-extend-event";

  export default {
    name: 'h-scroll',
    components: {
      HScroll
    },
    props: ['myIndex', 'usePorpData', 'propData'],
    mixins: [hee],
    data() {
      return {
        imgStyle: ''
      };
    },
    computed: {
      ...mapGetters(['clientWidth']),
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
    created() {
      
    },
    methods: {
      /**
       * @description 热力统计事件
       */
      hotEvent(idCode){
        this.actionBtnEvent(this.pageData.pgCode, idCode)
      },
      getModuleBg: function () {
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
      getItemStyle: function (index) {
        let styleStr = ''
        let mNum = this.moduleData.startMargin;
        let space = this.moduleData.space
        let cW = this.clientWidth
        if (mNum > 0) {
          cW = this.clientWidth * (100 - mNum - mNum) / 100
        }
        let itemNumber = this.moduleData.itemNumber
        let allImgW = cW
        if (space > 0) {
          styleStr += 'margin-right: ' + space + 'px;'
          allImgW -= (itemNumber - 1) * space;
        }
        let imgW = allImgW / itemNumber
        let imgH = imgW * this.moduleData.ratio

        styleStr += 'width: ' + imgW + 'px;'
        styleStr += 'height: ' + imgH + 'px;'

        if (index == 0) {
          if (mNum > 0) {
            styleStr += 'margin-left: ' + mNum + 'vw;'
          }
        } else if (index == this.moduleData.rows.length - 1) {
          if (mNum > 0) {
            styleStr += 'margin-right: ' + mNum + 'vw;'
          }
        }

        return styleStr;
      }
    },
  };
</script>

<style lang="stylus" scoped>
  @import '~@/common/stylus/variable.styl';
  //
  .h-scroll {
    position relative;
    .f-div {
      position absolute;
      left 0px;
      right 0px;
      top 0px;
      bottom 0px;
      z-index 99;
    }
    .content {
      .title-img {
        overflow hidden;

        img {
          display block;
          width 100%;
        }
      }

      .items-row {

        .item {
          display inline-block;
          overflow hidden;

          img {
            display block;
            width 100%;
            height 100%;
          }

          /*position relative;
          flex 1;
          text-align center;
          font-size 0px;
          img {
            width 23px;
            height 23px;
          }
          .text {
            margin-top 8px;
            font-size 13px;
            color #333;
          }
          .count {
            position absolute;
            right 20px;
            margin-right -10px;
            top -5px;
            z-index 1;
            padding 2px 5px;
            border-radius 10px;
            font-size 12px;
          }*/
        }
      }
    }
  }
</style>

