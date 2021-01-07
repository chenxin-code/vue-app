<template>
  <div class="my-coupon mall2">
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content>
      <div class="tabs">
        <div class="tab-item" v-for="item in tabs" @click="tabEvent(item.tag)">
          <div class="text theme_font_black" :class="{'selected-btn': tabSelected == item.tag}">
            {{item.text}}
          </div>
          <!--<div class="line" :class="{theme_bg_red_i: tabSelected == item.tag}"></div>-->
        </div>
      </div>
      <!--<div class="tip" v-if="tabSelected==1 && couponList.length">-->
        <!--<div class="left-con">-->
          <!--<i class="iconfont mall-youhuiquan-xianxing"></i>-->
          <!--<span>您有74张待领取的优惠券哦</span>-->
        <!--</div>-->
        <!--<i class="iconfont mall-gengduojiantou" @click="moreCoupon"></i>-->
      <!--</div>-->
      <div class="scroll-div theme_bg_ml_red">
        <coupon-list v-if="!isShowTipView" :coupons="couponList" :listType="couponType" @getCouponEvent="getCouponEvent"
                     @couponProducts="couponProducts" @itemEvent="itemEvent"></coupon-list>
        <div v-if="isShowTipView" class="tipbg">
          <div class="tipcont">
            <i class="iconfont mall-youhuiquan-xianxing theme_font_tint"></i>
            <div class="tiptitle theme_font_gray">没有券？<br><span class="theme_font_tint">去领券中心看看吧</span></div>
            <div class="look theme_font_gray theme_border_light_i" @click="moreCoupon">去看看</div>
          </div>
        </div>
      </div>
      <!--<div class="tabbar theme_bg_white">-->
        <!--<span @click="moreCoupon">领更多好券</span>-->
        <!--<span @click="couponCenter">去券集市</span>-->
      <!--</div>-->
    </nav-content>
  </div>
</template>

