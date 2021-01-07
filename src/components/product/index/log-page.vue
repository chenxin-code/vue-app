/**Created by liaoyingchao on 2019/2/25.*/

<template>
  <div class="log-page">
    <nav-top @backEvent="$router.go(-1)">
      <!--<div class="eruda-s" @click.stop="showEruda">showEruda</div>-->
    </nav-top>
    <nav-content>
      <div class="scroll-div">
        <div class="build-time">打包时间：{{buildtime}}</div>
        <div class="item" v-for="item in logs">
          <div class="title">{{item.title}}</div>
          <div>{{item.time}}</div>
          <div class="body-div" v-html="item.body"></div>
        </div>
      </div>
    </nav-content>
  </div>
</template>

<script>
  import logCenter from '@/utils/logCenter'
  // import Eruda from 'eruda'

  export default {
    name: "log-page",
    components: {},
    data() {
      return {
        buildtime: '',
        logs: []
      }
    },
    methods: {
      // showEruda() {
      //
      // }
    },
    created() {
      eruda.init()
      logCenter.getLogs(logs => {
        this.logs = logs
      })

      let meta = document.getElementsByTagName('meta')['buildtime']
      if (meta && meta != undefined) {
        this.buildtime = meta.getAttribute('date')
      } else {
        this.buildtime = '老版本不支持'
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .log-page {
    width 100%
    height 100%
    overflow hidden
    .scroll-div {
      height 100%;
      overflow-x hidden;
      overflow-y auto;
      -webkit-overflow-scrolling touch;
      .build-time {
        font-size 14px;
        padding 10px;
      }
      .item {
        padding 10px;
        overflow hidden;
        font-size 12px;
        color #333;
        .title {
          font-size 14px;
          color black;
        }
        .body-div {
          width 100%;
          word-break: break-all;
        }
      }
    }
  }
  .eruda-s {
    position absolute
    right 10px
    top 0
    font-size 13px
  }
</style>
