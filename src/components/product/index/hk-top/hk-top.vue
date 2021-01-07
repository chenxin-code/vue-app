/**Created by liaoyingchao on 2020-06-30.*/

<template>
  <div class="hk-top" v-if="$market.moduleIsShow(moduleData)">
    <div class="cont-div" :style="getBaseStyle(moduleData)">
      <div class="user-info">
        <div class="header-img">
          <img :src="headImg">
        </div>
        <div class="info-div">
          <p class="">{{$store.state.userInfo.nickName ? $store.state.userInfo.nickName :
            $store.state.userInfo.userName}}</p>
        </div>
        <div class="location" :class="hotareaClass({idCode: moduleData.idCode + 'toProvince'})" @click="hotEvent('toProvince');toProvince()">
          <img src="static/images/esh-top/dw.png">
          <span>{{$store.state.indexData.province}}</span>
        </div>
      </div>
      <div class="hkd-div">
        <img src="static/images/hk/hkd-icon.png">
        <div class="title">我的优客点</div>
        <div class="btn line_radius" v-if="$store.state.login.token == ''" :class="hotareaClass({idCode: moduleData.idCode + 'toLogin'})" @click="hotEvent('toLogin');toLogin()">点我登录</div>
        <div class="number" v-else>{{getAssetsValue({rewardType: '100'})}}</div>
      </div>
      <div class="blocks-div">
        <div class="block" :class="hotareaClass({idCode: moduleData.idCode + 'myhkd'})" @click="hotEvent('myhkd');$market.customPush({path: '/hk/myhkd'})">
          <div class="line_right">
            <p>资产明细</p>
          </div>
        </div>
        <div class="block" :class="hotareaClass({idCode: moduleData.idCode + 'exchange'})" @click="hotEvent('exchange');$market.customPush({path: '/hk/exchange'})">
          <div class="line_right">
            <p>权益领取</p>
          </div>
        </div>
        <div class="block" :class="hotareaClass({idCode: moduleData.idCode + 'orderlist'})" @click="hotEvent('orderlist');$market.customPush({path: '/mall2/orderlist'})">
          <div>
            <p>我的订单</p>
          </div>
        </div>
      </div>
    </div>
    <!--<div class="cont-div" :style="getBaseStyle(moduleData)">-->
      <!--<div class="user-info">-->
        <!--<div class="header-img">-->
          <!--<img :src="headImg">-->
        <!--</div>-->
        <!--<div class="info-div">-->
          <!--<p class="">{{$store.state.userInfo.nickName ? $store.state.userInfo.nickName :-->
            <!--$store.state.userInfo.userName}}</p>-->
        <!--</div>-->
        <!--<div class="more" @click="$market.customPush({path: '/usercenter/rebatebonuslist', query: {dictKey: 3}})">-->
          <!--<div class="">我的优客点</div>-->
          <!--<div class="num">{{getAssetsValue({rewardType: '100'})}}</div>-->
          <!--<i class="iconfont mall-gengduojiantou"></i>-->
        <!--</div>-->
      <!--</div>-->
      <!--<div class="exchange-div">-->
        <!--<div class="input-div" @click="inputEvent">-->
          <!--<input ref="MyInput" placeholder="请输入优客点兑换码" v-model="exchangeCode"/>-->
        <!--</div>-->
        <!--<div class="btn" @click="exchangeEvent">兑换</div>-->
      <!--</div>-->
      <!--<div class="blocks-div">-->
        <!--<div class="block" @click="$market.customPush({path: $store.state.globalConfig.couponGroupMode == 1 ? '/coupon_list2' : '/coupon_list'})">-->
          <!--<div class="line_right">-->
            <!--<div class="num">{{$store.state.mall2.myAssets.couponNum}}</div>-->
            <!--<p>我的加油券</p>-->
          <!--</div>-->
        <!--</div>-->
        <!--<div class="block" @click="$market.customPush({path: '/mall2/orderlist'})">-->
          <!--<div>-->
            <!--<div>-->
              <!--<img src="static/images/hk/order.png">-->
            <!--</div>-->
            <!--<p>我的订单</p>-->
          <!--</div>-->
        <!--</div>-->
      <!--</div>-->
    <!--</div>-->
  </div>
</template>

