<!--
 * @Description: 这是分销-领取优惠券页面
 * @Date: 2021-07-28 15:34:07
 * @Author: shuimei
 * @LastEditTime: 2021-07-29 09:58:48
-->
<template>
  <div class="get-coupons-page">
    <nav-top title="领取优惠券" @backEvent="backEvent"></nav-top>
    <div class=" container">
      <div class="content">
        <div class="avatar">
          <van-image
            class="avatar-img"
            width="70"
            height="70"
            round
            fit="cover"
            src="https://img01.yzcdn.cn/vant/cat.jpeg"
          />
        </div>
        <div class="user-name">你亲爱的老豆</div>
        <div class="title">送你一张优惠券</div>
        <div class="line"></div>
        <div class="money"><span>￥</span>100元</div>
        <div class="line line-item"></div>
        <div class="desc">部分商品满3399元使用</div>
        <div class="btn">
          <van-button class="van-btn">立即使用</van-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Image as VanImage } from "vant";
export default {
  data() {
    return {
      shareCode: "", //分销码
      query: this.$route.query
    };
  },
  components: {
    [VanImage.name]: VanImage
  },
  created() {
    this.shareCode = this.query.shareCode;
  },
  methods: {
    //返回首页
    backEvent() {
      this.$router.push({
        path: "/common"
      });
    }
  }
};
</script>
<style lang="stylus" scoped type="text/stylus">
$fontColor = #FFFFFF;
.get-coupons-page {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-image: linear-gradient( #CF1E17, #C71B15);
  /deep/.nav-top {
    background-color: #cf1e17;
    .navcontent {
      .title-div {
        font-weight: 400;
      }
    }
    .theme_font_black {
      color: $fontColor;
    }
  }
  .container {
    top: 110px;
    position: absolute;
    width: 100%;
    // height: 100vh;
    background-image: url('./img/bg-1.png');
    background-repeat: no-repeat;
    background-size: 100%;
    height: auto;
    padding-bottom: 165px;
    .content {
      padding: 0 45px;
      text-align: center;
      color $fontColor;
      font-size: 19px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 400;
      line-height: 40px;
      div {
        margin-bottom 16px;
      }
      .avatar {
        text-align: center;
        position: relative;
        margin-top: -16px;
        margin-bottom: 0;
        .avatar-img {
          margin-bottom: 0;
        }
      }
      .user-name {
        font-family: PingFangSC-Regular, PingFang SC;
      }
      .desc,
      .title {
        font-weight: 600;
      }
      .line {
        border-top: 2px dashed #F1F1F1;
        &-item {
          width: calc(100% - 80px);
          position: relative;
          left: 40px;
        }
      }
      .money {
        font-size: 52px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: $fontColor;
        line-height: 73px;
        background: linear-gradient(127deg, #FCECD9 0%, #FAC88B 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      .btn {
        position: absolute;
        bottom: 39px;
        width: 100%;
        left: 0;
        .van-btn {
          border-radius: 28px;
          background: linear-gradient(270deg, #FCECD9 0%, #FAC88B 100%);
          width: 135px;
          /deep/.van-button__text {
            color: #E5165A;
            font-weight: 600;
          }
        }

      }
    }
  }
}
</style>
