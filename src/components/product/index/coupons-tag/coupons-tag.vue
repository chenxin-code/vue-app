/**Created by liaoyingchao on 2019-08-01.*/

<template>
  <div class="coupons-tag" :class="hotareaClass({idCode: moduleData.idCode})" :style="getBgStyle()" @click="hotEvent();toCoupons()" v-if="$market.moduleIsShow(moduleData)">
    <div :style="getSidesStyle()" v-if="moduleData.styleType!=2">您有{{couponNum}}张电子券未使用，点击查看电子券详情。</div>
    <div :style="getSidesStyle()" v-else class="jy-container">
      <img :src="'https://djljy-default.oss-cn-shanghai.aliyuncs.com/content_bucket/00/00/70/53.png'" alt="">
      <!-- <img :src="moduleData.bgImgUrl" alt=""> -->
      <div class="float-box">
        <div class="text">我的易捷券</div>
        <div class="number-record">
          <div class="num">{{couponNum}}</div>
          <van-icon name="arrow" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex';
  import hee from "../_js/hotarea-extend-event";

  export default {
    name: "coupons-tag",
    props: ['myIndex', 'usePorpData', 'propData'],
    computed: {
      ...mapGetters(['clientWidth']),
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
    mixins: [hee],
    data() {
      return {
        couponNum:0,
      }
    },
    methods: {
      /**
       * @description 热力统计事件
       */
      hotEvent(eKey=''){
        this.actionBtnEvent(this.pageData.pgCode, this.moduleData.idCode + eKey)
      },
      toCoupons: function () {
        this.$market.customPush({
          path: '/icbc/mycoupon'
        })
      },
      getBgStyle: function () {
        let styleStr = '';
        let color = this.moduleData.bgColor
        if (color != '') {
          styleStr += "background-color: " + color +";"
        }
        let img = this.moduleData.bgImgUrl
        if (img != '' && this.moduleData.styleType != 2) {
          styleStr += "background: url('" + img + "') no-repeat center center / 100% 100%;"
        }
        return styleStr
      },
      getSidesStyle: function (noBottom = false) {
        let styleStr = '';
        let sidesMargin = this.moduleData.sidesMargin
        if (sidesMargin > 0) {
          styleStr += 'margin-left: ' + sidesMargin + '%; margin-right: ' + sidesMargin + '%;'
        }
        let upMargin = this.moduleData.upMargin
        let downMargin = this.moduleData.downMargin
        if (upMargin > 0) {
          styleStr += 'padding-top: ' + upMargin + '%;'
        }
        if (downMargin > 0 && !noBottom) {
          styleStr += 'padding-bottom: ' + downMargin + '%;'
        }
        let color = this.moduleData.textColor
        if (color) {
          styleStr += 'color: ' + color + ';'
        }

        return styleStr;
      },
      getCouponNum(){
        // TODO:此处有坑，暂无数量接口，暂用列表接口查询数量
        let url = `/app/json/coupon/getUnusedCouponsWithCols`
        let paramsData = {
          couTypeCategoryAlias:"YJBLD"
        }
        this.$Loading.open();
        this.$http.post(url, paramsData).then(res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status === 0) {
              let couponList = data.data || []
              this.couponNum = couponList.length
            } else if(this.$store.state.webtype != '-1'){
              this.$Toast(data.info)
            }
          },
          err => {
            this.$Loading.close();
            this.$Toast("系统运行过程中遇到问题，请稍候再试");
          }
        )
      },
    },
    created() {
      this.getCouponNum();
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .coupons-tag {
    width 100%
    height 100%
    overflow hidden
    font-size 13px;
    .jy-container{
      min-height:50px;
      position:relative;
      img{
        display block
        width 100%
      }
      .float-box{
        position:absolute;
        top 0
        right 0
        bottom 0
        left 0
        padding-left 90px;
        display:flex;
        align-items:center;
        justify-content:space-between;
        padding-right:30px;
        .text{
          font-size:15px;
        }
        .number-record{
          display:flex;
          font-size:13px;
          .num{
          }
          .van-icon{
            margin-left:5px;
          }
        }
      }
    }
  }
</style>
