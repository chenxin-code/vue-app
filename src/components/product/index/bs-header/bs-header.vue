/**Created by liaoyingchao on 2019-10-12.*/

<template>
  <div class="bs-header">
    <div class="default-div" v-if="myData.type == 'default'" :style="getStyleHeaderBg(myData)">
      <div class="nav-top-title" :style="{'color': myData.titleColor}">{{myData.title}}
      </div>
      <div class="back-btn">
        <img src="static/images/header/back-zi.png"/>
      </div>
    </div>
    <div class="default-div custom-div" v-if="myData.type == 'custom'" :style="getStyleHeaderBg(myData)">
      <div class="nav-top-title" :style="{'color': myData.titleColor}" v-if="myData.isShowTitle">{{myData.title}}</div>
      <div class="back-btn" v-if="myData.isShowBack">
        <img src="static/images/header/back-zi.png"/>
      </div>
      <div class="full-div"></div>
      <div class="text-div" v-if="myData.isShowStationName">{{$store.state.stationData.name}}</div>
      <div class="text-div" v-if="myData.isShowVersion">版本号:V{{$store.state.commonargs.appVersion}}</div>
      <div class="setting-div" v-if="myData.isShowSetting">
        <img src="static/images/header/setting.png">
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "bs-header",
    components: {},
    props: [
      'usePorpData',
      'propData',
      'barHeight',
      'scrollSite'
    ],
    computed: {
      pageData: function () {
        if (this.usePorpData == true) {
          return this.propData
        }
        return this.$store.state.pageData
      },
      myData: function () {
        return this.pageData.header.data
      }
    },
    data() {
      return {
      }
    },
    methods: {
      getStyleHeaderBg: function (data) {
        let styleStr = ''
        let img = data.bgImgUrl
        if (img != '') {
          styleStr += "background: url('" + img + "') no-repeat center center / 100% 100%;"
        }
        let color = data.bgColor
        if (color != '') {
          styleStr += "background-color: " + color +";"
        }
        if (this.barHeight) {
          styleStr += "paddingTop: " + this.barHeight + "px;"
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
  .bs-header {
    overflow hidden
    .default-div {
      padding-top 4px;
      height 52px;
      position relative;
      display flex;
      align-items center;
      .back-btn {
        display flex;
        align-items center;
        height 100%;
        padding 10px;
        img {
          //width 30px;
          height 14px;
        }
      }
      .full-div {
        flex 1;
      }
      .setting-div {
        padding 10px 10px 10px 5px;
        img {
          width 30px;
          height 30px;
        }
      }
      .text-div {
        font-size 12px;
        color #666;
        padding 5px;
      }
      .nav-top-title {
        position absolute;
        left 0;
        right 0;
        top 0;
        bottom 0;
        text-align center;
        display flex;
        justify-content center;
        align-items center;
        font-size 16px;
        font-weight 600;
        padding-top 4px;
      }
    }
    .custom-div {
      height 52px;
      position relative;
    }
  }
</style>
