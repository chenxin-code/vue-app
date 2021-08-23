<!--
 * @Description: 这是分销-领取优惠券页面
 * @Date: 2021-07-28 15:34:07
 * @Author: shuimei
 * @LastEditTime: 2021-08-20 11:01:44
-->
<template>
  <div class="get-coupons-page">
    <nav-top title="领取优惠券" @backEvent="backEvent"></nav-top>
    <div class="container">
      <img :src="require('./img/bg4.png')" style="width: 100%;" ref="bg4" />
      <div class="content">
        <div class="avatar" ref="avatar">
          <van-image
            class="avatar-img"
            width="70"
            height="70"
            round
            fit="cover"
            :src="imgSrc"
          />
        </div>
        <div class="user-name" ref="username">{{ userInfo.distributorName }}</div>
        <div class="money" v-if="couponDetail.couponType === 40">
          {{ +couponDetail.discountRatio * 10 }}
          <span>折</span>
        </div>
        <div class="money" v-else>
          <span>￥</span>
          {{ couponDetail.voucherAmount }}
        </div>
        <div class="desc">{{ '·' + couponType(couponDetail) + '·' }}</div>
        <!--<div class="btn">
          <van-button class="van-btn" @click="receiveCoupon" v-if="!isReceive"
          >立即领取</van-button
          >
          <van-button class="van-btn" @click="goToShopping(couponDetail)" v-else
          >立即使用</van-button
          >
        </div>-->
        <img :src="require('./img/get.png')" class="img-btn" @click="receiveCoupon" v-if="!isReceive" />
        <img :src="require('./img/use.png')" class="img-btn" @click="goToShopping(couponDetail)" v-else />
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
      couponDetail: {},
      couNoList: "", //优惠劵id
      isReceive: false, //是否领取
      skuIds: ""
    };
  },
  components: {
    [VanImage.name]: VanImage
  },
  created() {
    this.memberId = this.$store.state.userInfo.userCode;
    // get_distr_coupon?shareCode=lec5bn&memberId=2331048196588962398&couActivitiesId=2632817580967985166&couTypeCode=10SC000173
    this.shareCode = this.query.shareCode;
    this.toast();
    this.getDisCenterBaseInfo();
    this.getDetail();
    window.onresize = () => {
      return (() => {
        this.setPosition();
      })()
    }

  },
  methods: {
    setPosition(){
      this.$nextTick(() => {
        this.$refs['avatar'].style.top = this.$refs['bg4'].offsetHeight * 0.63 + 'px';
        this.$refs['username'].style.top = this.$refs['bg4'].offsetHeight * 0.72 + 'px';
      })
    },
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
          this.setPosition();
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
        .then(res => {
          if (res.data.code === 200) {
            this.couponDetail = res.data.data;
            console.log(`couponDetail1`, this.couponDetail);
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
      if (!this.memberId) {
        this.$http
          .post("/app/json/user/getUserSummary", {
            deliveryType: "2",
            orderCategory: "0"
          })
          .then(res => {
            let data = res.data;
            if (data.status == 0) {
              let d = data.data;
              this.memberId = d.userInfo.userCode;
            }
          })
          .finally(() => {
            this.receiveFn();
          });
      } else {
        this.receiveFn();
      }
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
        console.log(`save`, res);
      });
    },
    //立即使用
    goToShopping: _.debounce(function(data) {
      Toast.loading({
        duration: 0,
        type: "loading",
        message: "正在跳转",
        forbidClick: true
      });
      // 跳转到商城搜索商品列表
      let path = "/mall2/list/" + this.$util.getDataString();
      this.$router.push({
        path: path,
        query: {
          skuIds: this.skuIds,
          searchFrom: "coupon"
        }
      });
      Toast.clear(); //关闭页面loading
    }),
    getUserSummary: function() {
      this.$http
        .post("/app/json/user/getUserSummary", {
          deliveryType: "2",
          orderCategory: "0"
        })
        .then(res => {
          let data = res.data;
          if (data.status == 0) {
            let d = data.data;
            this.memberId = d.userInfo.userCode;
          }
        });
    },
    receiveFn() {
      this.toast();
      const centerHost = process.env.VUE_APP_CENTER_APP;
      const url =
        centerHost + "/times/member-bff/coupon/api/v1/member-id/receiveCoupon";

      const obj = {
        couActivitiesId: this.query.couActivitiesId,
        memberId: this.memberId
      };
      this.$http
        .post(url, JSON.stringify(obj))
        .then(res => {
          if (res.data.code === 200) {
            if (res.data.data.result) {
              this.couNoList = res.data.data.couNoList;
              this.skuIds = res.data.data.merchanDises;
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
    }
  }
};
</script>
<style lang="stylus" scoped type="text/stylus">
$fontColor = #FFFFFF;
.get-coupons-page {
  position: relative;
  width: 100%;
  height: auto;
  overflow: auto;
  background-image: url('./img/bg3.png');
  background-repeat: no-repeat;
  background-size:100% 100%;
  /deep/.nav-top {
    background-color: #ffffff;
    .navcontent {
      .title-div {
        font-weight: 400;
      }
    }
    .theme_font_black {
      color: #000000;
    }
  }
  .container {
    top: 15%;
    left 50%
    transform translateX(-50%)
    position: absolute;
    width: 90%;
    //background-image: url('./img/bg4.png');
    //background-repeat: no-repeat;
    //background-size: 100% auto;
    padding-bottom: 80px;
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
        position absolute
        left 50%
        transform translateX(-50%)
        text-align: center;
        margin-top: -16px;
        margin-bottom: 0;
        .avatar-img {
          margin-bottom: 0;
          border: 2px solid #facb94;
        }
      }
      .user-name {
        position absolute
        left 50%
        transform translateX(-50%)
        font-family: PingFangSC-Regular, PingFang SC;
        min-height: 40px;
        font-size 14px
      }
      .desc {
        position absolute
        top 25%
        left 50%
        font-size 12px
        transform translateX(-50%)
        font-weight: 600;
        color #FF393E
        //min-height: 40px;
        border 1px solid #FF393E
        border-radius 8px
        padding 4px 5px
        line-height 1
        margin-top 35px
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
        position absolute
        top 12%
        left 50%
        transform translateX(-50%)
        font-size: 44px;
        font-family: PingFang-SC-Heavy;
        font-weight: 700;
        line-height: 55px;
        color: #FF393E;
        margin-top 45px
        // background: linear-gradient(127deg, #FCECD9 0%, #FAC88B 100%);
        // -webkit-background-clip: text;
        // -webkit-text-fill-color: transparent;
        // text-shadow: -3px 0px 1px #fac88b;
        // background-color: #6666667a;
        span {
          font-size: 30px;
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
            font-size 17px
            color: #E5165A;
            font-weight: 700;
          }
        }
      }
      .img-btn {
        width: 165px;
      }
    }
  }
}
</style>
