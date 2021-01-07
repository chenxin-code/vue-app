/**Created by steven on 2018/11/12.*/

<template>
  <div class="salepro" v-show="visible">
    <pop-view v-if="visible" @closeEvent="popClose">
      <div class="pop-body theme_bg_white">
        <p class="pop-title theme_font_black">修改促销</p>
        <div class="pop-row" v-for="(item,index) in listData"  @click="chooseFinish(item)">
          <i class="iconfont  font-large" :class="item.checked?'mall-xuanzhong theme_font_red':'mall-weixuanzhong theme_font_gray'"></i>
          <span class="theme_font_gray">{{item.title}}</span>
        </div>
      </div>
    </pop-view>
  </div>
</template>

<script>
  import Vue from 'vue';

  export default {
    name: "salepro",
    components: {},
    data() {
      return {
        listData: [],
        visible: false,
        sureFunc: null
      }
    },
    methods: {
      popClose: function () {
        this.visible = false;
      },
      chooseFinish:function (item) {

        if(item.checked != undefined){
          item.checked = !item.checked;
        }else {
          Vue.set( item, 'checked', true )
        }
        if(item.checked = true){
          for(let i=0; i < this.listData.length; i++){
            let titem = this.listData[i];
            if(titem != item){
              titem.checked = false;
            }
          }
        }
        if(this.sureFunc){
          this.sureFunc(item);
        }
        this.visible = false;
      }
    },
    created() {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  $margin-value=20px
  .salepro {
    width 100%
    height 100%
    overflow hidden
    .pop-body {
      .pop-title {
        margin 15px 0px 4px $margin-value
        font-size  $font-size-medium
      }
      .pop-row{
        margin 0px $margin-value
        padding 12px 0px
        border-bottom 1px solid $color-line-gray-l
        display flex
        align-items center
        span{
          margin-left 6px
          font-size $font-size-small
        }
      }
    }
    .font-large{
      font-size $font-size-large
    }
  }
</style>
