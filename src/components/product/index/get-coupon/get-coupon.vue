/**Created by LiuYong on 2020-11-03*/

<template>
  <div class="get-coupon" :class="{isFloat : moduleData.isFloat}" :style="getWrapStyle">
    <div v-if="configuration" class="coupon-group coupon-show">
      <img src="static/images/get-coupon/8.png">
    </div>
    <template v-else>
      <template v-if="couList.length">
        <ul class="coupon-group">
          <li class="coupon-list" v-for="(couponInfo, idx) in couList" :key="couponInfo.ruleId">
            <div class="coupon-image"><img src="static/images/get-coupon/9.png"></div>
            <div class="coupon-info">
              <div class="conpon-info-col_1">
                <div class="row-title">{{ couponInfo.couTypeTitle }}</div>
                <div class="row-discount">{{ couponInfo | discount}}</div>
              </div>
              <div class="conpon-info-col_2">
                <div v-if="receive">待使用</div>
                <div v-else-if="dayType == 'after'">已结束</div>
                <div v-else-if="couponInfo.state != -1">待领取</div>
                <div v-else>已领完</div>
              </div>
            </div>
          </li>
        </ul>
        <sbx-progress v-if="!receive" color="#F7C64D" :percentage="getPercentage()" />
      </template>
      <div v-else style="text-align:center;">暂时没有可领的券</div>
    </template>
    <div class="counpon-footer">
      <template v-if="receive">
        <div class="btn-submit" :class="{...hotareaClass(moduleData,true), 'btn-disabled': false}" @click="hotEvent(moduleData.idCode);getCoupons()">
          <img :src="btnSubmitImage" :style="{ height:moduleData.btnHeight+'px' }">
        </div>
      </template>
      <template v-else>
        <!-- 活动未开始 -->
        <template v-if="dayType == 'before' && !configuration">
          <div class="counpon-footer-text">开始时间：{{getFilterTime(couActivity.mktStartTime)}}</div>
        </template>
        <!-- 活动期间按钮 -->
        <template v-if="dayType=='during' || configuration">
          <div class="btn-submit" :class="{...hotareaClass(moduleData,true), 'btn-disabled': false}" @click="hotEvent(moduleData.idCode);getCoupons()">
            <img :src="btnSubmitImage" :style="{ height:moduleData.btnHeight+'px' }">
          </div>
          <template v-if="!hasCoupon">
            <div v-if="nextCouActivity != null" class="counpon-footer-text">下一场预告：{{getFilterTime(nextCouActivity.mktStartTime)}}</div>
            <div v-else class="counpon-footer-text">活动已结束</div>
          </template>
        </template>
        <!-- 活动已结束 -->
        <template v-if="dayType == 'after' && !configuration">
          <div class="counpon-footer-text">活动已结束</div>
        </template>
      </template>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex';
  import Bus from "../bus";
  import hee from "../_js/hotarea-extend-event";
  import wxfunc from '@/utils/wxfunc'
  import CircleProgress from '@/components/mall2/coupon//base/circle.vue'
  import SbxProgress from './base/sbx-progress';

  export default {
    name: "get-coupon",
    mixins: [hee],
    components: {CircleProgress,SbxProgress},
    data() {
      return {
        couponData: {}, // 专享券
        couActivity: {}, // 当前选择的券数组
        nextCouActivity: null, // 当前选择的券数组
        receive:false, // 是否已领取
        beginTime:false,  // 是否在活动时间内
        hasCoupon:true, // 还有券
        dayType:'before', // before:活动未开始，during:活动期间，after：活动结束
        lastDay:false, // 活动最后一天
      }
    },
    props: ['myIndex', 'usePorpData', 'propData'],
    computed: {
      configuration(){
        return this.$store.state.webtype == -1
      },
      btnSubmitImage(){
        const moduleData = this.moduleData;
        return this.receive
          ? 'static/images/get-coupon/10.png' // 已领取过-显示去使用
          : this.hasCoupon
          ? moduleData.btnImage || 'static/images/get-coupon/7.png' // 还有券-显示立即领取
          : moduleData.btnFinishedImage || 'static/images/get-coupon/11.png'  // 已领完
      },
      pageData: function () {
        if (this.usePorpData == true) {
          return this.propData;
        }
        return this.$store.state.pageData;
      },
      moduleData: function () {
        return this.pageData.moduleList[this.myIndex].data;
      },
      getWrapStyle(){
        const data = this.moduleData;
        const style = {};
        style.backgroundImage = `url(${data.bgImg})`
        let isFloat = this.moduleData.isFloat
        if (isFloat) {
          style.position = this.$store.state.webtype == -1
            ? 'absolute'
            : 'fixed';
          style.marginTop = data.floatUp+'px';
        }
        return style;
      },
      couList(){
        return this.couActivity.couList || [];
      },
    },
    methods: {
      regLastDay(startTime,endTime){
        let simulationTime = startTime + 1000*60*60*24;
        this.lastDay = new Date(simulationTime).getDate() == new Date(endTime).getDate();
      },
      getPercentage(){
        let distRewardCnts = 0; // 已领
        let limitRewardCnts = 0; // 全部
        this.couList.map(couInfo => {
          distRewardCnts += couInfo.distRewardCnt;
          limitRewardCnts += couInfo.limitRewardCnt;
        })
        if(distRewardCnts >= limitRewardCnts) {
          this.hasCoupon = false;
        }
        let percantage = this.calCent(distRewardCnts,limitRewardCnts);
        return percantage;
      },
      testLength(num){
        return (num+'').length>1 ? num : '0'+num
      },
      getFilterTime(time){
        let mktStartTime = 'xxxx年xx月xx日 xx:xx:xx';
        if(time){
          const date = new Date(time)
          mktStartTime = `${date.getFullYear()}年${this.testLength(date.getMonth()+1)}月${this.testLength(date.getDate())}日 ${this.testLength(date.getHours())}:${this.testLength(date.getMinutes())}:${this.testLength(date.getSeconds())}`;
        }
        return mktStartTime;
      },
      /**
       * @description 热力统计事件
       */
      hotEvent(eKey=''){
        this.actionBtnEvent(this.pageData.pgCode, this.moduleData.idCode + eKey)
      },
      testBegin(){
        const couActivity = this.couActivity;
        let date = new Date();
        // let date = new Date(new Date().getTime()+1000*60*60*1);
        let mktStartTime = new Date(couActivity.mktStartTime);
        let mktEndTime = new Date(couActivity.mktEndTime);
        if(date<mktStartTime){
          // 活动未开始
          this.dayType = 'before';
        }else if(date>mktEndTime){
          // 活动已结束
          this.dayType = 'after';
        }else{
          // 活动期间
          this.regLastDay(mktStartTime,mktEndTime);
          this.dayType = 'during'
          let hour = date.getHours();
          this.testBeginTime(hour);
        }
      },
      testBeginTime(hour){
        let startHour = 0;
        let endHour = 24;
        if(this.$store.state.globalConfig.yn_coupon_login_type == 1){ // 云南环境
          startHour = 10
        }
        this.beginTime = hour>=startHour && hour<endHour;
      },
      getCouActivityAward() {
        let hasLogin = this.$store.state.login.token!='';
        let url = hasLogin
          ? '/app/json/app_market/queryGetCouActivityAward' // 已登录
          : '/app/json/app_market/queryGetCouActivityAwardWithoutToken' // 未登录
        let params = {
          // province: this.$store.state.indexData.province,
          // city: this.$store.state.indexData.city
          provinceId: this.$store.state.indexData.provinceId || '',
          cityId: this.$store.state.indexData.cityId || '',
          countryId: this.$store.state.indexData.countryId || '',
          townId: this.$store.state.indexData.townId || ''
        }
        this.$Loading.open();
        this.$http.post(url, params).then(res => {
          this.$Loading.close();
          let data = res.data
          if (data.status == 0) {
            if (data.data) { // 有数据
              this.couponData = data.data;
              for(let i=0; i<data.data.length; i++){
                let activityModelList = data.data[i].activityModelList;
                if(activityModelList.length){
                  // todo
                  this.setCouActivity(activityModelList);
                  this.testBegin();
                  if(hasLogin) this.testReceive(this.couList);
                  break;
                }
              }
            }
          }
          this.pageInit = true
        })
      },
      getTime(date) {
        return new Date(date).getTime()
      },
      setCouActivity(activityModelList){
        let couActivity = {};
        let sortArr = activityModelList
          .sort((a,b) => this.getTime(a.mktStartTime) - this.getTime(b.mktStartTime))
        let filterArr = sortArr
          .filter(item => this.getTime(item.mktEndTime) >= Date.now())
        if(filterArr.length){
          couActivity = filterArr[0];
          filterArr[1] ? this.nextCouActivity = filterArr[1] : null;
        }else{
          couActivity = sortArr[sortArr.length - 1];
        }
        this.couActivity = couActivity;
      },
      existCoupon(){
        let hasCoupon = true;
        if(this.couList.length){
          const item = this.couList[0];
          let distRewardCnt = Number(item.distRewardCnt); // 已派发
          let limitRewardCnt = Number(item.limitRewardCnt); // 可派发
          if(distRewardCnt>=limitRewardCnt){
            // 没有可领取的券时
            hasCoupon = false;
          }
        }else{
          hasCoupon = false;
        }
        return hasCoupon
      },
      showMessageBox(text){
        this.$MessageBox.alert(text, "提示", {confirmButtonText: "确定"}).then(action => {
          this.$router.replace({path:'/usercenter/downloadshare',query:{fromCoupon:'1'}})
        });
      },
      getCoupons(){
        let hasLogin = this.$store.state.login.token!='';
        this.testBegin();
        if(hasLogin && this.receive){
          // 已领取
          this.$market.goCouponsTarget(this.moduleData);
          return ;
        }
        if(this.existCoupon()){
          // 还有券去领取
          this.$market.getCoupons(this.couActivity.mktActivityId, this.moduleData)
          return ;
        }
        // 没有可领取的券时
        this.showMessageBox('券已领完，下次请早点来，下载APP参加更多活动。');
      },
      testReceive(couList){
        // 是否已领取 显示去使用
        if(couList.length){
          const item = couList[0];
          if(item.state == -1){
            // 无法领取
            if(this.existCoupon()){
              // 总券数量中还有剩余券
              this.receive = true;  // 用户已领取
            }
          }
        }
      },
      // 计算券领取百分比
      calCent(distRewardCnt, limitRewardCnt) {
        if (distRewardCnt && limitRewardCnt) {
          let result = Math.floor(parseInt((distRewardCnt / limitRewardCnt) * 10000)) / 100
          if (result >= 100) {
            return 100
          } else {
            return result
          }
        } else {
          return 0
        }
      },
    },
    filters:{
      discount(couponInfo){
        let dsc;
        switch(couponInfo.couCategory){
          // 满减券
          case 20 :
            let couFaceValue = Number(couponInfo.couFaceValue) > 100
              ? parseInt(couponInfo.couFaceValue)
              : couponInfo.couFaceValue;
            dsc = `满${couponInfo.couThresholdAmount}元减${couFaceValue}元`
            break;
          // 折扣券
          case 40 :
            let couDiscountValue = couponInfo.couDiscountValue * 1000 / 100;
            dsc = `满${couponInfo.couThresholdAmount}元享${couDiscountValue}折`
            break;
          // 现金券
          default :
            dsc = `立减${couponInfo.couFaceValue}元`
            break;
        }
        return dsc
      },
    },
    created() {
      try {
        wx;wxfunc.hideMeItems([
          'menuItem:share:appMessage',
          'menuItem:share:timeline',
          'menuItem:copyUrl',
          'menuItem:editTag',
          'menuItem:delete',
          'menuItem:originPage',
          'menuItem:readMode',
          'menuItem:openWithQQBrowser',
          'menuItem:openWithSafari',
          'menuItem:share:email',
          'menuItem:share:brand',
          "menuItem:share:qq",
          "menuItem:share:weiboApp",
          "menuItem:favorite",
          "menuItem:share:facebook",
          "menuItem:share:QZone",
        ])
      } catch (error) {}
      this.getCouActivityAward()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .get-coupon{
    margin: 10px;
    padding:10px;
    border:1px solid #E7B89C;
    border-radius:10px;
    background-size: 100% 100%;
    .coupon-group{
      max-height:300px;
      overflow-y:auto;
      &.coupon-show{
        min-height:200px;
        img{
          width 100%
        }
      }
      .coupon-list{
        display:flex;
        border-radius:10px;
        overflow:hidden;
        background-color #ffffff
        .coupon-image{
          flex-shrink:0;
          background-color:#FBEDDA;
          box-sizing:border-box;
          img{
            display:block;
            width 90px
            height 90px
          }
        }
        .coupon-info{
          flex-basis:0;
          flex-grow:1;
          display:flex;
          align-items center;
          padding:0 12px;
          .conpon-info-col_1{
            flex:1;
            .row-title{
              font-size:18px;
              font-weight:bold;
            }
            .row-discount{
              font-size:14px;
              margin-top:23px;
              color:#BA4440;
            }
          }
          .conpon-info-col_2{
            flex-shrink:0;
          }
        }
        +.coupon-list{
          margin-top:12px;
        }
      }
    }
    .sbx-progress{
      margin-top:20px;
    }
    .counpon-footer{
      padding-top 30px
      padding-bottom 20px
      display:flex;
      justify-content:center;
      flex-direction column;
      align-items: center;
      .btn-submit{
        border-radius:10px;
        overflow:hidden;
        img{
          display:block;
          border-radius:10px;
        }
        &.btn-disabled{
          img{
            filter: contrast(0.5);
          }
        }
        +.counpon-footer-text{
          margin-top:15px;
        }
      }
      .counpon-footer-text{
        color:#FFEDE1
      }
    }
    &.isFloat{
      top 50%
      left 50%
      width 355px
      margin:0;
      transform:translate(-50%,-50%);
      z-index 20
    }
  }
</style>
