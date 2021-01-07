/**Created by liaoyingchao on 2019-05-09.*/

<template>
  <!-- 知识推送 -->
  <div class="bg-div" :style="getBgDivStyle()" v-if="$market.moduleIsShow(moduleData)">
    <div class="news-group" v-if="moduleData.styleType == 2">
      <div class="news-list" v-for="item in listShowDatas" @click="toNews(item)">
        <div class="image"><img :src="item.picTitle" alt=""></div>
        <div class="text">{{item.title}}</div>
      </div>
      <div v-if="listShowDatas.length == 0" style="text-align:center;padding:10px 0;">暂无任何数据</div>
    </div>
    <div class="news"  v-else-if="listShowDatas.length > 0 || usePorpData != true" :style="getSidesStyle()">
      <!-- 左侧图片 -->
      <div class="title-img">
        <img :src="moduleData.titleImg">
      </div>
      <div class="news-div" :class="hotareaClass({ idCode: moduleData.idCode + 'toNews' })" @click="hotEvent('toNews');$market.toNews()" v-if="moduleData.runType == 2">
        <div ref="runDiv" class="run-div-1">
          <transition-group name="runnews">
            <div class="news-item" v-for="(item, idx) in listShowDatas" v-show="showIndex == idx" :key="'runnews_'+idx">
              <div class="category">{{item.categoryName}}</div>
              <div class="title">{{item.title}}</div>
            </div>
          </transition-group>
        </div>
      </div>
      <div class="news-div" :class="hotareaClass( { idCode: moduleData.idCode + 'toNews' } )" @click="hotEvent('toNews');$market.toNews()" v-else>
        <div ref="runDiv" class="run-div" :key="1" :style="{animationDuration: runTime+'s'}">
          <div class="news-item" v-for="(item,index) in listShowDatas" :key="index">
            <div class="category">{{item.categoryName}}</div>
            <div class="title">{{item.title}}</div>
          </div>
        </div>
        <div class="run-div" :key="2" :style="{animationDuration: runTime+'s'}">
          <div class="news-item" v-for="(item,index) in listShowDatas" :key="index">
            <div class="category">{{item.categoryName}}</div>
            <div class="title">{{item.title}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Bus from '../bus';
  // import actualRect from '@/utils/actualRect.js'
  import componentApi from '../_js/component-api'
  import hee from "../_js/hotarea-extend-event";

  export default {
    name: "news",
    components: {},
    props: ['myIndex', 'usePorpData', 'propData'],
    mixins: [componentApi,hee],
    data() {
      return {
        listShowDatas: '',
        showIndex: 1,
        myTimeout: null,
        runTime: 3,
        show: false
      }
    },
    watch:{
      'moduleData.styleType'(nv){
        this._getMyData();
      },
    },
    computed: {
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
    methods: {
      toNews(item) {
        this.$router.push({path:'/newsdetail',query:{id:item.id}})
      },
      /**
       * @description 热力统计事件
       */
      hotEvent(eKey=''){
        this.actionBtnEvent(this.pageData.pgCode, this.moduleData.idCode + eKey)
      },
      modeleReshow:function(){
        this._getMyData();
      },
      getBgDivStyle: function () {
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
      getSidesStyle: function () {
        let styleStr = '';
        let sidesMargin = this.moduleData.sidesMargin
        if (sidesMargin > 0) {
          styleStr += 'margin-left: ' + sidesMargin + '%; margin-right: ' + sidesMargin + '%;'
        }
        // let upDownMargin = this.moduleData.upDownMargin
        // if (upDownMargin > 0) {
        //   styleStr += 'padding-top: ' + upDownMargin + '%; padding-bottom: ' + upDownMargin + '%;'
        // }
        return styleStr;
      },
      runEvent: function () {
        this.myTimeout = setTimeout(() => {
          this.showIndex += 1;
          if (this.showIndex >= this.listShowDatas.length) {
            this.showIndex = 0
          }
          this.runEvent()
        }, 4000)
        //this.showIndex += 0;
      },
      async getNewsDataByStyle_2(){
        this.listShowDatas = [];
        let url = this.$market.apiBaseURL() + '/app/json/news/getPageNewsList?state=1&isEnable=1';
        const res = await this.$http.get(url);
        let data = res.data;
        if (data.status == 0) {
          this.listShowDatas = data.data || [];
        }
      },
      _getMyData: function () {
        if(this.moduleData.styleType == 2){
          this.getNewsDataByStyle_2()
          return ;
        }
        let url = this.$market.apiBaseURL() + '/app/json/news/defaultList';
        let paramsData = {
          token: this.$store.state.login.token,
          provinceName: this.$store.state.indexData.province,
          cityName: this.$store.state.indexData.city
        };
        this.listShowDatas = [];
        if (this.myTimeout) {
          clearTimeout(this.myTimeout)
          this.myTimeout = null
        }
         this.$http.post(url, paramsData).then(res => {
          let data = res.data;
          if (data.status == 0) {
            if (this.moduleData.runType == 2) {
              this.listShowDatas = data.data
              if (this.listShowDatas.length == 1) {
                this.listShowDatas = this.listShowDatas.concat(this.listShowDatas)
              }
              this.showIndex = 0
              this.runEvent()
            } else {
              this.listShowDatas = data.data
              if (this.listShowDatas.length > 0) {
                this.$nextTick(() => {
                  setTimeout(()=>{
                    let len = this.$refs.runDiv.clientWidth
                    this.runTime = Math.floor(len / 50)
                    if (this.runTime < 3 * this.listShowDatas.length) {
                      this.runTime = 3 * this.listShowDatas.length
                    }
                  },300)

                })
              }
            }
          } else {
          }
        }, error => {
        })
      },
      lazyLoadPageData: function () {
        this._getMyData();
      }
    },
    destroyed() {
      if (this.myTimeout) {
        clearTimeout(this.myTimeout)
        this.myTimeout = null
      }
    },
    created() {
      Bus.$on("refreshNews", () => {
        this._getMyData()
      })
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .bg-div {
    overflow hidden;
  }
  .news {
    display flex;
    align-items center;

    .title-img {
      height 45px;
      position relative;
      z-index 1;

      img {
        display block;
        height 100%;
      }
    }

    .news-div {
      flex 1;
      position relative;
      font-size 0;
      white-space: nowrap;
      overflow hidden;

      .run-div {
        display inline-block;
        min-width 100%;
        white-space: nowrap;
        overflow hidden;
        animation: slidein 3s linear 1s infinite running;

        .news-item {
          display inline-block;
          font-size 0px;

          .category {
            display inline-block
            background-color #EB4F30;
            padding 6px 10px;
            border-radius 20px;
            font-size 12px;
            color white;
          }

          .title {
            display inline-block
            padding 0 30px 0 5px;
            font-size 13px;
          }
        }
      }
      .run-div-1 {
        position relative;
        height 34px;
        overflow hidden;

        .news-item {
          position absolute;
          left 0;
          right 0;
          top 0;
          height 34px;
          padding 5px;
          font-size 0px;

          .category {
            display inline-block
            background-color #EB4F30;
            padding 6px 10px;
            border-radius 20px;
            font-size 12px;
            color white;
          }

          .title {
            display inline-block
            padding 0 30px 0 5px;
            font-size 13px;
          }
        }
      }
    }
  }

  @keyframes slidein {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-100%); // 每行高50
    }
  }

  .runnews-enter-active, .runnews-leave-active {
    transition: all 0.5s linear;
  }

  .runnews-leave-to {
    transform: translateY(-100%);
  }

  .runnews-enter {
    transform: translateY(100%);
  }
  .news-group {
    .news-list{
      display:flex;
      margin:0 20px;
      box-shadow 0 1px 8px #efefef;
      border-radius:5px;
      padding:10px;
      .image{
        width: 60px;
        height: 60px;
        margin-right:8px;
        img{
          display:block;
          width: 100%;
          height: 100%;
          border-radius:5px;
        }
      }
      .text{
        flex:1;
        margin-top:8px;
        font-size:15px;
        line-height:20px;
      }
      +.news-list{
        margin-top:10px;
      }
    }
  }
</style>
