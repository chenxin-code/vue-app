/**Created by liaoyingchao on 2020-05-28.*/

<template>
  <div class="oil-coupon">
    <nav-top @backEvent="backEvent" :bgImg="require('./imgs/top-bg.png')"></nav-top>
    <nav-content>
      <div class="content">
        <div class="bg-img">
          <img src="./imgs/top-bg-1.png">
        </div>
        <div class="oil-coupon-div">
          <div class="icon">
            <img src="./imgs/jyq-icon-2.png">
          </div>
          <div class="title">电子加油券</div>
          <div class="right">
            <div class="amount">¥{{$util.toDecimal2(couponDetail.totalAmount)}}</div>
            <div class="btns">
              <div class="btn" @click="$router.push({path: '/icbc/supportstation'})">
                <p class="line_right">可用油站</p>
              </div>
              <div class="btn" @click="$router.push({path: '/icbc/oilcoupondetail'})">
                <p>明细</p>
              </div>
            </div>
          </div>
        </div>
        <div class="block" v-if="!noDetail">
          <div class="title-row line_bottom">
            <div class="title-icon">
              <img src="./imgs/cou-sm.png">
            </div>
            <div class="title">优惠券说明</div>
            <div class="right-btn" @click="$router.push({path: '/icbc/supportstation'})">
              <span>可用油站</span>
              <i class="iconfont mall-gengduojiantou"></i>
            </div>
          </div>
          <div class="block-content">
            <p>1、本券为一次性优惠券</p>
            <p>2、本券可用的加油站</p>
            <p>3、本券不兑换现金</p>
            <p>4、本券有效期自购买之日起，三个月有效</p>
            <p>5、本券最终解释权归******所有</p>
          </div>
        </div>
        <div class="block">
          <div class="title-row line_bottom">
            <div class="title-icon">
              <img src="./imgs/cou-syfs.png">
            </div>
            <div class="title">使用方式</div>
          </div>
          <div class="block-content">
            <img class="test-img" src="./imgs/tt.png">
          </div>
        </div>
      </div>
    </nav-content>
  </div>
</template>

<script>
  export default {
    name: "oil-coupon",
    components: {},
    data() {
      return {
        couponDetail: {},
        noDetail: false
      }
    },
    methods: {
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
      // getJYCouponDetail: function () {
      //   let url = '/app/json/djljy/router?m=getCouponDetail'
      //   let paramsData = {
      //     userId: this.$store.state.userInfo.userId,
      //     type: '0'
      //   };
      //   this.$Loading.open();
      //   this.$http.post(url, paramsData).then(res => {
      //       this.$Loading.close();
      //       let data = res.data;
      //       if (data.status === 0) {
      //         this.couponDetail = JSON.parse(data.data).walletObj
      //       } else {
      //         this.$Toast(data.info)
      //       }
      //     },
      //     err => {
      //       this.$Loading.close();
      //       this.$Toast("系统运行过程中遇到问题，请稍候再试");
      //     }
      //   )
      // },
      backEvent: function () {
        this.$router.go(-1)
      }
    },
    created() {
      this.noDetail = this.$route.query.noDetail || false
      this.getJYCouponInfo()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .oil-coupon {
    width 100%
    height 100%
    overflow hidden
    .content {
      position relative;
      height 100%;
      background-color #efefef;
      overflow-y auto;
      .bg-img {
        position absolute;
        left 0;
        top -1px;
        right 0;
        z-index 0;
        img {
          width 100%;
        }
      }
      .oil-coupon-div {
        background-color white;
        overflow hidden;
        border-radius 5px;
        position relative;
        z-index 1;
        margin  4px 10px 10px;
        box-shadow 0 1px 8px #efefef;
        padding 10px;
        display flex;
        align-items center;
        .icon {
          padding 0px 12px 0px 4px;
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
          .btns {
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
          }
        }
      }
      .block {
        background-color white;
        margin 10px;
        box-shadow 0 1px 8px #efefef;
        overflow hidden;
        padding 0 10px;
        border-radius 5px;
        .title-row {
          padding 10px 0;
          display flex;
          align-items center;
          .title-icon {
            img {
              display block;
              width 18px;
              height 18px;
            }
          }
          .title {
            font-size 16px;
            margin-left 5px;
            flex 1;
          }
          .right-btn {
            display flex;
            align-items center;
            span, i {
              font-size 12px;
            }
          }
        }
        .block-content {
          padding 10px 0;
          p {
            font-size 12px;
            line-height 16px;
          }
          .test-img {
            margin-top -10px;
            width 100%;
          }
        }
      }
    }
  }
</style>
