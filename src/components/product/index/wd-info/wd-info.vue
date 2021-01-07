/**Created by liaoyingchao on 2020-05-12.*/

<template>
  <div class="wd-info">
    <div class="info-div">
      <div class="title">{{comData.storeName || '逛微店'}}</div>
      <div class="shoucang" :class="hotareaClass({idCode: moduleData.idCode + 'collection'})" @click="hotEvent('collection');collection()">
        <i class="iconfont mall-shoucang" :class="{theme_font_red: isCollect}"></i>
      </div>
      <!--<div class="share">-->
        <!--<i class="iconfont mall-fenxiang"></i>-->
      <!--</div>-->
      <div class="more-shop" :class="hotareaClass({idCode: moduleData.idCode + 'moreMicorShop'})" @click="hotEvent('moreMicorShop');moreMicorShop()">更多店铺</div>
    </div>
  </div>
</template>

<script>
  import hee from "../_js/hotarea-extend-event";

  export default {
    name: "wd-info",
    props:{
      myIndex:{},
      usePorpData:{},
      propData:{},
      comData:{
        type:Object,
        default(){
          return {}
        }
      }
    },
    components: {},
    watch: {
      'comData': function() {
        this.isCollect = this.comData.collect == 0 ? false : true
      }
    },
    mixins: [hee],
    data() {
      return {
        isCollect: false
      }
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
    methods: {
      /**
       * @description 热力统计事件
       */
      hotEvent(eKey=''){
        this.actionBtnEvent(this.pageData.pgCode, this.moduleData.idCode + eKey)
      },
      moreMicorShop: function () {
        this.$market.customPush({
          path: '/micro_sho/microshop_list'
        })
      },
      collection() {
        this.$Loading.open();
        this.$http
          .post("/app/json/micro_store_front_end/addOrCancelMicroStoreCollect", {
            storeId: this.comData.storeId
          })
          .then(res => {
            this.$Loading.close();
            if (res.data.status == 0) {
              this.isCollect = !this.isCollect;
              this.$Toast(!this.isCollect ? "已取消收藏" : "收藏成功");
            } else {
              this.$Toast(res.data.info);
            }
          });
      },
    },
    created() {
      
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .wd-info {
    width 100%
    overflow hidden
    .info-div {
      display flex;
      align-items center;
      padding 0px 10px;
      .title {
        flex 1;
        font-size 14px;
        padding 0 5px;
      }
      i {
        font-size 16px;
      }
      .shoucang {
        padding 8px 5px;
      }
      .share {
        padding 8px 5px;
      }
      .more-shop {
        font-size 12px;
        background-color #E7A851;
        color white;
        margin 0 5px;
        padding 5px 10px;
        border-radius 15px;
      }
    }
  }
</style>
