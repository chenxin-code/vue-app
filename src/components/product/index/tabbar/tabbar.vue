<template>
  <!--顶部-->
  <div class="tabbar-top" :style="getStyleTabbarBg(pageData)" v-if="pageData.tabbarType == 'top'">
    <div class="tabbar-nav-div" :style="getTopPadding()">
      <div class="tabbar-box" :style="{'height':$market.getNavHeight()+'px'}">
        <div class="back-div" @click="backEvent">
          <img width="20px" height="20px" src="static/images/header/back-b.png"/>
        </div>
        <div class="nav-top-title" :style="{'color': pageData.titleColor}" v-if="pageData.title">
          {{pageData.title}}
        </div>
      </div>
    </div>
    <div class="tabbar-search" @click="$market.clickSearch">
      <div class="search-bg">
        <div class="search-icon">
          <img style="display: block;" width="14px" height="14px" src="static/images/header/search.png"/>
        </div>
        <div class="search-main">
          商品名称
        </div>
      </div>
    </div>
    <div class="tabbar-items">
      <div class="tabbar-item" :class="{activity: selectedIndex == index}" :style="getStyleItemWidth(pageData)" v-for="(item, index) in pageData.moduleList" @click="tabbarEvent(index)">
        <span>{{item.title}}</span>
        <div class="line"></div>
      </div>
    </div>
  </div>
  <!--底部-->
  <div class="tabbar" :style="getStyleTabbarBg(pageData)" v-else>
    <div class="tabbar-item" :style="getStyleItemWidth(pageData)"
         :class="{'img-style': pageData.layoutType == 'img_50', 'img-style-2': pageData.layoutType == 'img_60'}"
         v-for="(item, index) in pageData.moduleList" @click="tabbarEvent(index)">
      <img v-show="selectedIndex != index" :src="item.imgUrl1"/>
      <img v-show="selectedIndex == index" :src="item.imgUrl2"/>
      <div class="corner-mark" v-if="$market.getCartNum(item.link.code) > 0">{{$market.getCartNum(item.link.code)}}</div>
      <span v-show="pageData.layoutType == 'img_word'">{{item.title}}</span>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import CornerMark from '../cornermark/cornerMark';
  // import Eruda from 'eruda'

  export default {
    name: 'tabbar',
    components: {
      CornerMark
    },
    computed: {
      // ...mapGetters([
      //   'tabbarData'
      // ]),
      pageData: function () {
        if (this.usePorpData == true) {
          return this.propData;
        }
        return this.$store.state.tabbarData;
      }
    },
    props: ['defaultIndex', 'usePorpData', 'propData'],
    data() {
      return {
        selectedIndex: this.defaultIndex,
        erudaTime: 0,
        clickTime: -1

      }
    },
    methods: {
      getTopPadding: function () {
        let styleStr = ''
        if (this.$store.state.barHeight) {
          styleStr += "paddingTop: " + this.$store.state.barHeight + "px;"
        }
        return styleStr
      },
      backEvent: function () {
        this.$market.backNav()
      },
      tabbarEvent: function (index) {
        this.selectedIndex = index
        this.$emit('tabbarEvent', index);

        //连续点5次第一个item  显示Eruda
        if (index == 0) {
          let time = (new Date()).getTime();

          if (time - this.clickTime < 1000 || this.clickTime == -1) {
            // console.log('时间差' + (time - this.clickTime));
            this.erudaTime += 1;
            this.clickTime = time;
            if (this.erudaTime == 5) {
              eruda.init()
              this.erudaTime = 0;
              this.clickTime = -1;
            }
          } else {
            this.erudaTime = 0;
            this.clickTime = -1;
          }
        }
      },
      getStyleTabbarBg: function (data) {
        let color = data.bgColor
        let styleStr = ''
        if (color != '') {
          styleStr += "background-color: " + color + ";"
        }
        let img = data.bgImgUrl
        if (img != '') {
          styleStr += "background: url('" + img + "') no-repeat center center / 100% 100%;"
        }
        return styleStr
      },
      getStyleItemWidth: function (data) {
        if (data.moduleList.length == 4) {
          return 'width: 25%;'
        } else if (data.moduleList.length == 5) {
          return 'width: 20%;'
        } else if (data.moduleList.length == 2) {
          return 'width: 50%;'
        } else if (data.moduleList.length == 3) {
          return 'width: 33.33%;'
        } else {
          return 'width: 33.33%;'
        }
      }
    },
    created() {
      if (!this.pageData.titleColor) {
        this.pageData.titleColor = '#000'
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import '~@/common/stylus/variable.styl'
  .tabbar-top {
    position absolute;
    left 0px;
    right 0px;
    top 0px;
    z-index 1000;
    background-color white;
    .tabbar-nav-div {
      .tabbar-box {
        position relative;
        display flex;
        align-items center;
        .back-div {
          position absolute;
          z-index 1;
          left 0;
          top 0;
          width 50px;
          height 100%;
          display flex;
          align-items center;
          padding-left 10px;
        }
        .nav-top-title {
          position absolute;
          left 50px;
          right 50px;
          top 0;
          height 100%;
          display flex;
          font-size 18px;
          font-weight 500;
          align-items center;
          justify-content center;
        }
      }
    }
    .tabbar-search {
      padding 0px 10px 5px;
      .search-bg {
        display flex;
        align-items center;
        height 28px;
        background-color #efefef;
        border-radius 15px;
        font-size 12px;
        padding 0px 10px;
        .search-icon {

        }
        .search-main {
          padding-left 10px;
          color #999;
        }
      }
    }
    .tabbar-items {
      display flex;
      align-items center;
      .tabbar-item {
        height 38px;
        color black;
        font-size 14px;
        line-height 38px;
        text-align center;
        position relative;
        &.activity {
          font-size 18px;
          font-weight 600;
          .line {
            position absolute;
            bottom 0px;
            left 50%;
            width 30px;
            margin-left -15px;
            height 2px;
            border-radius 1px;
            background-color #F80F16;
          }
        }
      }
    }
  }

  .tabbar {
    position absolute;
    left 0px;
    right 0px;
    bottom 0px;
    height 50px;
    z-index 1000;
    .tabbar-item {
      position relative
      float left
      width 33.33%
      text-align center;
      font-size 0px;

      img {
        width 25px;
        height 25px;
        margin-top 5px;
      }

      span {
        margin-top 4px;
        display inline-block
        width 90%;
        font-size 12px;
      }
    }

    .img-style {
      img {
        width 50px;
        height 50px;
        margin-top 0px;
      }
    }

    .img-style-2 {
      img {
        width 60px;
        height 60px;
        margin-top -10px;
      }
    }
  }
  .corner-mark {
    position absolute;
    right 6px;
    top 3px;
    font-size 10px;
    padding 2px 4px;
    border-radius 15px;
    color white;
    background-color #F80F16;
  }
  @supports (bottom: constant(safe-area-inset-bottom)) or (bottom: env(safe-area-inset-bottom)) {
    .tabbar {
      box-sizing: content-box;
      padding-bottom: constant(safe-area-inset-bottom);
      padding-bottom: env(safe-area-inset-bottom);
    }
  }
</style>
