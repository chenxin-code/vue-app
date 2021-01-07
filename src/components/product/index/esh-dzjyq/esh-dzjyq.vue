/**Created by liaoyingchao on 2020-06-16.*/

<template>
  <div class="esh-dzjyq">
    <div class="block" :class="hotareaClass({idCode: moduleData.idCode + 'oilcoupon'})" @click="hotEvent('oilcoupon');routerPush('/icbc/oilcoupon',{noDetail: true})">
      <div class="icon">
        <img src="static/images/esh/jyq-icon-2.png">
      </div>
      <div class="title">电子加油券</div>
      <div class="right">
        <div class="amount">¥{{$market.toDecimal2(couponDetail.totalAmount)}}</div>
        <!--<div class="btns">-->
          <!--<div class="btn" :class="hotareaClass({idCode: moduleData.idCode + 'supportstation'})" @click.stop="hotEvent('supportstation');routerPush('/icbc/supportstation')">-->
            <!--<p class="line_right">可用油站</p>-->
          <!--</div>-->
          <!--<div class="btn" :class="hotareaClass({idCode: moduleData.idCode + 'oilcoupondetail'})" @click.stop="hotEvent('oilcoupondetail');routerPush('/icbc/oilcoupondetail')">-->
            <!--<p>明细</p>-->
          <!--</div>-->
        <!--</div>-->
      </div>
    </div>
    <div class="btns">
      <div class="btn" :class="hotareaClass({idCode: moduleData.idCode + 'orderlist'})" @click.stop="hotEvent('orderlist');routerPush('/icbc/orderlist')">
        <p class="line_right">购券记录</p>
      </div>
      <div class="btn" :class="hotareaClass({idCode: moduleData.idCode + 'oilcoupondetail'})" @click.stop="hotEvent('oilcoupondetail');routerPush('/icbc/oilcoupondetail')">
        <p class="line_right">券明细</p>
      </div>
      <div class="btn" :class="hotareaClass({idCode: moduleData.idCode + 'supportstation'})" @click.stop="hotEvent('supportstation');routerPush('/icbc/supportstation')">
        <p>可用油站</p>
      </div>
    </div>
  </div>
</template>

<script>
  import hee from "../_js/hotarea-extend-event";

  export default {
    name: "esh-dzjyq",
    components: {},
    props: ['myIndex', 'usePorpData', 'propData','preview'],
    mixins: [hee],
    data() {
      return {
        couponDetail: {}
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
      getJYCouponInfo: function () {

        let url = '/app/json/djljy/router?m=getAccount'
        let paramsData = {
          userId: this.$store.state.userInfo.userId
        };
        this.$Loading.open();
        this.$http.post(url, paramsData).then(res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status === 0) {
              this.couponDetail = JSON.parse(data.data).walletObj
            } else {
              this.$Toast(data.info)
            }
          },
          err => {
            this.$Loading.close();
            this.$Toast("系统运行过程中遇到问题，请稍候再试");
          }
        )
      },
      routerPush: function (path,query={}) {
        if(this.preview) return ;
        this.$router.push({path, query});
      },
    },
    created() {
      this.getJYCouponInfo()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .esh-dzjyq {
    width 100%
    height 100%
    overflow hidden
    .block {
      margin 8px 16px;
      box-shadow 0 1px 8px #efefef;
      border-radius 6px;
      padding 10px 10px 20px;
      display flex;
      align-items center;

      .icon {
        padding 0px 10px 0px 4px;
        border-right 1px dashed #ddd;

        img {
          display block;
          width 64px;
          height 64px;
        }
      }

      .title {
        padding 12px;
        flex 1;
        font-size 16px;
        font-weight 500;
      }

      .right {
        text-align center;

        .amount {
          font-weight 600;
          font-size 18px;
          color #CE0112;
        }

        /*.btn {
          margin-top 8px;
          padding 6px 12px;
          font-size 14px;
          color #CE0112;

          &.btn:before {
            border-color #CE0112;
          }
        }*/
        /*.btns {
          margin-top 8px;
          margin-bottom -8px;
          font-size 12px;
          color #999;
          display flex;
          align-items center;
          .btn {
            padding 8px 0;
            p {
              padding 0 8px;
            }
          }
        }*/
      }
    }
    .btns {
      margin -20px 10px 8px;
      padding 5px 0;
      box-shadow 0 1px 8px #efefef;
      border-radius 6px;
      font-size 12px;
      background-color white;
      display flex;
      align-items center;
      .btn {
        width 33.3%
        padding 8px 0;
        text-align center;
        p {
          line-height 14px;
        }
      }
    }

  }
</style>
