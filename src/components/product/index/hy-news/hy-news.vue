<template>
  <div class="hy-news" :style="getModuleBg()">
    <div class="content">
      <img class="title-img" :src="moduleData.titleImg"/>
      <div class="center-div">
        <transition-group name="list">
          <div class="text" v-for="(item, idx) in news" v-show="idx == showIdx" :key="item.id" @click="newsEvent(item.id)">{{item.title}}</div>
        </transition-group>
      </div>
      <div class="more-btn" :class="hotareaClass({idCode: moduleData.idCode + 'moreNews'})" @click="hotEvent('moreNews');moreNews()">| 更多</div>
    </div>
  </div>
</template>

<script>
  import hee from "../_js/hotarea-extend-event";

  export default {
    name: 'hy-news',
    components: {},
    props: ['myIndex', 'usePorpData', 'propData'],
    mixins: [hee],
    data() {
      return {
        showIdx: -1,
        news: [],
        myTimeout: null
      };
    },
    computed: {
      pageData: function() {
        if (this.usePorpData == true) {
          return this.propData;
        }
        return this.$store.state.pageData;
      },
      moduleData: function() {
        return this.pageData.moduleList[this.myIndex].data;
      },
    },
    created() {
      console.log(this.moduleData);
      this.getHYNews()
    },
    destroyed() {
      if (this.myTimeout) {
        window.clearTimeout(this.myTimeout)
        this.myTimeout = null
      }
    },
    methods: {
      /**
       * @description 热力统计事件
       */
      hotEvent(eKey=''){
        this.actionBtnEvent(this.pageData.pgCode, this.moduleData.idCode + eKey)
      },
      newsEvent: function (newsId) {
        this.$market.newsEvent(newsId);
      },
      moreNews: function () {
        this.$market.moreNews();
      },
      nextText: function () {
        if (this.myTimeout) {
          window.clearTimeout(this.myTimeout)
          this.myTimeout = null
        }
        if (this.showIdx > this.news.length-2) {
          this.showIdx = -1;
        }
        this.showIdx ++
        this.myTimeout = window.setTimeout(() => {
          this.nextText()
        }, 3000)
      },
      getHYNews: function () {
        let url = this.$market.apiBaseURL() + '/app/json/news/loadNewsList';
        let paramsData = {
          token: this.$store.state.login.token,
          ouCode: this.$store.state.indexData.station.ouCode
        };
        this.$http.post(url, paramsData).then(res => {
          let data = res.data;
          if (data.status == 0) {
            this.news = data.data
            if (this.news.length > 0) {
              this.showIdx = -1;
              this.nextText();
            }
          } else {
          }
        }, error => {
        })
      },
      selectStation: function () {
        this.$market.selectStation();
      },
      toSignIn: function () {
        this.$market.toSignIn();
      },
      getModuleBg: function () {
        let styleStr = '';
        let img = this.moduleData.bgImgUrl
        if (img != '') {
          styleStr += "background: url('" + img + "') no-repeat center center / 100% 100%;"
        }
        let color = this.moduleData.bgColor
        if (color != '') {
          styleStr += "background-color: " + color +";"
        }
        return styleStr
      },
    },
  };
</script>

<style lang="stylus" scoped>
  @import '~@/common/stylus/variable.styl';
  .hy-news {
    .content {
      overflow hidden;
      display flex;
      align-items center;
      .title-img {
        height 34px;
      }
      .center-div {
        position relative;
        height 34px;
        flex 1;
        .text {
          position absolute;
          left 0px;
          right 0px;
          top 0px;
          bottom 0px;
          font-size 14px;
          line-height 34px;
          overflow: hidden;//多出部分隐藏
          white-space: nowrap;//一行显示
          text-overflow: ellipsis;//是否显示省略号
        }
      }
      .more-btn {
        color #666;
        font-size 14px;
        margin -10px;
        padding 10px 16px;
      }
    }
  }
  .list-enter-active, .list-leave-active {
    transition: all 1s;
  }
  .list-leave-to {
    transform: translateY(-34px);
  }
  .list-enter {
    transform: translateY(34px);
  }
</style>