<script>
  import hee from "../_js/hotarea-extend-event";

  export default {
    name: "hk-top",
    props: ['myIndex', 'usePorpData', 'propData', 'barHeight'],
    computed: {
      headImg() {
        if (this.$store.state.userInfo.headImg && this.$store.state.userInfo.headImg != 'undefined') {
          return this.$store.state.userInfo.headImg
        } else {
          return this.moduleData.headImg
        }
      },
      pageData: function () {
        if (this.usePorpData == true) {
          return this.propData;
        }
        return this.$store.state.pageData;
      },
      moduleData: function () {
        return this.pageData.moduleList[this.myIndex].data;
      }
    },
    mixins: [hee],
    data() {
      return {
        exchangeCode: ''
      }
    },
    methods: {
      /**
       * @description 热力统计事件
       */
      hotEvent(eKey=''){
        this.actionBtnEvent(this.pageData.pgCode, this.moduleData.idCode + eKey)
      },
      toProvince: function () {
        this.$market.customPush({
          path: '/hk/province'
        })
      },
      toLogin: function () {
        this.$util.toLogin()
      },
      inputEvent: function () {
        this.$refs.MyInput.focus()
      },
      getAssetsValue: function (item) {

        if (item.rewardType) {
          let rewardList = this.$store.state.mall2.myAssets.rewardList
          for (let i = 0; rewardList && i < rewardList.length; i++) {
            if (rewardList[i].rewardsSurplusOrderType == item.rewardType) {
              return rewardList[i].rewardsSurplus
            }
          }
          return '0'
        }

        return this.$store.state.mall2.myAssets[item.countKey]
      },
      exchangeEvent: function () {
        if (this.exchangeCode == '') {
          this.$Toast('请输入兑换码！')
          return ;
        }
        this.$market.exchangeEvent(this.exchangeCode)
      },
      getBaseStyle: function (data) {
        let styleStr = '';
        if (data.bgColor != '') {
          styleStr += 'background-color: ' + data.bgColor + ';';
        }
        if (data.bgImgUrl != '') {
          styleStr += "background: url('" + data.bgImgUrl + "') no-repeat center center / 100% 100%;"
        }

        return styleStr;
      },
      modeleReshow: function () {
        this.getMyAssets();
      },
      getMyAssets: function () {
        if (this.$store.state.login.token == '') {
          return ;
        }
        let url = this.$market.apiBaseURL() + '/app/json/user/getUserWallet';
        let params = {
          token: this.$store.state.login.token,
        };
        this.$http.post(url, params).then(
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
    created() {
      this.getMyAssets()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .hk-top {
    width 100%
    .cont-div {
      //background-color transparent;
      height 140px;
      .user-info {
        display flex;
        align-items center;
        padding 10px 15px;
        .header-img {
          border-radius 30px;
          overflow hidden;
          img {
            display block;
            width 60px;
            height 60px;
          }
        }
        .info-div {
          flex 1;
          padding 0 8px;
          font-size 20px;
          font-weight 500;
          color white;
        }
        .location {
          padding 10px 0;
          display flex;
          align-items center;
          color white;
          font-size 14px;
          img {
            height 18px;
          }
        }
      }
      .exchange-div {
        padding 0 15px;
        display flex;
        align-items center;
        .input-div {
          background-color rgba(255, 255, 255, 0.5)
          flex 1;
          padding 0 8px;
          //height 40px;
          border-radius 4px;
          overflow hidden;
          input {
            background-color transparent;
            line-height 40px;
            width 100%;
          }
        }
        .btn {
          height 40px;
          line-height 40px;
          padding 0 15px;
          font-size 16px;
          //font-weight 500;
          margin-left 10px;
          background-color white;
          border-radius 4px;
          color #FD6802
        }
      }
      .hkd-div {
        position relative;
        z-index 20;
        margin 0 16px;
        background-color white;
        border-radius 8px;
        display flex;
        align-items center;
        box-shadow 0 0px 8px #ddd;
        padding 10px 10px 26px;
        img {
          height 50px;
          margin 0 10px
        }
        .title {
          flex 1;
          font-size 16px;
        }
        .number {
          font-size 16px;
          color #FD6802
        }
        .btn {
          font-size 14px;
          color #FD6802
          padding 8px 14px;
          &:before {
            border-color #FD6802;
          }
        }
      }
      .blocks-div {
        position relative;
        z-index 20;
        background-color white;
        border-radius 8px;
        margin -20px 10px 0px;
        box-shadow 0 1px 8px #ddd;
        display flex;
        align-items center;
        .block {
          padding 10px 0;
          flex 1;
          text-align center;
          font-size 0;
          p {
            font-size 13px;
            padding 10px 10px;
          }
        }
      }
    }
    /*.cont-div {
      height 160px;
      .user-info {
        display flex;
        align-items center;
        padding 10px 15px;
        .header-img {
          border-radius 30px;
          overflow hidden;
          img {
            display block;
            width 60px;
            height 60px;
          }
        }
        .info-div {
          flex 1;
          padding 0 8px;
          font-size 20px;
          font-weight 500;
          color white;
        }
        .more {
          display flex;
          align-items center;
          color white;
          font-size 12px;
          .num {
            font-size 18px;
            font-weight 500;
            padding 0 6px;
          }
          i {
            font-size 14px;
            color white;
          }
        }
      }
      .exchange-div {
        padding 0 15px;
        display flex;
        align-items center;
        .input-div {
          background-color rgba(255, 255, 255, 0.5)
          flex 1;
          padding 0 8px;
          //height 40px;
          border-radius 4px;
          overflow hidden;
          input {
            background-color transparent;
            line-height 40px;
            width 100%;
          }
        }
        .btn {
          height 40px;
          line-height 40px;
          padding 0 15px;
          font-size 16px;
          //font-weight 500;
          margin-left 10px;
          background-color white;
          border-radius 4px;
          color #FD6802
        }
      }
      .blocks-div {
        position relative;
        z-index 20;
        background-color white;
        border-radius 8px;
        margin 10px 15px 0px;
        display flex;
        align-items center;
        .block {
          padding 10px 0;
          flex 1;
          text-align center;
          font-size 0;
          img {
            height 18px;
          }
          .num {
            font-size 16px;
            color #FD6802
            font-weight 500;
          }
          p {
            font-size 13px;
            margin-top 6px;
          }
        }
      }
    }*/
  }
</style>
