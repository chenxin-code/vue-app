/**Created by liaoyingchao on 2019-09-27.*/

<template>
  <div class="coupon-jfhq" :style="getBgDivStyle()">
    <div class="coupon-content" v-if="listShowDatas.length > 0 || usePorpData != true" :style="getSidesStyle()">
      <div class="coupon" v-for="(item, idx) in listShowDatas" :key="idx">
        <div class="icon-img">
          <img :src="item.couPic">
        </div>
        <div class="btn">{{item.points}}兑换</div>
      </div>
    </div>
  </div>
</template>

<script>
  import Bus from '../bus';

  export default {
    name: "coupon-jfhq",
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
        let url = this.$market.apiBaseURL() + '/app/json/product/getAppProExchangeList';
        let paramsData = {
          page:1,
          rows:10
        };
        if (this.$store.state.webtype != '-1') {
          paramsData.token = this.$store.state.login.token
        }
        this.listShowDatas = [];
        this.$http.post(url, paramsData).then(res => {
          let data = res.data;
          if (data.status == 0) {
            this.listShowDatas = data.data.list
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
  .coupon-jfhq {
    overflow hidden
    .coupon-content {
      min-height 30px;
      display: flex;
      align-items center;
      overflow-x: auto;
      overflow-y: hidden;
      white-space: nowrap;
      -webkit-overflow-scrolling: touch;
      .coupon {
        border-radius 4px;
        background-color #F0E5CB;
        padding 12px 20px;
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
        .btn {
          margin-top 10px;
          border-radius 15px;
          font-size 13px;
          background-color #B07351;
          color white;
          width 80px;
          text-align center;
          padding 5px 10px;
        }
      }
      .coupon:nth-child(n+2) {
        margin-left 8px;
      }
    }
  }
</style>
