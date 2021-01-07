/**Created by liaoyingchao on 2019-09-27.*/

<template>
  <div class="coupon-lq" :style="getBgDivStyle()">
    <div class="coupon-content" v-if="listShowDatas.length > 0 || usePorpData != true" :style="getSidesStyle()">
      <div class="coupon" v-for="(item, idx) in listShowDatas" :key="idx">
        <div class="icon-img">
          <img :src="item.couPic">
        </div>
        <div class="info">
          <p class="text single-line">{{item.couTypeTitle}}</p>
          <p class="sub-text single-line">{{item.couTypeSubTitle}}</p>
          <p class="price"><span>¥</span>{{item.couFaceValue}}<span>元</span></p>
        </div>
        <div class="btn">立即领取</div>
      </div>
    </div>
  </div>
</template>

<script>
  import Bus from '../bus';

  export default {
    name: "coupon-lq",
    props: ['myIndex', 'usePorpData', 'propData'],
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
    components: {},
    data() {
      return {
        listShowDatas: []
      }
    },
    methods: {
      _getMyData: function () {
        let url = this.$market.apiBaseURL() + '/app/json/coupon/getUnusedCouponsWithCols';
        let paramsData = {
          token: this.$store.state.login.token,
          page:1,
          rows:10
        };
        if (this.$store.state.webtype == '-1') {
          paramsData.token = 'c:app:ABE1DDA92F0F43BC8C67187A3A634490'
        } else if (paramsData.token == '') {
          // 内置一个token
          paramsData.token = 'c:app:ABE1DDA92F0F43BC8C67187A3A634490'
        }
        this.listShowDatas = [];
        this.$http.post(url, paramsData).then(res => {
          let data = res.data;
          if (data.status == 0) {
            this.listShowDatas = data.data
          } else {
          }
        }, error => {
        })
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
      modeleReshow:function(){
        this._getMyData();
      },
    },
    created() {
      this._getMyData()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .coupon-lq {
    overflow hidden
    .coupon-content {
      min-height 30px;
      .coupon {
        border-radius 4px;
        //background-color #F0E5CB;
        padding 12px 22px 14px;
        background: url('../../../../../static/images/coupon/coupon-bg.png') no-repeat center center / 100% 100%;
        display flex;
        align-items center;
        .icon-img {
          width 80px;
          height 80px;
          border-radius 4px;
          img {
            display block;
            width 100%;
            height 100%;
          }
        }
        .info {
          flex 1;
          padding 0px 30px 0px 10px;
          .text {
            font-size 14px;
            font-weight 500;
          }
          .sub-text {
            font-size 12px;
            margin-top 5px;
          }
          .price {
            margin-top 12px;
            font-size 25px;
            font-weight 600;
            color #B07351;
            span {
              font-size 12px;
            }
          }
        }
        .btn {
          margin-top 10px;
          border-radius 3px;
          font-size 13px;
          background-color #B07351;
          color white;
          width 73px;
          text-align center;
          padding 8px 5px;
        }
      }
      /*.coupon:nth-child(n+2) {
        margin-left 8px;
      }*/
    }
  }
</style>
