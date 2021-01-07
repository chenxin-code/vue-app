<template>
  <div class="sitelist">
    <div class="shadow-cell theme_bg_white" v-for="(item, idx) in siteList" @click="selectSite(item,idx)">
      <mt-cell-swipe :right="pageType == '1' || pageType == '0' || pageType == '5' ? [{
          content: '删除常用自提点',
          style: {
            padding: '20px 14px',
            background: '#F80F16',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
          },
          handler: () => deletePickupAddress(item)
        }] : []" class="my-cell-swipe">
        <div class="site-cell"  slot="title" style="width: 100%;">
          <div class="left-info">
            <!--<div v-if="idx==0" class="tip margin-con theme_font_gray">{{tipTitle}}</div>-->
            <div class="site-title margin-con theme_font_black">
              <span>{{item.storeName}}</span>
              <!--<span class="nearest theme_bg_red " v-if="showDistance == true && idx==0">最近</span>-->
            </div>
            <div class="tip margin-con theme_font_gray">地址：{{item.address}}</div>
            <div class="tip theme_font_gray">电话：{{item.phone}}【营业时间:{{item.openTime}}】</div>
          </div>
          <div class="right-con">
            <div class="distence-con">{{$util.toDecimal2(item.distance/1000)}}km</div>
            <i  class="iconfont " :class="item.id == selectedId?'mall-xuanzhong theme_font_red':'mall-weixuanzhong theme_font_gray'" v-if="pageType != 2 && pageType != 3 && pageType != 1 && pageType != 5"></i>
          </div>
        </div>
      </mt-cell-swipe>
    </div>
  </div>
</template>

<script>
  import { Toast } from 'mint-ui';
  export default {
    name: 'sitelist',
    components: {},
    props:[
      'showDistance',
      'tipTitle',
      'siteList',
      'selectedId',
      'pageType' // 默认 普通， 1 包含删除常用自提点  2去掉选中
    ],
    data() {
      return {
        selectIndex:-1,
        selectItem:[],
        cellRight: []
      }
    },
    methods: {
      selectSite: function (item,idx) {
        if(this.pageType != 2){
          this.selectIndex = idx;
          this.selectItem = item;
          this.$emit('selectsite',item)
        }
      },
      deletePickupAddress: function (item) {
        this.$emit('deletePickupAddress',item)
      }
    },
    created() {
    },
    activated () {

    },
    beforeRouteLeave (to, from, next) {
      this.$keepaliveHelper.deleteCache(this)
      next()
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .sitelist {
    /*width 100%*/
    /*height 100%*/
    /*overflow hidden*/
    .my-cell-swipe {
      width 100%;
    }
    .site-cell {
      overflow hidden;
      /*margin 10px 16px 16px;*/
      /*border-radius 16px;*/
      /*box-shadow: 0px 6px 6px #efefef;*/
      /*overflow hidden*/
      display flex
      align-items center
      .left-info {
        flex 1
        padding 12px 0px
        /*background-color #4caf50*/
        .tip {
          word-break: break-all;
          font-size $font-size-medium-s
        }
        .site-title {
          font-size $font-size-medium-x
          .nearest {
            color white
            margin-left: 10px;
            border-radius: 10px;
            -webkit-border-radius: 10px;
            padding 0px 7px
            font-size $font-size-medium
          }
        }
      }
      .right-con {
        min-width 50px;
        padding 0 4px
        text-align center
        .distence-con {
          font-size $font-size-medium-s
          margin-bottom 8px
        }
        i{
          float right;
          margin-right 15px;
          font-size $font-size-large
        }
        //.image-con {
          //margin-top 16px
         // width 40px
          //height 40px
        //}
      }
    }
    .margin-con {
      margin-bottom 12px
    }
  }

</style>
