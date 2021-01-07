<template>
  <div class="coupon-container"  :style="couponBackgroundStyle" :class="{disabled: disabled,actived: qfCoupon, useicon: curType == 'getUsedCoupons', expicon: curType == 'getExpiredCoupons'}"
       @click="couponProducts(item)">
    <div class="coupon-left" :class="[formatCouType(item.couTypeCategoryAlias),{disabled: disabled}]"
         :style="couponStyle">
      <!--      没有图片展示字段-->
      <template v-if="!(item.couPicReal || item.couPic)">
        <template v-if="item.isHideAmount != 1">
          <!--  满减券-->
          <template v-if="item.couCategory == 20">
            <div class="price-info">
              <span class="unit">￥</span>
              <span class="price">{{item.couFaceValue}}</span>
            </div>
            <div class="msg">满{{item.couThresholdAmount}}元可用</div>
            <div>
              <span class="tip" :class="[formatCouType(item.couTypeCategoryAlias)]"
              :style="styleObject(item.couTypeCategoryAlias)"
              v-if="item.couTypeCategoryName">{{item.couTypeCategoryName}}</span>
            </div>
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
            <div>
              <span class="tip" :class="[formatCouType(item.couTypeCategoryAlias)]"
              :style="styleObject(item.couTypeCategoryAlias)"
              v-if="item.couTypeCategoryName">{{item.couTypeCategoryName}}</span>
            </div>
          </template>
          <!--          代金券和其它券-->
          <template v-else>
            <div class="price-info">
              <span class="unit">￥</span>
              <span class="price">{{item.couFaceValue}}</span>
            </div>
            <div>
              <span class="tip" :class="[formatCouType(item.couTypeCategoryAlias)]"
              :style="styleObject(item.couTypeCategoryAlias)"
              v-if="item.couTypeCategoryName">{{item.couTypeCategoryName}}</span>
            </div>
          </template>
        </template>
        <template v-else>
          <span>{{item.couTypeTitle}}</span>
        </template>
      </template>
    </div>
    <div class="coupon-right">
      <div class="name" :class="{disabled: disabled}">
        <span class="text">{{item.couTypeTitle}}</span>
      </div>
      <div class="time-wrapper" :class="{disabled: disabled}">
        <template>
          <p class="tips" v-if='qfCoupon'>
            激活后自动充值到石化零钱包账户中
          </p>
          <p class='tips2'>
            {{item.couActiveDesc}}
          </p>
        </template>
        <!-- 已使用 -->
        <template v-if="curType == 'getUsedCoupons'">
          <p class="name time" v-if="item.checkOuName">使用门店:{{item.checkOuName}}</p>
          <p class="time" v-if="item.usedTime">使用时间:{{item.usedTime}}</p>
          <p class="time" v-else-if="item.postState">当前状态:{{item.postState}}</p>
        </template>
        <!-- 未使用 -->
        <template v-else-if="curType == 'getExpiredCoupons'">
          <p class="time">失效时间:{{item.validEndDate}}</p>
        </template>
        <template v-else>
          <p class='time' v-if="qfCoupon" style='margin-top: 6px;'>激活有效期：{{setHour(item.validStartDate)}}-{{setHour(item.validEndDate)}}</p>
          <p class="time" v-else-if="item.validType!=3">有效期:{{setHour(item.validStartDate)}}-{{setHour(item.validEndDate)}}</p>
          <p class="time" v-else>有效期:领取后{{item.validDays}}天有效</p>
        </template>
        <!--1，安徽（扫码充值）展示二维码-->
        <!--2，江西（人工充值） 不展示二维码-->
        <!--3，湖北（线上充值） 跳转到无卡加油-->

        <!--充值券特殊显示-->
        <!--        <span class="btn" :class="[formatCouType(item.couTypeCategoryAlias)]"-->
        <!--              :style="styleObject(item.couTypeCategoryAlias)"-->
        <!--              v-if="!disabled && hasBtn">{{status}}</span>-->
      </div>
      <div class="status" v-if="unCenter && curType !== 'getExpiredCoupons' && !qfCoupon">
        <template v-if="item.couTypeCategoryAlias === 'CZ' && (couponQrCodeEnabled == 2)">
          <span v-if="disabled">{{used ?'充值完成，去圈存' : '已过期'}}</span>
          <span v-else>{{item.isActive === 0 ? '需加油激活' : '预计到账时间下月20日'}}</span>
        </template>
        <!--        item.couCount 待确认，布局2 有这个字段，如果去掉，布局1展示按钮，导致页面放不下-->
        <span class="account" v-if="!disabled && (item.couTypeCategoryAlias === 'SC' ||  hasBtn) && item.couCategory != 30">
          <!-- <span class="total-count" :style="styleObject(item.couTypeCategoryAlias)"
                :class="[formatCouType(item.couTypeCategoryAlias)]" v-if="couponLayoutType == 2 && user != 5"><span>共{{item.couCount}}张</span> <span>></span> </span> -->
          <span v-if='!qfCoupon' class="btn" :style="styleObject(item.couTypeCategoryAlias)"
                :class="[formatCouType(item.couTypeCategoryAlias)]">{{status}}</span>
          <van-icon v-if='!qfCoupon' name="arrow" color='#F02C2D'/>
        </span>
      </div>
      <div class="used" v-if="used">
        <img class="used-img" src="../../../../../static/image/coupon/used.png" alt="">
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  // couCategory  券类型 10：代金券；20：满减券；30：兑换券；40：折扣券 60 生日券
  // 商城券 bg-color-0 非油券 bg-color-1 洗车券 bg-color-2 充值券 bg-color-3 加油券 bg-color-4
  //  汽油券		JY
  //  商城券		SC
  //  充值券		CZ
  //  第三方合作券		DSF
  //  便利店		BLD
  const couCategory = {
    'JY': 'bg-color-4',
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
      curType:String,
      couponLayoutType: [String, Number] // 1 普通布局 2，分组布局
    },
    data() {
      return {}
    },
    created() {
      
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
      qfCoupon() {
        if(this.item.couTypeCategoryAlias == 'JY' && this.item.isActive === 0) {
          return true
        } else {
          return false
        }
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
        } else {
          str = '点击使用'
        }
        return str
      },
      couponQrCodeEnabled() {
        return this.$store.state.globalConfig.couponQrCodeEnabled || 1
      }
    },
    methods: {
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
          // 如果是加油券，展示加油券的券详情
          if(coupon.couTypeCategoryAlias == 'JY') {
            this.$router.push({
            path: '/my_coupon',
              query: {couNo: coupon.couNo}
            })
            return
          }
          this.activeHandle(coupon)
          // this.$toast('待激活')
          return
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
          // 洗车券为qf，如果配置url跳转url如果没有配置跳转二维码详情
          // 布局为分组并且是列表
          if (this.couponLayoutType == 2 && this.user !== 5) {
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
          console.log(coupon.couCategory);
          this.$router.push({
            path: '/mall2/couponexchange',
            query: {couNo: coupon.couNo}
          })
        } else{
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
          this.$router.push({
            path: '/coupon_detail',
            query: {couNo: coupon.couNo,couTypeCategoryAlias: coupon.couTypeCategoryAlias,refuelGsOuCode:JSON.stringify(coupon.couTypeUseConditionModel.refuelGsOuCode),refuelGsOuCodeOp: coupon.couTypeUseConditionModel.refuelGsOuCodeOp}
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
            this.$emit('load')
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
  .actived{
    background: url(../../images/djh.png) no-repeat right top;
    background-size: auto 40%;
  }
  .expicon{
    background: url(../../images/shixiao.png) no-repeat 98% center;
    background-size: auto 50%;
  }
  .useicon{
    background: url(../../images/used.png) no-repeat 98% center;
    background-size: auto 50%;
  }
  .coupon-container {
    border-radius 4px;
    overflow: hidden
    box-shadow: 0 0 9px 0 rgba(197, 197, 197, 0.3);
    // background-size 100% 100%;
    background-repeat: no-repeat
    background-color: #fff;
    display flex
    padding:10px 0;
    min-height 100px;

    .coupon-left {
      width 120px
      text-align: center
      padding 0 5px;
      display flex
      justify-content space-around
      align-items center
      flex-direction column
      background-size: 100% 100% !important
      background-repeat: no-repeat !important
      border-right: 0.5px solid #999;
      &.disabled{
        .tip{
            background: linear-gradient(to bottom,#DDDDDD,#CCCCCC);
          }
      }
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
      .tip{
          padding: 5px 12px;
          background: linear-gradient(to bottom,#FF8279,#F02C2D);
          border-radius: 16px;
          margin-top: 5px;
          color: #fff;
        }
      .msg {
        flex-shrink 0
        font-size: 12px;
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
          font-size: 12px;
          margin-right: 4px;
        }

        &.disabled {
          color: #909090;
          
        }

        .text {
          vertical-align middle
          line-height 20px
        }
      }

      .time-wrapper {
        // padding-top: 6px;
        /*display: flex*/
        /*justify-content space-between*/
        /*align-items center*/
        .tips{
          font-size: 12px;
          margin-top: 5px;
          color: #333;
          line-height: 26px;
        }
        .tips2{
          font-size: 12px;
          margin-top: 5px;
          color: #333333
        }
        .name {
          padding-right: 36px;
          
          line-height: 16px
        }

        .time {
          padding-top: 5px;
          font-size: 13px;
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
    .status {
      font-size: 10px;
      color: #999
      padding-top: 8px;
      display flex
      justify-content space-between

      .account {
        padding-right 10px;

        .total-count {
          padding 2px 4px;
          font-size: 14px;
          border-radius 8px;
          font-weight: 600
          /*display flex*/
          /*align-items center*/
        }
      }

      .btn {
        padding: 1px 0;
        border-radius 20px;
        color: #F02C2D;
        font-size: 13px;
      }
    }
  }
</style>
