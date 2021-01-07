<template>
  <div>
    <nav-top title="我的电子券" @backEvent="goBack"></nav-top>
    <nav-content class="coupon-detail-container" v-if="$util.objectKeys(couponDetail).length">
      <div class="coupon-content">
        <!-- hasBtn如果是换油券有点击使用功能 -->
        <coupon @golist='golist' @load="getMyCouInfo" :couponLayoutType="isGroupCoupon ? 2 : 1" :user="5" :hasBtn="hasBtn" :couDetail='true'  :item="couponDetail"></coupon>
      </div>
      <!-- showDetailBtn参数是专属荣耀会员券详情逻辑，如果是荣耀会员券详情，直接展示else逻辑图片 -->
      <div v-if="couponDetail.couTypeCategoryAlias === 'YJBLD'">
        <div class="rule-warpper">
          <div class="title">使用方式：</div>
          <div class="content">
            <img src='./images/rule-yjq.png' width='100%'/>
          </div>
        </div>
      </div>
      <div v-else-if='!this.couponDetail.showDetailBtn'>
        <!--等于0是待激活  充值券不显示二维码-->
          <!--商城券不显示二维码-->
          <!--couponQrCodeEnabled全局配置项，1 为展示二维码（充值券默认是隐藏）-->
          <div class="qr-code-wrapper" v-if="showQrcode && couponDetail.couTypeCategoryAlias != 'HY'">
            <canvas class="qr-code" id="qrcode"></canvas>
            <p class="qr-code-text top-fu10">{{ couponDetail.dynamicCode }}</p>
            
            <div class="special refresh-wrapper"> 
              <span class="refresh-text">
                {{isRefresh ? '自动刷新': '已刷新'}}
              </span>
              <span class="refresh-text" @click="getMyCouInfo">
                <i class="iconfont mall-shuaxin"></i>
                手动刷新
              </span>
            </div>
            <!--海信券等于20展示 编码-->
            <div class="qr-code-text electronic-coupon" v-if="couponDetail.couOriginType == 20 || couponDetail.couOriginType == 40">
              <span>电子券编码：{{ couponDetail.couNo }}</span>
              <div class="copy-btn" ref="copybtn" :data-clipboard-text="couponDetail.couNo" @click="copyCouNo">复制</div>
            </div>
          </div>
          <!--分组的时候显示-->
          <div class="page-container" v-if="isGroupCoupon && totalRecords > 1">
            <button class="l-btn" :disabled="ind === 0" :class="{disabled: ind === 0}" @click="pre">上一张</button>
            <span>{{ind + 1}}/{{totalRecords}}</span>
            <button class="l-btn" :disabled="!hasMore && ((this.couponList.length - 1) === ind)"  :class="{disabled: !hasMore && ((this.couponList.length - 1) === ind)}" @click="next">下一张</button>
          </div>
          <div class="danger-btn" v-if="$route.query.couTypeCategoryAlias == 'JY'">
            <van-button class='btn' type="danger" @click="toGasStation">查看附近油站</van-button>
          </div>
          <div class="rule-warpper" v-if="couponDetail.couDesc">
            <div class="title">使用说明：</div>
            <div class="content" v-html="couponDetail.couDesc"></div>
          </div>
      </div>
      <!-- 荣耀会员展示图片 -->
      <div v-else>
        <div class="rule-warpper">
          <div class="title">使用方式：</div>
          <div class="content">
            <img src='./images/rule.png' width='100%'/>
          </div>
        </div>
      </div>
      
    </nav-content>
  </div>
</template>

