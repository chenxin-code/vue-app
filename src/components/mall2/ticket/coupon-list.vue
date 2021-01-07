<template>
  <div class="couponlist">
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content>
      <div class="condition">
        <div class="btns-con">
          <div class="left-btn" @click="filterClick('usable')" :class="{'theme_font_red':selectType==0}">
            可用<span :class="{'under-line':selectType==0}">优惠券</span><span class="">&nbsp&nbsp({{availablecount}})</span>
          </div>
          <div class="right-btn" @click="filterClick('unusable')" :class="{'theme_font_red':selectType==1}">
            不可用<span :class="{'under-line':selectType==1}">优惠券</span><span class="">&nbsp&nbsp({{unavailablecout}})</span>
          </div>
        </div>
      </div>
      <div class="scrol">
        <ecoupon :isShowTip="selectType==0?true:false"
                 :couponlist="selectType==0?usablecouponlist:unusablecoupons"
                 @selectcoupon="chooseCoupon"></ecoupon>
      </div>
    </nav-content>
  </div>
</template>

<script>
  import Ecoupon from '../common/coupon/e-coupon'

  export default {
    name: 'couponlist',
    components: {
      Ecoupon
    },
    data() {
      return {
        availablecount:'2',
        unavailablecout:'10',
        selectType:0,
        usablecouponlist: [
          {
            faceamt: '70',
            limmony: '1000',
            title: '仅可购买平台非油品商品平台非油品商品',
            startdate: '2018-10-01',
            enddate: '2018-10-31',
            ectype: '平台券',
          },
          {
            faceamt: '70',
            limmony: '1000',
            title: '仅可购买平台非油品商品',
            startdate: '2018-10-01',
            enddate: '2018-10-31',
            ectype: '平台券',

          },
          {
            faceamt: '70',
            limmony: '1000',
            title: '仅可购买平台非油品商品',
            startdate: '2018-10-01',
            enddate: '2018-10-31',
            ectype: '平台券',
          },
        ],
        unusablecoupons: [
          {
            faceamt: '70',
            limmony: '1000',
            title: '仅可购买平台非油品商品',
            startdate: '2018-10-01',
            enddate: '2018-10-31',
            ectype: '平台券',
          },
          {
            faceamt: '100',
            limmony: '2000',
            title: '仅可购买平台非油品商品',
            startdate: '2018-10-01',
            enddate: '2018-10-31',
            ectype: '平台券',

          }
        ],
      }
    },
    methods: {
      filterClick: function (type) {
        console.log(type)
        if (type=='usable'){
          this.selectType = 0;

        } else if(type=='unusable'){
          this.selectType = 1;
        }

      },
      chooseCoupon:function (coupon) {
        console.log('choose')
      },
      _getCouponList:function () {//获取电子券列表接口

        this.$Loading.open();
        let url = '/app/json/user_address/searchSelfliftAddressList';
        let params1 = {

          token: this.$store.state.login.token,
        }
        console.log(params1)

        this.$http.post(url, params1).then(res => {
          this.$Loading.close()
          let data = res.data;
          console.log('电子券列表:',data);
          if (data.status == 0) {
            this.siteList = data.data
          } else {
            this.$Toast(data.info)
          }
        }, error => {
          this.$Loading.close()
          console.log('电子券', error);
          this.$Toast('获取电子券失败')
        });
      },
      _getcount:function () {//获取电子可用、不可用券数量
        this.$Loading.open();
        let url = '/app/json/coupon/getcount';
        let params1 = {

          token: this.$store.state.login.token,
        }
        console.log(params1)

        this.$http.post(url, params1).then(res => {
          this.$Loading.close()
          let data = res.data;
          console.log('电子券列表:',data);
          if (data.status == 0) {
            this.siteList = data.data
          } else {
            this.$Toast(data.info)
          }
        }, error => {
          this.$Loading.close()
          console.log('电子券', error);
          this.$Toast('获取电子券失败')
        });
      }
    },
    created() {

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .couponlist{
    width 100%
    height 100%
    overflow hidden
    .condition{
      width 100%
      height 30px
      /*background-color #007aff*/
      font-size $font-size-medium
      display flex
      align-items center
      justify-items center
      .btns-con{
        margin: auto
        .left-btn{
          display inline-block
          i{
            font-size $font-size-medium-x
          }
        }
        .right-btn{
          margin-left 20px
          display inline-block
          i{
            font-size $font-size-medium-x
          }
        }
      }
    }
    .scrol{
      position absolute
      top 30px
      left 0px;
      right 0px
      bottom  0px
      /*overflow-x hidden;*/
      /*overflow-y auto;*/
      /*-webkit-overflow-scrolling touch*/
    }
    .under-line{
      text-decoration: underline
    }
  }

</style>
