<template>
  <div>
    <nav-top title="我的电子券" @backEvent="backEvent">
      
    </nav-top>
    <nav-content class="coupon-center">
      <coupon v-if='showCoupon' :item='couponDetail'></coupon>
      <div class="rule-warpper" v-if="couponDetail.couDesc">
        <div class="title">使用说明：</div>
        <div class="content" v-html="couponDetail.couDesc"></div>
      </div>
    </nav-content>
    
  </div>
</template>

<script>
  import coupon from './base/coupon.vue'
  import Verify from '@/components/commonui/common-verify/index'
  export default {
    data() {
      return {
        couponDetail: {},
        showCoupon: false
      }
    },
    components:{
      coupon
    },
    created() {
      this.getMyCouInfo()
    },
    methods:{
      getMyCouInfo() {
        if (this.$store.state.globalConfig.couponOpenVerify == '1') {
          Verify.open({
            type: 'coupon_verify',
            sureFunc: this.imgSureFunc,
            vertifyCancelEvent: () => {
              this.goBack()
            },
            paras:{
              phone: this.$store.state.login.phone
            }
          })
        } else {
          this.couponRequest(null, null);
        }
      },
      goBack() {
        this.$router.go(-1)
      },
      imgSureFunc:function(verifyCode,uuid) {
        this.couponRequest(verifyCode,uuid);
        // this.$emit('getSmsEvent',imgVerifyCode,uuid);
      },
      couponRequest(imgVerifyCode,uuid) {
         let paramsData = {
          token: this.$store.state.login.token,
          couNo: this.$route.query.couNo
        }
        if (imgVerifyCode != null && uuid != null) {
          paramsData.type = '20000'
          paramsData.imgVerifyCode = imgVerifyCode
          paramsData.uuid = uuid
        }
        this.$http.post(`/app/json/coupon/getMyCouInfo`, paramsData).then(res => {
          let data = res.data
          if (data.status === 0) {
            this.couponDetail = res.data.data || {}
          } else {
            this.$toast(res.info)
          }
          this.showCoupon = true
        })
      },
      backEvent() {
        this.$router.go(-1)
      }
    }
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
.coupon-center{
  padding: 10px;
}
.rule-warpper {
    margin 10px 0;
    box-shadow: 0 0 9px 0 rgba(197, 197, 197, 0.3);
    border-radius 5px;
    padding 15px;
    .title {
      font-weight: 600
    }
    .content {
      padding 11px 0

      line-height: 20px;
      /deep/ p{
        word-wrap: break-word;
      }
    }
    
  }
</style>