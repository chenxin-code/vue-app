/**Created by liaoyingchao on 2020-08-04.*/

<template>
  <div class="tabs-block">
    <van-tabs v-model="active" :border="false" :sticky="moduleData.sticky == true" :offset-top="getTopHeight()" :before-change="tabChange" :background="getBgStyle" :color="moduleData.lineColor" :title-active-color="moduleData.titleActiveColor" :title-inactive-color="moduleData.titleInactiveColor">
      <van-tab v-for="(tab, idx) in moduleData.tabs" :title="tab.name" :key="idx">
        <SubPage v-if="refersh && getTabData(idx)" :propsPageData="getTabData(idx)" :barHeight="0"></SubPage>
      </van-tab>
      <template slot="nav-right" v-if="moduleData.rightBtnImage">
        <div class="right-btn-img">
          <img :src="moduleData.rightBtnImage">
        </div>
      </template>
    </van-tabs>
    <div class="right-btn-img abs" :class="hotareaClass({idCode: moduleData.idCode})" v-if="moduleData.rightBtnImage" :style="{backgroundColor: getBgStyle}" @click="hotEvent();rightEvent()">
      <img :src="moduleData.rightBtnImage">
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex';
  import Bus from "../bus";
  import hee from "../_js/hotarea-extend-event";

  export default {
    name: "tabs-block",
    components: {
      SubPage: () => import('../subpage/subpage'),
    },
    props: ['myIndex', 'usePorpData', 'propData'],
    mixins: [hee],
    data() {
      return {
        refersh: true,
        active: 0,
        tabsData: {},
      }
    },
    computed: {
      ...mapGetters(['clientWidth']),
      pageData: function() {
        if (this.usePorpData == true) {
          return this.propData;
        }
        return this.$store.state.pageData;
      },
      moduleData: function() {
        return this.pageData.moduleList[this.myIndex].data;
      },
      getBgStyle: function () {
        let color = this.moduleData.bgColor
        if (color != '') {
          return color
        }
        return ''
      },
    },
    created() {
      Bus.$on("tabLinkChanged", busData => {
        let index = busData.index
        let item = this.moduleData.tabs[index]
        if (item.newPage != true && item.link.type == '1') {
          this.getPageData(item.link.pgCode, index)
        }
      });

      this.initTabData(this.active)
    },
    methods: {
      /**
       * @description 热力统计事件
       */
      hotEvent(eKey=''){
        this.actionBtnEvent(this.pageData.pgCode, this.moduleData.idCode + eKey)
      },
      getTopHeight: function () {
        let value = this.$market.getBarHeight() + this.$market.getNavHeight()
        return value;
      },
      initTabData: function (index) {
        let item = this.moduleData.tabs[index]
        if (item.link.type == '1') {
          this.getPageData(item.link.pgCode, index)
        }
      },
      getTabData: function (idx) {
        let key = idx + ''
        return this.tabsData[key]
      },
      getTopHeight: function () {
        let value = this.$store.state.barHeight + this.$market.getNavHeight()
        return value;
      },
      rightEvent: function () {
        this.$market.enterNav({link: this.moduleData.rightLink})
      },
      tabChange: function (index) {
        let item = this.moduleData.tabs[index]
        if (item.newPage != true && item.link.type == '1') {
          if (!this.getTabData(index)) {
            this.getPageData(item.link.pgCode, index)
          }
          return true
        } else {
          this.$market.enterNav(item)
          return false
        }
      },
      getPageData: function (pgCode, index) {
        let url = this.$market.apiBaseURL() + '/app/json/app_vue_page/vueGetPageData';
        // let params = new FormData()
        let params1 = {
          pgCode: pgCode,
          accessType: '2'
        }
        this.$Loading.open()

        this.$http.post(url, params1).then(res => {
          let data = res.data;
          this.$Loading.close()
          if (data.status == 0) {
            console.log(data);
            if (data.data && data.data.pageDataJson) {
              let json = JSON.parse(data.data.pageDataJson);
              let key = index + ''
              this.tabsData[key] = json
              this.refersh = false
              this.$nextTick(() => {
                this.refersh = true
              })
            }
          } else {
            this.$Message.error('请求数据出错，请稍后重试!');
          }
          // _this.$Loading.close();
        }, error => {
          this.$Loading.close()
          this.$Message.error('请求数据出错，请稍后重试!');
        })
      }
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .tabs-block {
    width 100%
    height 100%
    overflow hidden
    position relative;
    >>>.van-tab__text--ellipsis {
      padding 2px 0;
    }
    .right-btn-img {
      &.abs {
        position absolute;
        right 0;
        top 0;
        background-color white
      }
      max-width 150px;
      img {
        display block;
        height 44px;
      }
    }
  }
</style>
