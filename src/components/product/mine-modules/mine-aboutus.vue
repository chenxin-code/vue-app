<template>
  <div class="bottom">
    <div class="top_con">
      <div class="logoCell_con">
        <img class="logo_con" src="../../../assets/refuel/logo.png">
        <div class="bundle_con font-medium-x">中油好客e站 V{{appVersion}}</div>
      </div>
      <div class="phonecell_con">
        <div class="left_con font-medium-x">联系电话</div>
        <div class="right_con font-medium">{{telephone}}</div>
      </div>
      <div class="websiteCell_con">
        <div class="webleft_con font-medium-x">网址</div>
        <div class="webright_con font-medium">{{website}}</div>
      </div>
    </div>
    <div class="bottom_con">
      <div class="font-medium-l">{{copyright}}</div>
      <div class=" font-medium-l">{{company}}</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'mine-aboutus',
    components: {},
    data() {
      return {
        msg: 'msg',
        telephone: "95504",
        website: "www.9tt04.net",
        copyright: "Copyright © 2016 版权所有",
        company: "中国石油天然气股份有限公司",
        appVersion: ''
      }
    },
    methods: {
      testFunc: function () {
        console.log('testFunc')
      }
    },
    created() {
      this.appVersion = this.$store.state.version;
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import '~@/common/stylus/variable.styl'
  .bottom {
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: $color-background-lll
    position: absolute;

    .top_con {
      /*position: absolute;*/
      width: 100%;
      height: auto;
      .logoCell_con {
        width: 100%;
        height: 150px;
        text-align: center;
        background-color: white;
        .logo_con {
          margin-top: 20px;
          width: 60px;
          height: 60px;
        }
        .bundle_con {
          margin-top: 20px;
        }
      }
      .phonecell_con {
        width: 100%;
        height: 70px;
        margin-top: 5px;
        background-color: white;
        border-top: 1px solid $color-line-gray-l;
        .left_con {
          float: left;
          width: 50%;
          margin-left: 3%;
          line-height: 70px;
          text-align: left;
          /*background-color: #2b81af*/
        }
        .right_con {
          float: right;
          width: 30%;
          margin-right: 3%;
          line-height: 70px;
          text-align: right;
          /*background-color: #4caf50;*/
        }
      }
      .websiteCell_con {
        width: 100%;
        height: 70px;
        background-color: white;
        border-top: $color-line-gray-l = #ddd 0.5px solid;
        .webleft_con {
          float: left;
          width: 30%;
          margin-left: 3%;
          line-height: 70px;
          text-align: left;
        }
        .webright_con {
          float: right;
          width: 50%;
          margin-right: 3%;
          line-height: 70px;
          text-align: right;
        }
      }
    }
    .bottom_con {
      position: absolute;
      width: 100%;
      bottom: 5%;
      text-align: center;
    }
  }


</style>
