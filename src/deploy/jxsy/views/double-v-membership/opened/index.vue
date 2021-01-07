
<template>
  <nav-content>
    <div class="contentImg">
      <div class="contentImgUserInfo">
        <div class="userInfoImg">
          <img :src="userInfo.headImg || 'static/image/double-v-membership/头像@2x.png'" alt />
        </div>
        <div class="userInfoText">
          <span >{{userInfo.userName}}</span>
          <span v-if="statusObj.state != 2 && statusObj.isEffect == 0">待生效</span>
          <span v-if="statusObj.state != 2 && statusObj.isEffect == 1" @click="popupCancel=true">取消会员</span>
          <span v-if="statusObj.state == 2">会员</span>
        </div>
      </div>
      <div class="contentImgBottom">
        <span></span>
        <span>{{`${new Date().getFullYear()}年${new Date().getMonth() + 1}月会员特权`}}</span>
      </div>
    </div>
    <div class="list">
      <scroll
        :pullUpLoad="true"
        :listenScroll="true"
        :data="equityArr"
        :hasMore="isCanLoadMore">
        <van-collapse v-model="activeNames" accordion @change="changeCollapse">
          <div class="equity" v-for="(item,index) in openAccess" :key="index">
            <div class="mark">
              <span class="text">{{`特权${turnNumber[index+1]}`}}</span>
            </div>
            <div class="equity-details">
              <div class="equity-details-left">
                <span>{{item.activityTitle}}</span>
                <div class="content" v-html="item.activityDesc"></div>
              </div>
              <div class="equity-details-right" v-if='statusObj.isEffect'>
                <img src="static/image/double-v-membership/icon1@2x.png" alt/>
              </div>
            </div>
          </div>
          <div class="equity" v-for="(item,index) in equityArr" :key="`equityArr${index}`">
            <div class="mark">
              <span class="text">{{`特权${turnNumber[index+1+openAccess.length]}`}}</span>
            </div>
            <div class="equity-details" :class="{detailsBottom: index ==0}">
              <div class="equity-details-left">
                <span>{{statusObj.isEffect ? item.mktActivityTitle : item.activityTitle}}</span>
                <div class="content" v-if="statusObj.isEffect" v-html="item.mktActivityDesc"></div>
                <div class="content" v-else v-html="item.activityDesc"></div>
              </div>
              <div class="equity-details-right" v-if="statusObj.isEffect">
                <span class="btn" v-if="couListState(item.couList)" @click="receive(item)">领取</span>
                <img v-else src="static/image/double-v-membership/icon1@2x.png" alt/>
              </div>
            </div>
            <van-collapse-item :name="index" v-if="statusObj.isEffect && !couListState(item.couList)">
              <div slot="title">{{activeNames === index?'权益详情 （仅限当月使用）':'点击可查看权益详情'}}</div>
              <div class="equity-details details-list" v-for="(res,index) in item.arr" :key="index">
                <div class="equity-details-left">
                  <span>{{res.couTypeTitle}}</span>
                </div>
                <div class="equity-details-right">
                  <template v-if="res.isActive ==1 || res.isActive ===''">
                    <span v-if="res.mayUse" class="btn" @click="toUse(res)">去使用</span>
                    <img v-else src="static/image/double-v-membership/icon3@2x.png" alt/>
                  </template>
                  <template v-else>
                    <img src="static/image/double-v-membership/icon2@2x.png" alt/>
                  </template>
                </div>
              </div>
            </van-collapse-item>
          </div>
        </van-collapse>
        <div class="explain">
          <p>活动说明</p>
          <div class="content" v-html="cardPrompt"></div>
        </div>
      </scroll>
    </div>
    
    <van-popup v-model="popupCancel" class="popupCard" :close-on-click-overlay="false">
      <div class="popupCardText">
        <span>确认取消双V会员吗？</span>
        <span>取消后次月起不再享有会员特权，</span>
        <span>也不再扣费！</span>
      </div>
      <div class="popupCardBtn">
        <span @click="popupCancel=false">取消</span>
        <span @click="cancelConfirm">确认</span>
      </div>
    </van-popup>
    <van-popup v-model="isToUse" class="popupCard" :close-on-click-overlay="false">
      <div class="popupCardText">
        <span>确认使用该券，</span>
        <span>充值到&nbsp;{{replacePhone(userInfo.phone)}}&nbsp;的手机号码吗？</span>
      </div>
      <div class="popupCardBtn">
        <span @click="isToUse=false">取消</span>
       <span @click="toUseConfirm">确认</span>
      </div>
    </van-popup>
  </nav-content>
</template>