<script type="text/ecmascript-6">
  import QRCode from 'qrcode'
  import Coupon from './base/coupon.vue'
  import Verify from '@/components/commonui/common-verify/index'
  import ClipboardJS from 'clipboard';
  import { Dialog } from 'vant';
  export default {
    name: '',
    data () {
      return {
        couponDetail: {},
        specialCodeList: [20],
        couponList: [],
        ind: 0,
        page: 0,
        rows: 10,
        hasMore: true,
        isRefresh: false, // 海信券自动刷新功能
        timer: null,
        timer2: null,
        totalRecords: 0,
        isGroupCoupon: false
      }
    },
    mounted() {
      if (this.$store.state.webtype == 1) {
        this.$bridgefunc.brightness(1, 0, (result) => {
          console.log('打开亮度', result)
          this.brightnessResult = result
        })
      }
    },
    computed: {
      /**
       * <!--等于0是待激活  充值券不显示二维码-->
       *<!--商城券不显示二维码-->
       *<!--couponQrCodeEnabled全局配置项，1 为展示二维码（充值券默认是隐藏）-->
       *<!--1，安徽（扫码充值）展示二维码-->
       *<!--2，江西（人工充值） 不展示二维码-->
       *<!--3，湖北（线上充值） 跳转到无卡加油-->
       */
      showQrcode() {
        let f = true
        if (this.couponDetail.isActive !== 0) { // 已激活
          if (this.couponDetail.couTypeCategoryAlias === 'SC') { // 商城券不展示
            f = false
          }
          if (this.couponDetail.couTypeCategoryAlias === 'CZ') { // 默认隐藏
            f = false
            if (this.couponQrCodeEnabled == 1) { // 1 开启
              f = true
            }
          }
        } else { // 未激活不展示
          f = false
        }
        return f
      },
      hasBtn() {
        // 点击使用按钮只有换油券并且是非荣耀会员类型时展示
          let boo = false;
          if(this.couponDetail.couTypeCategoryAlias == 'HY' && !this.couponDetail.showDetailBtn) {
            boo = true;
          }
          return boo
      },
      couponQrCodeEnabled() {
        return this.$store.state.globalConfig.couponQrCodeEnabled || 1
      }
    },
    beforeRouteLeave(to,from,next) {
      this.clearInt()
      next()
    },
    methods: {
      pageInit() {
        if (this.isGroupCoupon) {
          this.getUnusedCouponsWithCols()
        } else {
          
          this.getMyCouInfo()
        }
      },
      golist() {
        this.$router.go(-1)
      },
      toGasStation() {
        let {refuelGsOuCode,refuelGsOuCodeOp} = this.$route.query;
        this.$router.push({
            path: '/stationto',
            query: {stationType:'coupon',RefuelGsOuCode: refuelGsOuCode, RefuelGsOuCodeOp:refuelGsOuCodeOp}
          })
      },
      goBack() {
        this.$router.go(-1)
      },
      copyCouNo() {
        this.copyBtn.on('success', (e) => {
          this.$Toast('复制成功');
        });
        this.copyBtn.on('error', function(e) {
          console.log(e);
        });
      },
      getUnusedCouponsWithCols() {
        this.page++
        this.$Loading.open();
        let params = {
          page: this.page,
          rows: this.rows,
          token: this.$store.state.login.token,
          couTypeCode: this.$route.query.couTypeCode,
          couFaceValue: this.$route.query.couFaceValue
          // validEndDate: this.$route.query.validEndDate
        }
        this.$http.post(`/app/json/coupon/getUnusedCouponsWithCols`, params).then(res => {
          let data = res.data
          if (data.status == 0) {
            this.couponList = this.couponList.concat(data.data || [])
          }
          this.totalRecords = data.totalRecords || 0
          if (this.couponList.length === data.totalRecords) {
            this.hasMore = false
          }
          this.getMyCouInfo()
          this.$Loading.close()
        })
      },
      getMyCouInfo() {
        this.clearInt()
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
      imgSureFunc:function(verifyCode,uuid) {
        this.couponRequest(verifyCode,uuid);
        // this.$emit('getSmsEvent',imgVerifyCode,uuid);
      },
      couponRequest: function (imgVerifyCode, uuid) {
        this.$Loading.open();
        this.isRefresh = false;
        let couNo = this.isGroupCoupon ? this.couponList[this.ind].couNo : this.$route.query.couNo
        let paramsData = {
          token: this.$store.state.login.token,
          couNo: couNo
        }
        if (imgVerifyCode != null && uuid != null) {
          paramsData.type = '20000'
          paramsData.imgVerifyCode = imgVerifyCode
          paramsData.uuid = uuid
        }
        this.$http.post(`/app/json/coupon/getMyCouInfo`, paramsData).then(res => {
          this.$Loading.close()
          let data = res.data
          if (data.status == 0) {
            this.couponDetail = data.data || {}
            // 开启自动更新二维码功能条件-1、必须展示二维码，2不是换油券、3、不是荣耀会员（showDetailBtn用来为true表示是荣耀会员） 4、不是易捷券
            if(this.showQrcode && this.couponDetail.couTypeCategoryAlias !== 'HY' && !this.couponDetail.showDetailBtn && this.couponDetail.couTypeCategoryAlias !== 'YJBLD') {
              this.refreshCode()
            }
            this.$nextTick(() => {
              QRCode.toCanvas(document.getElementById('qrcode'), this.couponDetail.dynamicCode || '', {width: 240})
              if(this.$refs.copybtn){
                this.copyBtn = new ClipboardJS(this.$refs.copybtn);
              }
            })
          } else {
            if (this.$store.state.globalConfig.couponOpenVerify == '1') {
              this.$Toast("验证码验证失败，请重试！")
              this.getMyCouInfo()
            }
          }
        })
      },
      clearInt() {
        clearInterval(this.timer)
        clearInterval(this.timer2)
      },
      refreshCode() {
        clearInterval(this.timer)
        this.timer = setTimeout(()=>{
          // 将文本变为自动刷新
          this.isRefresh = true;
          this.Interval()
        },3000)
      },
      Interval() {
        clearInterval(this.timer2)
        this.timer2 = setTimeout(()=>{
          // 将文本变为已刷新
          Dialog.alert({
            title: '提示',
            message: '当前二维码已失效，请刷新后展示！',
          }).then(() => {
            this.getMyCouInfo()
          });
          
        },60000)
      },
      pre() {
        this.ind--
        this.getMyCouInfo()
      },
      next() {
        this.ind++
        if (this.hasMore && (this.couponList.length - this.ind) === 2) { // 倒数第二张的时候加载列表
          this.getUnusedCouponsWithCols()
        } else {
          this.getMyCouInfo()
        }
      }
    },
    components: {Coupon},
    beforeDestroy() {
      this.clearInt()
    },
    destroyed() {
      this.clearInt()
      console.log('缓存的亮度', this.brightnessResult)
      if (this.brightnessResult) {
        this.$bridgefunc.brightness(this.brightnessResult.value, this.brightnessResult.isauto, (result) => {
          console.log('关闭亮度', result)
        })
      }
    },
    watch: {
      '$route': {
        handler: function (to, from) {
          if (to.path === '/coupon_detail2' || to.path === '/coupon_detail') {
            this.isGroupCoupon = to.path === '/coupon_detail2'
            this.pageInit()
          }
        },
        immediate: true
      },
    },
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  @import "~@/common/stylus/variable.styl"
  .coupon-detail-container {
    overflow-y: auto !important
    -webkit-overflow-scrolling touch
  }

  .coupon-content {
    padding 0 10px
    margin-top: 5px;
  }
  .danger-btn{
    text-align: center;
    padding: 5px 0;
    .btn{
      width: 90%;
      border-radius: 4px;
    }
  }
  .qr-code-wrapper {
    text-align: center
    margin 10px;
    box-shadow: 0 0 9px 0 rgba(197, 197, 197, 0.3);
    border-radius 5px;
    .qr-code-text{
      word-break break-all
      padding 11px
      line-height 14px
      text-align: center
      padding-top:0
    }
    .electronic-coupon{
      display flex
      align-items center
      justify-content center
      .copy-btn{
        margin-left: 10px;
        padding 3px 6px
        font-size 12px;
        border:1px solid #999;
        border-radius 4px
        color #999
      }
    }
    .top-fu10 {
      margin-top -10px;
      position relative;
      z-index 10;
    }
    .special {
      display: flex;
      justify-content: center;
      span{
        padding: 0 20px;
        margin: 0 20px;
      }
    }
  }

  .refresh-wrapper {
    padding-bottom: 15px;
    padding-top: 15px;
    color: #999;
    .iconfont {
      font-size: 12px;
      vertical-align: middle;
      position: relative;
      top: -2px;
    }
    .refresh-text {
      padding-left: 10px;
      font-size: 16px;
      vertical-align: middle
    }
  }

  .rule-warpper {
    margin 10px;
    box-shadow: 0 0 9px 0 rgba(197, 197, 197, 0.3);
    border-radius 5px;
    padding 15px;
    .title {
      font-weight: 600
    }
    .content {
      padding 11px 0
      line-height: 20px;
    }
  }
  .page-container{
    display flex
    justify-content space-around
    align-items center
    padding-top: 20px;
    .l-btn{
      border: 1px solid #ff4444
      display inline-block
      padding 5px 15px
      border-radius 30px;
      text-align: center
      color #ff4444
      &.disabled{
        border: 1px solid #999
        color #999
      }
    }
  }
</style>
