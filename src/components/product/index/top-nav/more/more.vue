/**Created by liaoyingchao on 2020-06-11.*/

<template>
  <div class="more" v-if="visible">
    <div class="content" @click.stop="visible = false">
      <div class="bg" :style="{top: getTopHeight(),backgroundColor: this.initData.topData.bgColor}">
        <div class="jiantou" :style="{borderColor: 'transparent transparent ' + this.initData.topData.bgColor}"></div>
        <div class="row" :class="{'line_top': idx > 0}" v-for="(item, idx) in list" :key="idx" @click="itemEvent(item)">
          <img :src="item.img">
          <span>{{item.name}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import market from '@/utils/market.js'

  export default {
    name: "more",
    components: {},
    data() {
      return {
        initData: {
          topData: {}
        },
        visible: false,
        eventClick: null,
        list: []
      }
    },
    methods: {
      getTopHeight: function () {
        let value = market.getBarHeight() + market.getNavHeight()
        return value + 'px';
      },
      itemEvent: function (item) {
        this.eventClick(item.code)
      },
      getName: function (key) {
        switch (key) {
          case 'ydf':
            return '油滴付'
            break;
          case 'dzk':
            return '电子卡'
            break;
          case 'sys':
            return '扫一扫'
            break;
          case 'kfp':
            return '开发票'
            break;
        }
      }
    },
    mounted() {
      console.log(this.initData.topData)
      this.list = []
      for (let i = 0; i < this.initData.topData.moreContentList.length; i++) {
        let key = this.initData.topData.moreContentList[i]
        this.list.push({
          img: 'static/images/header/' + key + '.png',
          name: this.getName(key),
          code: key
        })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .more {
    position fixed;
    left 0px;
    right 0px;
    top 0px;
    bottom 0px;
    z-index 1999;
    background-color rgba(0, 0, 0, 0.3)
    overflow hidden
    .content {
      width 100%;
      height 100%;
      position relative;
      .bg {
        top 64px;
        right 0;
        min-width 104px;
        //height 200px;
        border-radius 8px;
        // border: 1px solid #ff0;
        // background-color #ff0;
        position: absolute;
        padding 2px 12px;
        .jiantou {
          content: '';
          width: 0;
          height: 0;
          border:15px solid;
          position: absolute;
          top: -28px;
          right: 10px;
          // border-color: transparent transparent #ff0;
        }
        .row {
          display flex;
          align-items center;
          color white;
          padding 12px 0;
          img {
            height 16px;
            margin-right 10px;
          }
          span {
            font-size 14px;
          }
        }
      }
    }
  }
</style>