<script>
import mixin from "../mixin";
export default {
  name: "opened",
  mixins: [mixin],
  props: {
    statusObj: {
      type: Object,
      default: ()=>{
        return {
          isEffect: false
        }
      }
    },
    couponLayoutType: [String, Number] // 1 普通布局 2，分组布局
  },
  data() {
    return {
      isToUse: false,
      popupCancel: false,
      activeNames: -1,
      isCanLoadMore: false, // 是否可以上拉加载更多
      equityArr: [],
      toUseObj: {},
      itemObj: {},
      cardPrompt: '',
      openAccess: []
    };
  },
  beforeRouteLeave(to, from, next) {
    this.$keepaliveHelper.deleteCache(this)
    next()
  },
  created() {
    this.getNewsList()
    if (!this.statusObj.isEffect) {
      this.getVVGetCouMktList();
    } else {
      this.queryGetCouActivityAward();
    }
    this.queryCanAttendActivity();
  },
  computed:{
    couponQrCodeEnabled() {
      return this.$store.state.globalConfig.couponQrCodeEnabled || 1
    }
  },
  methods: {
    queryCanAttendActivity(){ // 开通即得活动
       this.$request.post(this.queryCanAttendActivityUrl, { orderType: 999001 }).then(res => {
        if (res.status == 0) {
          console.log(11,res)
          this.openAccess = res.data || []
        } else{
          this.$Toast(res.info)
        }
      })
    },
    couListState(couList){
      let arr = couList
      let state = false
      arr.forEach(res=>{
        if (res.state != -1) {
          state = true
          return
        }
      })
      return state
    },
    getNewsList() { // 活动说明
      this.$request.post(this.getNewsListUrl, { values: 25 }).then(res => {
        if (res.status == 0) {
          this.cardPrompt = res.data[0] ? res.data[0].content : "";
        } else{
          this.$Toast(res.info)
        }
      });
    },
    // 未生效的列表
    getVVGetCouMktList() {
      this.$request.post(this.getVVGetCouMktListUrl, { activityTag: "VV" }).then(res => {
        if (res.status == 0) {
          this.equityArr = res.data;
        } else{
          this.$Toast(res.info)
        }
      });
    },
    // 开通后的默认列表（一级）
    queryGetCouActivityAward() {
      this.$request.post(this.queryGetCouActivityAwardUrl, { alias: "VV" }).then(res => {
        if (res.status == 0) {
          let activityModelList = res.data[0];
          this.equityArr = activityModelList ? activityModelList.activityModelList : [];
        } else{
          this.$Toast(res.info)
        }
      });
    },
    // 领取
    receive(item){
      this.$request.post(this.getCouScanUrl, {mktActivityId: item.mktActivityId}).then(res => {
        if (res.status == 0) {
          if (res.data.state != 1) {
            this.$Toast('领取成功');
            this.queryGetCouActivityAward();
          } else {
            this.$Toast('领取失败');
          }
        } else{
          this.$Toast(res.info)
        }
      });
    },
    // 展开
    changeCollapse(activeNames) {
      this.activeNames = activeNames
      let equityArrObj = this.equityArr[activeNames]
      if(equityArrObj){
        this.equityArr.forEach((item,index)=>{
          this.$set(this.equityArr[index],'arr',[])
        })
        let arr = equityArrObj.couList || []
        arr.forEach(res=>{
          this.getData({mktActivityId : equityArrObj.mktActivityId , couTypeCode: res.couTypeCode},this.activeNames)
        })
      }
    },
    // 展开
    getData(obj,activeNames){
      this.getUnusedCouponsWithCols(obj,activeNames)
      this.getUsedCoupons(obj,activeNames)
    },
    // 展开
    getUnusedCouponsWithCols(obj,activeNames){
      this.$request.post(this.getUnusedCouponsWithColsUrl, obj).then(res => {
        if (res.status == 0) {
          (res.data || []).forEach(res=>{
            if (res.isActive ==1 || res.isActive =='') {
              this.$set(res,'mayUse',true)
            }
          })
          this.equityArr.forEach((item,index)=>{
            if(activeNames == index){
              this.equityArr[index].arr = []
              this.equityArr[index].arr.push(...(res.data || []))
            }
          })
        } else{
          this.$Toast(res.info)
        }
      });
    },
    // 展开
    getUsedCoupons(obj,activeNames,couTypeCode){
      this.$request.post(this.getUsedCouponsUrl, obj).then(res => {
        (res.data || []).forEach(res=>{
          if (res.isActive ==1 || res.isActive =='') {
            this.$set(res,'mayUse',false)
          }
        })
        if (res.status == 0) {
          this.equityArr.forEach((item,index)=>{
            if(activeNames == index){
              this.equityArr[index].arr.push(...(res.data || []))
            }
          })
        } else{
          this.$Toast(res.info)
        }
      });
    },
    // 取消会员
    cancelConfirm() {
      this.$request.post(this.cancelTwoVMemberUrl, {phone: this.userInfo.phone,}).then(res => {
        if (res.status == 0) {
          this.popupCancel = false;
          this.$Toast("取消成功");
          this.checkTwoVMemmber();
          // this.$router.go(0)
        } else{
          this.$Toast(res.info)
        }
      });
    },
    // 去使用
    toUse(item) {
      this.toUseObj = item
      if (item.couTypeCategoryAlias === 'SC') {
        let path = '/mall2/list/' + this.$util.getDataString()
        this.$router.push({
          path: path,
          query: {
            pageType: 'coupon',
            coupon: item.couTypeCode,
            couThresholdAmount: item.couThresholdAmount,
            couFaceValue: item.couFaceValue,
            lastPath: this.$route.path,
            endTime: this.$util.getDateFromString(item.validEndDate)
          }
        })
      } else if (item.couTypeCategoryAlias === 'DSFJK') {
        this.isToUse = true
      } else if (this.couponQrCodeEnabled == 3) {
        this.$router.push({
          path: '/addCard',
          query: {couNo: item.couNo}
        })
      } else {
        if (this.couponLayoutType == 2) {
          this.$router.push({
            path: '/coupon_detail2',
            query: {couTypeCode: item.couTypeCode, couFaceValue: item.couFaceValue}
          })
        } else {
          this.$router.push({
            path: '/coupon_detail',
            query: {couNo: item.couNo}
          })
        }
      }
    },
    // 去使用 
    toUseConfirm() {
      this.couNo()
    },
    couNo(){
      this.$request.post(this.getMyCouInfoUrl, {couNo: this.toUseObj.couNo || ''}).then(res => {
        if (res.status == 0) {
          this.dynamicCode(res.data.dynamicCode || '')
        } else{
          this.$Toast(res.info)
        }
      });
    },
    dynamicCode(dynamicCode){
      this.$request.post(this.useVVCouUrl, {dynamicCode: dynamicCode}).then(res => {
        if (res.status == 0) {
          this.isToUse = false;
          this.$Toast("充值成功");
          this.activeNames = -1,
          this.queryGetCouActivityAward();
        } else {
          this.$Toast(res.info)
        }
      });
    }
  },
  components: {
    Scroll: () => import("@/components/base/scroll/scroll")
  }
};
</script>