<script>
  import CouponList from '../common/coupon/base/list'

  export default {
    name: 'my-coupon',
    components: {
      CouponList
    },
    data() {
      return {
        tabSelected: '1',
        tabs: [
          {
            text: '未使用',
            tag: '1',
            count: 0
          }, {
            text: '使用记录',
            tag: '2',
            count: 0
          }, {
            text: '已过期',
            tag: '3',
            count: 0
          }],
        couponList: [],
        selectedItem: {},
        isShowTipView: true,
        couponType:3,
      }
    },
    methods: {
      tabEvent: function (tag) {
        if (tag != this.tabSelected) {
          this._getCouponList(tag)
        }
        if (tag==1){
          this.couponType = 3;
        }else if(tag==2){
          this.couponType = 4;
        }else if(tag==3){
          this.couponType = 5;
        }
        this.tabSelected = tag
      },
      moreCoupon: function () {//领更多券
        console.log('moreCoupon')
      },
      couponCenter: function () {//券集市
        console.log('couponCenter')
      },
      _getCouponList: function (tag) {
        this.$Loading.open();
        let url;
        if (tag == '1') {//未使用
          url = '/app/json/coupon/unusedcoupons'
        } else if (tag == '2') {//已使用
          url = '/app/json/coupon/usedcoupons'
        } else if (tag == '3') {//已过期
          url = '/app/json/coupon/overduecoupons'
        }
        let paramsData = {
          token: this.$store.state.login.token,
        };
        this.$http.post(url, paramsData).then(
          res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              console.log('电子券', data)
              if (data.data.length) {
                this.isShowTipView = false;
                this.dealwithData(data.data);
              } else {
                this.isShowTipView = true;
              }
            } else {
              this.$Toast(data.info);
            }
          },
          error => {
            this.$Loading.close();
            this.$Toast('获取电子券失败！')
          }
        );
      },
      dealwithData: function (data) {
        let allList = [];
        for (let index in data) {
          let item = data[index];
          let dic = {};
          dic.consumptionDesc = '';// 消费说明
          dic.couAmount = '';// 券金额
          dic.couCategory = ''; // 券类型
          dic.couDesc = ''; // 券使用说明
          dic.couFaceValue = parseInt(item.facevalue);// 券面值金额
          dic.couNeedActive = '';//是否需要激活：0-不需要激活  1-需要激活
          dic.couNo = item.coucode;// 券号
          dic.couOriginCode = '';// 电子券来源方
          dic.couOriginType = '';// 电子券来源方式
          dic.consumptionDesc = item.consumptionDesc;// 消费说明
          dic.couPic = item.imgurl;// 电子券图片路径
          dic.couThresholdAmount = item.couThresholdAmount;// 门槛金额 如：满1000可用
          dic.couTypeAlias = '';// 券类型别名
          dic.couTypeCode = item.biztype;// 券类型编码
          dic.couTypeCodeThird = '';//第三方的券类型编码
          dic.couTypeSubTitle = item.typename;// 电子券副标题
          dic.couTypeTitle = item.typetitle;// 电子券标题
          dic.isReceived = '';// 是否已领取 0可领取、1已领取
          dic.mktActivityId = '';// 活动ID
          dic.validEndDate = item.couenddate.substr(0, 10);// 有效期过期日期
          dic.validStartDate = item.coustartdate.substr(0, 10);// 有效期开始日期
          allList.push(dic)

        }
        this.couponList = allList
        console.log('couponList', this.couponList)
      },
      getCouponEvent: function (item) {

      },
      couponProducts: function () {
        console.log('couponProducts')
      },
      itemEvent: function (item) {
        this.selectedItem = item
      },
      _getCouponCount: function () {
        let url = '/app/json/coupon/getcount';
        let paramsData = {
          token: this.$store.state.login.token,
        };
        this.$http.post(url, paramsData).then(
          res => {
            let data = res.data;
            if (data.status == 0) {
              console.log('电子券数量', data)
              this.tabs[0].count =  data.usednum?data.usednum:0;
              this.tabs[1].count =  data.unnusednum?data.unnusednum:0;
              this.tabs[2].count =  data.expnum?data.expnum:0;
              console.log('tab', this.tabs)
            } else {
              this.$Toast(data.info);
            }
          },
          error => {

          }
        );
      }
    },
    created() {
      this._getCouponList(this.tabSelected);
      this._getCouponCount();

    },
    beforeRouteLeave(to, from, next) {
      this.$keepaliveHelper.deleteCache(this)
      next()
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .my-coupon {
    width 100%
    height 100%
    overflow hidden
    .scroll-div {
      position absolute;
      bottom 0px;
      left 0px;
      top 32px;
      right 0px;
      overflow-x hidden;
      overflow-y auto;
      -webkit-overflow-scrolling touch;
      .tipbg {
        width 100%
        height 100%
        display flex

        .tipcont {
          margin auto
          text-align center
          i {
            font-size: 50px;
          }
          .tiptitle {
            margin-top 20px
            font-size $font-size-large-x
            span {
              font-size $font-size-medium
            }
          }

          .look {
            margin-top 25px
            font-size $font-size-large
            border-radius 6px;
            border 0.5px solid
            padding 10px 15px
          }
        }
      }
    }
    /*.scroll-top {
      top 35px;
    }
    .scroll-top1 {
      top 35px;
    }*/
    .tabbar {
      width: 100%;
      height: 40px;
      position: absolute;
      bottom: 0px;
      left: 0px;
      display: flex;
      box-shadow 0 0px 5px #efefef;
      span {
        width: 50%;
        line-height: 40px;
        font-size: $font-size-medium-s;
        text-align: center;
      }
    }
    .tip {
      height 34px
      width 100%
      display flex
      align-items center
      i {
        font-size: $font-size-medium-x;
        margin-left 10px
      }
      .left-con {
        flex 1
        span {
          width: 100%;
          line-height: 34px;
          font-size: $font-size-medium;
          text-align: center;
        }
      }
    }
  }

</style>
