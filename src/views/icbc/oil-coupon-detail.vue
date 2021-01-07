/**Created by liaoyingchao on 2020-05-28.*/

<template>
  <div class="oil-coupon-detail">
    <nav-top @backEvent="backEvent" :bgImg="require('./imgs/top-bg.png')"></nav-top>
    <nav-content>
      <div class="content">
        <div class="tabs">
          <div class="tab" :class="{selected: tabIndex == 1}" @click="tabIndex = 1">
            未使用
          </div>
          <div class="tab" :class="{selected: tabIndex == 2}" @click="tabIndex = 2">
            已使用
          </div>
          <div class="tab" :class="{selected: tabIndex == 3}" @click="tabIndex = 3">
            已过期
          </div>
        </div>
        <div class="list" v-if="showCoupons.length > 0">
          <div class="coupon" :class="{coupon1: tabIndex == 2 || tabIndex == 3}" v-for="item in showCoupons">
            <div class="mianer">
              <p class="big">加油券</p>
            </div>
            <div class="cou-info">
              <div class="cou-title double-line">{{item.couponName}}</div>
              <div class="cou-time">有效期至：{{item.endDate}}</div>
            </div>
            <div class="right" v-if="tabIndex == 2">
              <img src="./imgs/ygq.png">
            </div>
            <div class="right" v-else-if="tabIndex == 3">
              <img src="./imgs/ysy.png">
            </div>
            <div class="right" v-else>
              <div class="btn" @click="$router.push({path: '/icbc/oilcoupon', query: {noDetail: true}})">立即使用</div>
            </div>
          </div>
        </div>
        <div class="no-data" v-else-if="loaded">没有相关数据</div>
      </div>
    </nav-content>
  </div>
</template>

<script>
  export default {
    name: "oil-coupon-detail",
    components: {},
    data() {
      return {
        loaded: false,
        tabIndex: 1,
        coupons: []
      }
    },
    computed: {
      showCoupons() {
        if (this.tabIndex == 1) {
          let arr = []
          for (let i = 0; i < this.coupons.length; i++) {
            if (this.coupons[i].end == 0) {
              arr.push(this.coupons[i])
            }
          }
          return  arr
        } else if (this.tabIndex == 3) {
          let arr = []
          for (let i = 0; i < this.coupons.length; i++) {
            if (this.coupons[i].end == 1) {
              arr.push(this.coupons[i])
            }
          }
          return  arr
        } else {
          return  []
        }
      }
    },
    methods: {
      getJYCouponDetail: function () {
        let url = '/app/json/djljy/router?m=getCouponDetail'
        let paramsData = {
          userId: this.$store.state.userInfo.userId,
          type: '0'
        };
        this.$Loading.open();
        this.$http.post(url, paramsData).then(res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status === 0) {
              this.loaded = true
              this.coupons = JSON.parse(data.data).coupons || []
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
      backEvent: function () {
        this.$router.go(-1)
      }
    },
    created() {
      this.getJYCouponDetail()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .oil-coupon-detail {
    width 100%
    height 100%
    overflow hidden
    .content {
      width 100%
      height 100%
      background-color #efefef;
      overflow hidden
      position relative;
      .tabs {
        display flex;
        align-items flex-start;
        justify-content space-around;
        .tab {
          font-size 16px;
          font-weight 500;
          padding 10px;
        }
        .selected {
          position relative;
          color #CE0112;
          &.selected:before {
            content: " ";
            position absolute;
            left 50%;
            bottom 0;
            margin-left -10px;
            width 20px;
            height 3px;
            border-radius 2px;
            background-color #CE0112;
          }
        }
      }
      .list {
        position absolute;
        left 0;
        right 0;
        bottom 0;
        top 36px;
        overflow-y auto;
        -webkit-overflow-scrolling touch;
        .coupon {
          background url("./imgs/jyq-bg.png") repeat center center / 100% 100%;
          display flex;
          align-items center;
          margin 8px 10px;
          position relative;
          z-index 2;
          &.coupon1 {
            background url("./imgs/jyq-bg1.png") repeat center center / 100% 100%;
          }
          .mianer {
            text-align center;
            width 88px;
            font-size 0;
            color white;
            .big {
              font-size 18px;
            }
          }
          .cou-info {
            flex 1;
            padding 10px;
            .cou-title {
              font-size 12px;
              line-height 14px;
              height 28px;
            }
            .cou-time {
              margin-top 20px;
              color #999;
              font-size 12px;
            }
          }
          .right {
            text-align center;
            color #CE0112;
            padding 8px;
            .btn {
              padding 6px 10px;
              font-size 14px;
              color white;
              border-radius 15px;
              background-color #CE0112;
            }
            img {
              width 60px;
              height 60px;
            }
          }
        }
      }
      .no-data {
        padding 20px;
        font-size 14px;
        color #999;
        text-align center;
      }
    }
  }
</style>