<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';

.contentImg {
  height: 270px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: url('../../../../../../static/image/double-v-membership/vip2@2x.png') repeat center center / 100% 100%;

  .contentImgUserInfo {
    width: 100%;
    height: 144px;
    padding: 0 36px;
    display: flex;
    align-items: center;

    .userInfoImg {
      width: 70px;
      height: 70px;
      display: flex;
      align-items: center;
      justify-content: center;

      img {
        width: 60px;
        height: 60px;
        border-radius: 30px;
      }
    }

    .userInfoText {
      height: 46px;
      width: 70px;
      margin-left: 6px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      >:first-child {
        color: #7a5923;
        font-size: 16px;
        font-weight: 500;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
      }

      >:last-child {
        color: #8f6f3f;
        padding: 3px 10px;
        display: inline-block;
        border-radius: 10px;
        border: 0.5px solid #c6b18f;
        background-color: #d8c09f;
        text-align center
      }
    }
  }

  .contentImgBottom {
    height: 22px;
    margin-left: 20px;
    margin-bottom: 10px;
    display: flex;
    justify-content: flex-start;
    align-items: center;

    >:first-child {
      height: 22px;
      width: 5px;
      background-color: #cfa968;
      display: inline-block;
      margin-right: 5px;
    }

    >:last-child {
      font-size: 17px;
      font-weight: 500;
    }
  }
}

.list {
  width: 100%;
  height: calc(100% - 270px);
  padding: 0 20px;

  .equity {
    width: 100%;
    background-color: #fff;
    box-shadow: 0 1px 8px #efefef;
    border-radius: 8px;
    margin-bottom: 15px;
    position: relative;

    /deep/ .van-cell__title {
      margin-left: 24px;
      font-size: 12px;
      color: #6f6c6c;
    }

    .detailsBottom {
      border-bottom: 0.5px solid #f3f3f3;
    }

    .equity-details {
      padding: 18px 0;
      display: flex;
      align-items: center;

      .equity-details-left {
        flex: 1;
        margin-left: 40px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        line-height: 26px;

        >:first-child {
          width: 200px;
          font-size: 18px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .content {
          color: #6f6c6c;
        }
      }

      .equity-details-right {
        width: 70px;
        height: 100%;
        display: flex;
        align-items: center;
        margin-right: 10px;
        justify-content: center;

        img {
          width: 50px;
          height: 50px;
        }

        .btn {
          width: 93%;
          height: 25px;
          display: block;
          border-radius: 12px;
          background-color: #e0c083;
          line-height: 25px;
          color: #fff;
          text-align: center;
          flex-shrink: 0;
          font-size: 14px;
        }
      }
    }

    .details-list {
      border: 0.5px solid #dcdcdc;
      border-radius: 8px;
      margin: 2px 0 8px;
      height: 70px;
      color: #000;

      .equity-details-left {
        margin-left: 20px;
      }
    }
  }
  .explain {
    padding-top 24px
    p {
      font-size: 14px;
      margin-bottom: 6px;
    }

    .content {
      /deep/ p {
        display: inline-block;
        color: #4a4545;
        margin: 2px 0;
        line-height: 18px;
      }
    }
  }
  /deep/ .pullup-wrapper{
    display none
  }
}
</style>
