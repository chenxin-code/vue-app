<template>
  <div class="my-points">
    <div v-if="moduleData.styleTempl == '1'" class="my-center" :style="$market.getModuleBgStyle(moduleData)">
      <div class="card-div" :style="getCardHeight(moduleData)">
        <div class="img-bg" :style="getCardHeight(moduleData)">
          <img :src="moduleData.myBgImg">
        </div>
        <div class="content-div" :style="getTopMarginStyle()">
          <div class="points-div">
            <span>积分</span>
            <span class="number">{{$store.state.mall2.myAssets.surplusPoints}}</span>
          </div>
          <div class="tag" :class="hotareaClass({idCode: moduleData.idCode+'mx'})" @click="hotEvent('mx');$market.customPush({path:'/mall2/integralinfo'})">
            <span>明细</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import hee from "../_js/hotarea-extend-event";

  export default {
    name: 'my-points',
    components: {},
    props: ['myIndex', 'usePorpData', 'propData', 'barHeight'],
    mixins: [hee],
    data() {
      return {
        userInfo: {},
      };
    },
    watch: {},
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
    created() {
      this.getMyAssets();
    },
    methods: {
      /**
       * @description 热力统计事件
       */
      hotEvent(eKey=''){
        this.actionBtnEvent(this.pageData.pgCode, this.moduleData.idCode + eKey)
      },
      getCardHeight: function (moduleData) {
        if (this.barHeight == 20) {
          return ''
        }
        let h = 140 + this.barHeight - 20;
        return 'height: ' + h + 'px;';
      },
      modeleReshow: function () {
        this.getMyAssets();
      },
      getTopMarginStyle: function () {
        let styleStr = ''
        if (this.barHeight) {
          styleStr += "marginTop: " + (this.barHeight + this.$market.getNavHeight(true)) + "px;";
        }
        return styleStr
      },
      getMyAssets: function () {
        let url = this.$market.apiBaseURL() + '/app/json/user/getUserWallet';
        let paramsData = {
          token: this.$store.state.login.token,
        };
        this.$http.post(url, paramsData).then(
          res => {
            let data = res.data;
            if (data.status == 0) {
              this.$store.state.mall2.myAssets = data.data
            }
          },
          error => {
          }
        );
      },
    },
  };
</script>

<style lang="stylus" scoped>
  @import '~@/common/stylus/variable.styl';
  //
  .my-points {
    .card-div {
      position relative;
      height 140px;
      .img-bg {
        width: 200%;
        height: 140px;
        position: absolute;
        left: -50%;
        top: 0;
        z-index 1
        content: '';
        overflow hidden;
        border-radius: 0 0 50% 50%;
        img {
          position absolute;
          left 25%;
          top 0px;
          width 50%
          height 100%;
        }
      }
      .content-div {
        position absolute;
        top 0px;
        z-index 2;
        left 0px;
        right 0px;
        margin-left 12px;
        margin-right 12px;
        padding-top 4px;
        text-align center;
        .points-div {
          font-size 14px;
          color white;
          text-align center;
          .number {
            margin-left 4px;
            font-size 28px;
            font-weight 500;
          }
        }
        .tag {
          margin 0 auto;
          width 100px;
          padding 8px;
          text-align center;
          span {
            display inline-block;
            width 48px;
            font-size 12px;
            padding 2px 5px;
            border-radius 20px;
            background-color #fff;
            color #F63A3C;
          }
        }
      }
    }
  }
</style>

