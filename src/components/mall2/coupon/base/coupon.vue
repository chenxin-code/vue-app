<template>
  <div class="coupon-container" :style="couponBackgroundStyle" :class="{disabled: disabled}"
       @click="couponProducts(item)">
    <div class="coupon-left" :class="[formatCouType(item.couTypeCategoryAlias)]"
         :style="couponStyle">
      <!--      没有图片展示字段-->
      <template v-if="!(item.couPicReal || item.couPic)">
        <template v-if="item.isHideAmount != 1">
          <!--          满减券-->
          <template v-if="item.couCategory == 20">
            <div class="price-info">
              <span class="unit">￥</span>
              <span class="price">{{item.couFaceValue}}</span>
            </div>
            <div class="msg">满{{item.couThresholdAmount}}元可用</div>
          </template>
          <!--          兑换券-->
          <template v-else-if="item.couCategory == 30 || (item.couTypeCode && item.couTypeCode.indexOf('30') == 0)">
            <div class="price-info">
              <span class="price">兑换券</span>
            </div>
<!--            <div class="msg">满{{item.couThresholdAmount}}元可用</div>-->
          </template>
          <!--          折扣券-->
          <template v-else-if="item.couCategory == 40">
            <div class="price-info" v-if="item.couDiscountValue">
              <span class="price">{{item.couDiscountValue * 1000 / 100}}</span>
              <span class="unit">折</span>
            </div>
            <div class="price-info" v-else>
              <span class="price">折扣券</span>
            </div>
            <div class="msg">满{{item.couThresholdAmount}}元可用</div>
          </template>
          <!--          代金券和其它券-->
          <template v-else>
            <div class="price-info">
              <span class="unit">￥</span>
              <span class="price">{{item.couFaceValue}}</span>
            </div>
          </template>
        </template>
        <template v-else>
          <span>{{item.couTypeTitle}}</span>
        </template>
      </template>
    </div>
    <div class="coupon-right">
      <div class="name double-line" :class="{disabled: disabled}">
        <span class="tip" :class="[formatCouType(item.couTypeCategoryAlias)]"
              :style="styleObject(item.couTypeCategoryAlias)"
              v-if="!disabled && item.couTypeCategoryName">{{item.couTypeCategoryName}}</span>
        <span class="text">{{item.couTypeTitle}}</span>
      </div>
      <div class="time-wrapper" :class="{disabled: disabled}">
        <template v-if="used">
          <p class="name time" v-if="item.checkOuName && item.couTypeCategoryAlias !== 'HY'">使用门店:{{item.checkOuName}}</p>
          <p class='time' style='font-size: 14px; line-height: 30px;' v-if="item.couTypeCategoryAlias == 'HY'">{{item.couNo}}</p>
          <p class="time" v-if="item.usedTime">使用时间:{{item.lockedTime || item.usedTime}}</p>
          <p class="time" v-else-if="item.postState">当前状态:{{item.postState}}</p>
        </template>
        <template v-else>
          <span class="time" v-if="item.validType!=3">有效期:{{setHour(item.validStartDate)}}-{{setHour(item.validEndDate)}}</span>
          <span class="time" v-else>有效期:领取后{{item.validDays}}天有效</span>
        </template>
        <!--1，安徽（扫码充值）展示二维码-->
        <!--2，江西（人工充值） 不展示二维码-->
        <!--3，湖北（线上充值） 跳转到无卡加油-->

        <!--充值券特殊显示-->
        <!--        <span class="btn" :class="[formatCouType(item.couTypeCategoryAlias)]"-->
        <!--              :style="styleObject(item.couTypeCategoryAlias)"-->
        <!--              v-if="!disabled && hasBtn">{{status}}</span>-->
      </div>
      <div class="status" v-if="unCenter">
        <template v-if="item.couTypeCategoryAlias === 'CZ' && (couponQrCodeEnabled == 2)">
          <span v-if="disabled">{{used ?'充值完成，去圈存' : '已过期'}}</span>
          <span v-else>{{item.isActive === 0 ? '需加油激活' : '预计到账时间下月20日'}}</span>
        </template>
        <!--        item.couCount 待确认，布局2 有这个字段，如果去掉，布局1展示按钮，导致页面放不下-->
        <span class="account" v-if="!disabled && (item.couTypeCategoryAlias === 'SC' ||  hasBtn) && item.couCategory != 30">
          <span class="total-count" :style="styleObject(item.couTypeCategoryAlias)"
                :class="[formatCouType(item.couTypeCategoryAlias)]" v-if="couponLayoutType == 2 && user != 5"><span>共{{item.couCount}}张</span> <span>></span> </span>
            <!-- 油品券的逻辑页面显示查看详情 -->
          <span v-else class="btn" :style="styleObject(item.couTypeCategoryAlias)"
                :class="[formatCouType(item.couTypeCategoryAlias)]">{{status}}</span>
        </span>
        <!-- 汽服券 -->
        <span v-if="couDetail && item.couTypeCategoryAlias == 'QF'" class="btn" :style="styleObject(item.couTypeCategoryAlias)" :class="[formatCouType(item.couTypeCategoryAlias)]">{{status}}</span>
      </div>
      <div class="used" v-if="used">
        <img class="used-img" src="../../../../../static/image/coupon/used.png" alt="">
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { Dialog } from 'vant';
import Verify from '@/components/commonui/common-verify/index'
  // couCategory  券类型 10：代金券；20：满减券；30：兑换券；40：折扣券 60 生日券
  // 商城券 bg-color-0 非油券 bg-color-1 洗车券 bg-color-2 充值券 bg-color-3 加油券 bg-color-5 换油券
  //  换油券    HY
  //  加油券		JY
  //  商城券		SC
  //  充值券		CZ
  //  第三方合作券		DSF
  //  便利店		BLD
  const couCategory = {
    'JY': 'bg-color-4',
    'HY': 'bg-color-5',
    'CZ': 'bg-color-3',
    'DSF': 'bg-color-2',
    'BLD': 'bg-color-1',
    'SC': 'bg-color-0'
  }
  // const ategory = {
  //   'JY': {'from': '#000', 'to': '#fff'},
  //   'CZ': {'from': '#000', 'to': '#fff'},
  //   'DSF': {'from': '#000', 'to': '#fff'},
  //   'BLD': {'from': '#000', 'to': '#fff'},
  //   'SC': {'from': '#000', 'to': '#fff'}
  // }
  export default {
    name: '',
    props: {
      disabled: {
        type: Boolean,
        default: false
      },
      used: {
        type: Boolean,
        default: false
      },
      hasBtn: {
        type: Boolean,
        default: true
      },
      item: {
        type: Object,
        default() {
          return {}
        }
      },
      unCenter: { // 如果是领券详情不显示具体状态
        type: Boolean,
        default: true
      },
      index: {
        default: 0
      },
      user: { // 5 coupon-detail 券详情页面
        type: Number,
        default: 0
      },
      couDetail: {
        type: Boolean,
        default: false
      },
      couponLayoutType: [String, Number] // 1 普通布局 2，分组布局
    },
    data() {
      return {
        couponInfo:{}
      }
    },
    computed: {
      couponStyle() {
        let styl = {}
        if ((this.item.couPicReal || this.item.couPic)) {
          styl = {backgroundImage: `url(${this.item.couPicReal || this.item.couPic})`}
        } else {
          styl = this.styleObject()
        }
        return styl
      },
      couponBackgroundStyle() {
        let styl = {}
        if (this.item.couBackgroundReal) {
          styl = {backgroundImage: `url(${this.item.couBackgroundReal})`}
        } else if (this.item.couBackground) {
          styl = {backgroundImage: `url(${this.item.couBackground})`}
        }
        return styl
      },
      status() {
        let str = ''
        if (this.item.isActive === 0) {
          str = '激活'
        } else if (this.used == true) {
          str = '点击查看'
        } else if(this.item.showDetailBtn){
          str = '查看详情'
        } else {
          str = '点击使用'
        }
        return str
      },
      couponQrCodeEnabled() {
        return this.$store.state.globalConfig.couponQrCodeEnabled || 1
      }
    },
    created(){
    },
    methods: {
      selHyCoupon(coupon) {
        this.couponInfo = coupon || {}
        Dialog.confirm({
          title: '提示',
          message: '是否立即使用该服务券',
          cancelButtonText: '否',
          confirmButtonText: '是'
        }).then(() => {
            this.submitHyCoupon(coupon)
        })
      },
      submitHyCoupon(coupon,imgVerifyCode,uuid) {
        let paramsData = {
          token: this.$store.state.login.token,
          couNo: coupon.couNo
        }
        if (imgVerifyCode != null && uuid != null) {
          paramsData.type = '20000'
          paramsData.imgVerifyCode = imgVerifyCode
          paramsData.uuid = uuid
        }
        this.$http.post('/app/json/coupon/getMyCouInfo',paramsData).then(res=>{
          let data = res.data
          if(res.status == 200) {
            if(data.status == 0) {
              let dynamicCode = data.data.dynamicCode
              paramsData.dynamicCode = dynamicCode
              this.couponConfirm(paramsData,coupon)
            } else {
              this.$toast(data.info)
            }
          } else {
            this.$toast(res.info)
          }
        }).catch(err=>{
          this.$toast('系统错误')
        })
      },
      couponConfirm(paramsData,coupon) {
        let obj = {
          couponNo: coupon.couNo,
          dynamicCode: paramsData.dynamicCode,
          couponTypeCode: coupon.couTypeCode,
          couponAmount: coupon.couFaceValue,
          voucherOrganize:coupon.storeOuName,
          couponType:coupon.couTypeTitle,
          voucherOrganizeCode:coupon.storeOuCode,
          voucherTime: coupon.distTime
        }
        this.$http.post('/app/json/change_oil_cou_app/changeOilCouponConfirm',obj).then(res=>{
          let data = res.data
          if(data.status == 0) {
            this.$toast('核销成功')
            this.$emit('golist')
          } else {
            this.$toast(data.info)
          }
        }).catch(err=>{
          this.$toast("系统错误")
        })
      },
      couponProducts(coupon) {
        // 已使用，在是兑换券的时候可以看到详情
        if (this.used && (coupon.couCategory == '30' || (coupon.couTypeCode && coupon.couTypeCode.indexOf('30') == 0))) { //兑换券
          this.$emit('toDetail')
          return ;
        }

        if (this.disabled || !this.unCenter) {
          return
        }
        if (this.item.isActive === 0) {
          this.activeHandle(coupon)
          // this.$toast('待激活')
          return
        }
        // 荣耀会员
        if(coupon.showDetailBtn) {
          this.defaultNavigate(coupon);
          return;
        }
        if (coupon.couTypeCategoryAlias === 'SC') {
          // 如果是分组布局并且是列表页面，则跳转到分组详情，否则无论是列表还是详情，一律跳转至商品列表页面
          if (this.couponLayoutType == 2 && this.user !== 5) {
            this.$router.push({
              path: '/coupon_detail2',
              query: {couTypeCode: coupon.couTypeCode, couFaceValue: coupon.couFaceValue,validEndDate:coupon.validEndDate}
            })
          } else {
            let path = '/mall2/list/' + this.$util.getDataString()
            console.log('---------', this.$util.getDataString())
            if (coupon.canUseListPath) {
              path = coupon.canUseListPath
            }
            this.$router.push({
              path: path,
              query: {
                pageType: 'coupon',
                coupon: coupon.couTypeCode,
                couThresholdAmount: coupon.couThresholdAmount,
                couFaceValue: coupon.couFaceValue,
                lastPath: this.$route.path,
                endTime: this.$util.getDateFromString(coupon.validEndDate)
              }
            })
          }
        } else if (coupon.couTypeCategoryAlias == "QF") {
          if(this.couDetail){
            // 详情页
            let path = '/mall2/list/' + this.$util.getDataString()
            if (coupon.canUseListPath) {
              path = coupon.canUseListPath
            }
            this.$router.push({
              path: path,
              query: {
                pageType: 'coupon',
                coupon: coupon.couTypeCode,
                couThresholdAmount: coupon.couThresholdAmount,
                couFaceValue: coupon.couFaceValue,
                lastPath: this.$route.path,
                endTime: this.$util.getDateFromString(coupon.validEndDate)
              }
            })
          }else if(this.couponLayoutType == 2 && this.user !== 5) {
            // 洗车券为qf，如果配置url跳转url如果没有配置跳转二维码详情 布局为分组并且是列表
            this.$router.push({
              path: '/coupon_detail2',
              query: {couTypeCode: coupon.couTypeCode, couFaceValue: coupon.couFaceValue,validEndDate:coupon.validEndDate}
            })
          } else if (coupon.canUseListPath) {
            let path = coupon.canUseListPath
            this.$router.push({
              path: path,
              query: {
                couTypeCode: coupon.couTypeCode,
                couNo: coupon.couNo
              }
            })
          } else {
            this.defaultNavigate(coupon)
          }
        } else if (coupon.couTypeCategoryAlias === 'CZ' && this.couponQrCodeEnabled == 3) { //充值券并且配置了3 跳转充值页面
          this.$router.push({
            path: '/addCard',
            query: {couNo: coupon.couNo}
          })
        } else if (coupon.couCategory == '30') { //兑换券
          this.$router.push({
            path: '/mall2/couponexchange',
            query: {couNo: coupon.couNo}
          })
        // 在换油券列表点击的时候跳转到券详情，然后在券详情中增加点击使用按钮，最后配置couDetail为true，然后才能核销
        }else if (coupon.couTypeCategoryAlias == 'HY' && this.couDetail) { //换油券
          this.selHyCoupon(coupon)

        } else {
          this.defaultNavigate(coupon)
        }
      },
      defaultNavigate(coupon) {
        // 详情禁止跳转
        if (this.user === 5) {
          return
        }
        // 分组布局
        if (this.couponLayoutType == 2) {
          this.$router.push({
            path: '/coupon_detail2',
            query: {couTypeCode: coupon.couTypeCode, couFaceValue: coupon.couFaceValue,validEndDate:coupon.validEndDate}
          })
        } else {
          let query = {couNo: coupon.couNo,couTypeCategoryAlias: coupon.couTypeCategoryAlias,refuelGsOuCode:JSON.stringify(coupon.couTypeUseConditionModel.refuelGsOuCode),refuelGsOuCodeOp: coupon.couTypeUseConditionModel.refuelGsOuCodeOp};
          this.$router.push({
            path: '/coupon_detail',
            query
          })
        }
      },
      activeHandle(coupon) {
        let paramsData = {
          couNo: coupon.couNo,
          token: this.$store.state.login.token
        }
        return this.$http.post(`/app/json/coupon/activeCouManual`, paramsData).then(res => {
          let data = res.data
          if (data.status == 0) {
            this.$toast('激活成功')
            this.$emit('golist')
          } else {
            this.$toast(data.info || '激活失败！')
          }
        })
      },
      setHour(d) {
        return d ? this.$util.formatDate(new Date(d.toString().replace(/-/g, '/')), 'yyyy.MM.dd') : ''
      },
      formatCouType(type) {
        return type ? couCategory[type] ? couCategory[type] : 'bg-color-1' : 'bg-color-1'
      },
      styleObject() {
        let styleObj = {}
        let couponThemes = this.$store.state.globalConfig.couponThemes
        if (couponThemes) {
          couponThemes = JSON.parse(couponThemes.replace(/&quot;/g, '\"'))
          let type = this.item.couTypeCategoryAlias
          // let  couponThemes = {
          //   "JY": {"from": "#67cfdc", "to": "#44d2ac"},
          //   "CZ": {"from": "#000", "to": "#fff"},
          //   "DSF": {"from": "#000", "to": "#fff"},
          //   "BLD": {"from": "#000", "to": "#fff"},
          //   "SC": {"from": "#ffa2a5", "to": "#ffc7d7"}
          // }
          if (type && couponThemes[type]) {
            styleObj = {
              background: `linear-gradient(145deg, ${couponThemes[type]['from']},${couponThemes[type]['to']})`,
            }
          }
        }
        return styleObj
      }
    },
    components: {}
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  .coupon-container {
    border-radius 4px;
    overflow: hidden
    box-shadow: 0 0 9px 0 rgba(197, 197, 197, 0.3);
    background-size 100% 100%;
    background-repeat: no-repeat
    background-color: #fff;
    display flex
    height 100px;

    .coupon-left {
      width 120px
      text-align: center
      padding 14px 5px;
      color: #fff;
      display flex
      justify-content center
      align-items center
      flex-direction column
      background-size: 100% 100% !important
      background-repeat: no-repeat !important

      .price-info {
        flex-shrink 0

        .unit {
          font-size: 14px;
        }

        .price {
          font-size: 28px;
          font-weight: 600
          margin-left: -4px;
        }
      }

      .msg {
        flex-shrink 0
        font-size: 12px;
        padding-top: 6px;
        line-height: 14px;
      }

      &.bg-color-1 {
        background: linear-gradient(145deg, #67cfdc, #44d2ac)
      }

      &.bg-color-2 {
        background: linear-gradient(145deg, #ffb705, #ff850b)
      }

      &.bg-color-3 {
        background: linear-gradient(145deg, #ff916e, #ef5e5a)
      }

      &.bg-color-4 {
        background: linear-gradient(145deg, #e59b88, #ac7061)
      }
      &.bg-color-5 {
        background: linear-gradient(145deg,  #725ce0 ,#84bcd2 )
      }
      &.bg-color-0 {
        background: linear-gradient(145deg, #5c9de1, #687add)
      }
    }

    .coupon-right {
      padding 3px 8px 8px 8px
      padding-right: 18px;
      flex 1
      font-size: 14px;
      position: relative
      overflow: hidden
      min-height: 100%;
      display flex
      flex-direction column
      justify-content space-between

      .name {
        padding-top: 5px

        .tip {
          padding: 2px 6px;
          border-radius 8px;
          color: #fff;
          font-size: 12px;
          margin-right: 4px;

          &.bg-color-1 {
            background: linear-gradient(90deg, #67cfdc, #44d2ac)
          }

          &.bg-color-2 {
            background: linear-gradient(90deg, #ffb705, #ff850b)
          }

          &.bg-color-3 {
            background: linear-gradient(90deg, #ff916e, #ef5e5a)
          }

          &.bg-color-4 {
            background: linear-gradient(90deg, #e59b88, #ac7061)
          }
          &.bg-color-5 {
            background: linear-gradient(145deg,  #725ce0 ,#84bcd2 )
          }
          &.bg-color-0 {
            background: linear-gradient(90deg, #5c9de1, #687add)
          }
        }

        &.disabled {
          padding-right: 40px;
        }

        .text {
          vertical-align middle
          line-height 20px
        }
      }

      .time-wrapper {
        padding-top: 6px;
        /*display: flex*/
        /*justify-content space-between*/
        /*align-items center*/

        .name {
          padding-right: 36px;
          line-height: 16px
        }

        .time {
          font-size: 12px;
          color: #999

          & + .time {
            padding-top: 5px;
          }
        }
      }

      .used {
        position: absolute
        right: 10px;
        top: 50%;
        transform translateY(-50%)

        .used-img {
          width 50px;
        }
      }
    }

    &.disabled {
      .coupon-left {
        background: #999
      }
    }

    .status {
      font-size: 10px;
      color: #999
      padding-top: 8px;
      display flex
      justify-content space-between

      .account {
        padding-right 10px;

        .total-count {
          color: #fff;
          padding 2px 4px;
          font-size: 14px;
          border-radius 8px;
          font-weight: 600
          /*display flex*/
          /*align-items center*/
          background: linear-gradient(90deg, #67cfdc, #44d2ac)

          &.bg-color-1 {
            background: linear-gradient(90deg, #67cfdc, #44d2ac)
          }

          &.bg-color-2 {
            background: linear-gradient(90deg, #ffb705, #ff850b)
          }

          &.bg-color-3 {
            background: linear-gradient(90deg, #ff916e, #ef5e5a)
          }

          &.bg-color-4 {
            background: linear-gradient(90deg, #e59b88, #ac7061)
          }
          &.bg-color-5 {
            background: linear-gradient(145deg,  #725ce0 ,#84bcd2 )
          }
          &.bg-color-0 {
            background: linear-gradient(90deg, #5c9de1, #687add)
          }
        }
      }

      .btn {
        padding: 1px 4px;
        border-radius 20px;
        color: #fff;
        font-size: 14px;

        &.bg-color-1 {
          background: linear-gradient(90deg, #67cfdc, #44d2ac)
        }

        &.bg-color-2 {
          background: linear-gradient(90deg, #ffb705, #ff850b)
        }

        &.bg-color-3 {
          background: linear-gradient(90deg, #ff916e, #ef5e5a)
        }

        &.bg-color-4 {
          background: linear-gradient(90deg, #e59b88, #ac7061)
        }
        &.bg-color-5 {
          background: linear-gradient(145deg,  #725ce0 ,#84bcd2 )
        }
        &.bg-color-0 {
          background: linear-gradient(90deg, #5c9de1, #687add)
        }
      }
    }
  }
</style>
