<!--
 * @Description: 这是分销-领取优惠券页面
 * @Date: 2021-07-28 15:34:07
 * @Author: shuimei
 * @LastEditTime: 2021-08-03 18:24:37
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
            :src="imgSrc"
          />
        </div>
        <div class="user-name">{{ userInfo.distributorName }}</div>
        <div class="title">送你一张优惠券</div>
        <div class="line"></div>

        <div class="money" v-if="couponDetail.couponType === 40">
          {{ +couponDetail.discountRatio * 10 }}
          <span>折</span>
        </div>
        <!-- {{
            couponDetail.voucherAmount
              ? delPoint(couponDetail.voucherAmount)
              : ""
          }} -->
        <div class="money" v-else>
          <span>￥</span>
          {{ couponDetail.voucherAmount }}
        </div>
        <div class="line line-item"></div>
        <div class="desc">{{ couponType(couponDetail) }}</div>
        <div class="btn">
          <van-button class="van-btn" @click="receiveCoupon" v-if="!isReceive"
            >立即领取</van-button
          >
          <van-button class="van-btn" @click="goToShopping" v-else
            >立即使用</van-button
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Image as VanImage } from "vant";
import { Toast } from "vant";
import { bffHttp } from "@/utils/memberBffHttp.js";
import _ from "lodash";
const imgSrc = require("./img/coupon-default.png");
export default {
  data() {
    return {
      imgSrc: imgSrc,
      shareCode: "", //分销码 lec5bn
      query: this.$route.query,
      memberId: "",
      userInfo: {},
      userSummary: {},
      couponDetail: {},
      couNoList: "", //优惠劵id
      isReceive: false //是否领取
    };
  },
  components: {
    [VanImage.name]: VanImage
  },
  created() {
    this.userSummary = this.$store.state;
    this.memberId = this.userSummary.userInfo.userCode;
    console.log(`this.userSummary`, this.userSummary.userInfo);

    // get_distr_coupon?shareCode=lec5bn&memberId=2331048196588962398&couActivitiesId=2632817580967985166&couTypeCode=10SC000173
    this.shareCode = this.query.shareCode;
    this.toast();
    this.getDisCenterBaseInfo();
    this.getDetail();
  },
  methods: {
    toast() {
      Toast.loading({
        duration: 0,
        type: "loading",
        message: "加载中...",
        forbidClick: true
      });
    },
    //返回首页
    backEvent() {
      this.$router.push({
        path: "/common"
      });
    },
    //获取分销员头像、名称、手机号等信息
    getDisCenterBaseInfo() {
      const host = process.env.VUE_APP_DISTR_APP;
      const url =
        host +
        "/times/distr-service/distributor/api/v1/distr/getDisCenterBaseInfo";
      const obj = {
        shareCode: this.shareCode
      };
      this.$http
        .get(url, { params: obj })
        .then(res => {
          if (res.data.code === 200) {
            this.userInfo = res.data.data;
            this.imgSrc = this.userInfo.headerPic;
            this.$forceUpdate();
          } else {
            this.$toast(res.data.message);
          }
        })
        .catch(err => {
          // this.$toast("请求失败");
        });
    },
    //获取优惠券详情
    getDetail() {
      let centerHost = process.env.VUE_APP_CENTER_APP;
      let url =
        centerHost + "/times/member-bff/coupon/api/v1/coupon/code-detail";
      let obj = {
        couTypeCode: this.query.couTypeCode
      };

      this.$http
        .get(url, { params: obj })
        // bffHttp("GET", url, obj)
        .then(res => {
          console.log(`获取优惠券详情`, res);
          if (res.data.code === 200) {
            this.couponDetail = res.data.data;
            console.log(`couponDetail1`, this.couponDetail);
            console.log(
              `couponDetail.voucherAmount`,
              this.couponDetail.voucherAmount
            );

            // this.$forceUpdate();
          } else {
            this.$toast(res.message);
          }
        })
        .finally(() => {
          Toast.clear(); //关闭页面loading
        });
      // .catch(err => {
      // this.$toast("请求失败");
      // });
    },
    delPoint(num) {
      const regexp = /(?:\.0*|(\.\d+?)0+)$/;
      num = `${num}`;
      return num.replace(regexp, "$1");
    },
    couponType(item) {
      //10:代金券 20：满减券 40：折扣券
      if (item.couponType === 10) {
        return `无门槛立减`;
      } else if (item.couponType === 20 || item.couponType === 40) {
        const num = this.delPoint(item.satisfyAmount);
        return `满${num}元可用`;
      }
    },
    //立即领取
    receiveCoupon: _.debounce(function() {
      this.toast();
      const centerHost = process.env.VUE_APP_CENTER_APP;
      const url =
        centerHost + "/times/member-bff/coupon/api/v1/member-id/receiveCoupon";

      const obj = {
        couActivitiesId: this.query.couActivitiesId,
        memberId: this.memberId
      };
      // bffHttp("POST", url, obj)
      this.$http
        .post(url, JSON.stringify(obj))
        .then(res => {
          if (res.data.code === 200) {
            if (res.data.data.result) {
              this.couNoList = res.data.data.couNoList;
              this.isReceive = true;
              this.save();
              Toast.success({
                duration: 2000,
                type: "success",
                message: "领取成功",
                forbidClick: true
              });
            } else {
              Toast.fail({
                duration: 2000,
                type: "fail",
                message: "库存不足",
                forbidClick: true
              });
              this.isReceive = false;
            }
          } else {
            this.$toast(res.data.message);
            setTimeout(() => {
              Toast.clear(); //关闭页面loading
            }, 500);
          }
        })
        .finally(() => {})
        .catch(err => {});
    }),
    //保存
    save() {
      const host = process.env.VUE_APP_DISTR_APP;
      const api = host + "/times/distr-service/coupon_distr_distributor/save";
      const params = {
        couNoList: this.couNoList, //优惠劵id
        parentShareCode: this.shareCode //分享码
      };
      bffHttp("POST", api, params).then(res => {
        // this.$http.post(api, JSON.stringify(params)).then(res => {
        console.log(`save`, res);
      });
    },
    //立即使用
    goToShopping: _.debounce(function() {
      Toast.loading({
        duration: 0,
        type: "loading",
        message: "正在跳转",
        forbidClick: true
      });
      this.$router.push({
        path: "/common"
      });
      Toast.clear(); //关闭页面loading
    })
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
          border: 2px solid #facb94;
        }
      }
      .user-name {
        font-family: PingFangSC-Regular, PingFang SC;
        min-height: 40px;
      }
      .desc,
      .title {
        font-weight: 600;
        min-height: 40px;
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
        font-size: 38px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: $fontColor;
        line-height: 38px;
        color: #FAC88B;
        // background: linear-gradient(127deg, #FCECD9 0%, #FAC88B 100%);
        // -webkit-background-clip: text;
        // -webkit-text-fill-color: transparent;
        // text-shadow: -3px 0px 1px #fac88b;
        // background-color: #6666667a;
        span {
          font-size: 26px;
        }
      }
      .btn {
        position: absolute;
        bottom: 0
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
