/**Created by liaoyingchao on 2018/12/14.*/

<template>
  <div class="index" @click.stop="closeEvent">
    <div class="categories-div theme_bg_white" @click.stop="clickStop">
      <div class="left-div theme_bg_white_f5">
        <div class="cat-div" :class="{theme_bg_white_i: selectedId == idx}" v-for="(item, idx) in cateList" @click="categoryEvent(idx)">
          <div class="title-div theme_font_gray"
               :class="{'theme_border_red_i theme_font_black_i title-div-selected': selectedId == idx}">{{item.name}}
          </div>
        </div>
      </div>
      <div class="right-div" ref="rightScroll">
        <div class="option theme_font_common" v-for="item in subCates" @click="cateEvent(item)">{{item.name}}</div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "index",
    components: {},
    props: ['cateList'],
    data() {
      return {
        selectedId: 0,
        subCates: []
      }
    },
    methods: {
      cateEvent: function (item) {
        item.cateLevel = '3'
        this.$emit('cateEvent', item);
      },
      clickStop: function () {
        console.log('click stop!')
      },
      categoryEvent: function (idx) {
        this.selectedId = idx;
        this.subCates = this.cateList[idx].childList;
        this.$refs.rightScroll.scrollTop = 0
      },
      closeEvent: function () {
        this.$emit('closeEvent');
      }
    },
    mounted() {
      this.subCates = this.cateList[0].childList
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .index {
    position relative
    width 100%
    height 100%
    overflow hidden
    background-color rgba(0, 0, 0, 0.5)
    .categories-div {
      position absolute;
      top 0px;
      left 0px;
      right 0px;
      height 60vh;
      border-top 0.5px solid #ddd;
      .left-div {
        height 100%;
        width 120px;
        float left;
        overflow-x hidden;
        overflow-y auto;
        -webkit-overflow-scrolling touch;
        .cat-div {
          padding 10px 0;

          .title-div {
            margin  6px 0;
            border-left-width 4px;
            border-color transparent;
            border-style solid;
            font-size $font-size-medium;
            text-align center;
          }
          .title-div-selected {
            font-weight:  500
            font-size $font-size-medium-x
          }
        }
      }
      .right-div {
        height 100%;
        overflow-x hidden;
        overflow-y auto;
        -webkit-overflow-scrolling touch;
        .option {
          padding 16px;
          font-size 14px;
        }
      }
    }
  }
</style>
