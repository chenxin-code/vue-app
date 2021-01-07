<template>
  <div>
    <nav-top title="易捷优惠券" @backEvent="goBack" :bgImg="require('./imgs/top-bg.png')"></nav-top>
    <nav-content class="coupon-detail-container" v-if="$util.objectKeys(couponDetail).length">
      <div class="coupon-content">
        <div class="coupon">
          <div class="mianer">
            <p class="big"></p>
          </div>
          <div class="cou-info">
            <div class="cou-title double-line">{{couponDetail.couTypeTitle}}</div>
            <div class="cou-time" v-if="couponDetail.validType!=3">有效期:{{setHour(couponDetail.validStartDate)}}-{{setHour(couponDetail.validEndDate)}}</div>
            <div class="cou-time" v-else>有效期:领取后{{couponDetail.validDays}}天有效</div>
          </div>
        </div>
        <div class="block">
          <div class="title-row line_bottom">
            <div class="title-icon">
              <img src="./imgs/cou-sm.png">
            </div>
            <div class="title">优惠券说明</div>
          </div>
          <div class="block-content">
            <div v-html="couponDetail.couDesc"></div>
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
            <img class="test-img" src="./imgs/jyq-sygz.png">
          </div>
        </div>
      </div>
    </nav-content>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: '',
    data () {
      return {
        couponDetail: {},
      }
    },
    methods: {
      setHour(d) {
        return d ? this.$util.formatDate(new Date(d.toString().replace(/-/g, '/')), 'yyyy.MM.dd') : ''
      },
      goBack() {
        this.$router.go(-1)
      },
      couponRequest: function () {
        this.$Loading.open();
        let paramsData = {
          token: this.$store.state.login.token,
          couNo: this.$route.query.couNo
        }
        this.$http.post(`/app/json/coupon/getMyCouInfo`, paramsData).then(res => {
          this.$Loading.close()
          let data = res.data
          if (data.status == 0) this.couponDetail = data.data || {}
        })
      },
    },
    created(){
      this.couponRequest()
    },
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  @import "~@/common/stylus/variable.styl"
  .coupon-detail-container {
    overflow-y: auto !important
    -webkit-overflow-scrolling touch
    background-color:#efefef;
    .coupon-content {
      padding-top:8px;
      position relative;
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
      .coupon {
        position relative;
        z-index 2;
        background url("./imgs/yjyhq-bg.png") repeat center center / 100% 100%;
        display flex;
        align-items center;
        height:80px;
        margin:0 12.5px 0;
        padding-right 10px
        &.oil-coupon{
          background-image:url("./imgs/oil-bg.png");
        }
        .mianer {
          height:100%;
          width 90px;
          .big {
            font-size 18px;
          }
        }
        .cou-info {
          flex 1;
          padding-left:10px;
          .cou-title {
            font-size 12px;
          }
          .cou-time {
            margin-top 26px;
            color #999;
            font-size 12px;
          }
        }
        .right {
          text-align center;
          color #ff3c55;
          .btn {
            display:flex;
            align-items:center;
            justify-content:center;
            width 70px
            height 24px
            font-size 12px;
            color white;
            border-radius 15px;
            background-color #ff3c55;
          }
          img {
            width 60px;
            height 60px;
          }
        }
        +.coupon{
          margin-top:10px;
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
</style>
