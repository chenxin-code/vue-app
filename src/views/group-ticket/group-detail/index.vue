<template>
  <div class="box">
    <nav-top @backEvent="backEvent" :bgImg="require('../image/banner上@2x.png')"></nav-top>
    <nav-content>
      <div class="cart-top" v-if="$store.state.webtype == 2" />
      <background :groupDetail='groupDetail' @timeOut='timeOut'/>
      <div class="all-content">
        <template v-if="Object.keys(groupDetail).length">
          <groupDetail :groupCoupon='groupDetail' :isLeader="true" />
          <template v-if="groupDetail.state == 1 || groupDetail.state == 2 || groupDetail.state == 9 || groupDetail.state == 10 || groupDetail.state == 20">
            <!-- 团长 -->
            <div class="group-member-wrapper" v-if="isGroupLeader">
              <div class="msg" v-if="groupDetail.state == 2 && !countDownTimeout">
                还差<span class="font-18" style="color:#f80f16"> {{residueNum}} </span>人即可获得神券！
              </div>
              <div class="msg un-used" v-if="groupDetail.state == 20">
                活动已过期！
              </div>
              <div class="msg" v-if="groupDetail.state == 10 ">
                 <span>拼团成功，恭喜获得神券！</span>
              </div>
              <template v-if="groupDetail.state == 2 || groupDetail.state == 9 || groupDetail.state == 10 || groupDetail.state == 20">
                <div class="member-list">
                  <div class="member-item" v-for="(item, index) in groupDetail.orderItemList" :key="index">
                    <div v-show="showAll || index < 5">
                      <template v-if="item">
                        <div class="member-avatar-wrapper">
                          <div class="member-avatar">
                            <img class="img" :src="item.userAvatar" alt="">
                          </div>
                          <span class="tit" v-if="item.isLeader == 1">团长</span>
                        </div>
                        <div class="member-name ellipsis">{{item.decodeUserNickName}}</div>
                      </template>
                      <template v-else="">
                        <div class="member-avatar">
                          <img class="img addImg" src="../image/addp.png">
                        </div>
                        <div class="member-name ellipsis">待邀请</div>
                      </template>
                    </div>
                  </div>
                </div>
                <div class="show-all-btn" v-if="groupDetail.orderItemList.length>5" @click="showAll = !showAll">
                  <span class="v-middle">{{showAll ? '收起' : '查看全部'}}</span>
                </div>
              </template>
              <template v-if="groupDetail.state == 1 && groupDetail.leaderUserId == 0 &&  percent >= 100">
                <div class="btn-group">
                  <span>已抢光！</span>
                </div>
                <div class="btn-group">
                  <span @click="moreGoodVouchers" style="width:250px" class="btn">去查看更多好券</span>
                </div>
              </template>
              <template v-if="groupDetail.state == 1 && groupDetail.leaderUserId != 0 &&  percent < 100">
                <div class="btn-group">
                  <span>开团有机会获得神券哦！</span>
                </div>
                <div class="btn-group">
                  <span class="btn" style="width:250px" :disabled="disabled" @click="startGroup">立即开团</span>
                </div>
              </template>
              <template v-if="groupDetail.state == 2 && !countDownTimeout">
                <div class="btn-group">
                  <span @click="invitation" class="btn">邀请好友</span>
                  <span @click="moreGoodVouchers" class="btn">去查看更多好券</span>
                </div>
              </template>
              <template v-if="groupDetail.state == 9 || countDownTimeout">
                <div class="btn-group">
                  <span>开团有机会获得神券哦！</span>
                </div>
                <div class="btn-group">
                  <span class="btn" style="width:250px" @click="startGroup">重新开团</span>
                </div>
              </template>
              <template v-if="groupDetail.state == 10 || groupDetail.state == 20">
                <div class="btn-group">
                  <span @click="moreGoodVouchers" style="width:250px" class="btn">去查看更多好券</span>
                </div>
              </template>
            </div>
            <!-- 团员 -->
            <div class="group-member-wrapper" v-if="!isGroupLeader">
              <template v-if="groupDetail.state == 2 && !countDownTimeout">
                <div class="msg" v-if="!hasJoin">
                  还差<span class="font-18" style="color:#f80f16"> {{residueNum}} </span>人即可获得神券！
                </div>
                <div class="msg" v-else>
                  助力成功，还差<span class="font-18" style="color:#f80f16"> {{residueNum}} </span>人！
                </div>
              </template>
              <template v-if="groupDetail.state == 20">
                <div class="msg un-used">
                  活动已过期！
                </div>
              </template>
              <template v-if="groupDetail.state == 10">
                <div class="msg">
                  <span v-if="hasJoin">拼团成功，恭喜获得神券！</span>
                  <span v-else>抱歉您来晚了，团长已拼成神券！</span>
                </div>
              </template>
              <!-- <template v-if="(groupDetail.state == 2 || groupDetail.state == 9 || groupDetail.state == 10 || groupDetail.state == 20) && (groupDetail.state == 2?!countDownTimeout:true)"> -->
              <template v-if="groupDetail.state == 2 || groupDetail.state == 9 || groupDetail.state == 10 || groupDetail.state == 20">
                <div class="member-list">
                  <div class="member-item" v-for="(item, index) in groupDetail.orderItemList" :key="index">
                    <div v-show="showAll || index < 5">
                      <template v-if="item">
                        <div class="member-avatar-wrapper">
                          <div class="member-avatar">
                            <img class="img" :src="item.userAvatar" alt="">
                          </div>
                          <span class="tit" v-if="item.isLeader == 1">团长</span>
                        </div>
                        <div class="member-name ellipsis">{{item.decodeUserNickName}}</div>
                      </template>
                      <template v-else="">
                        <div class="member-avatar">
                          <img class="img addImg" src="../image/addp.png">
                        </div>
                        <div class="member-name ellipsis">待邀请</div>
                      </template>
                    </div>
                  </div>
                </div>
                <div class="show-all-btn" v-if="groupDetail.orderItemList.length>5" @click="showAll = !showAll">
                 <span class="v-middle">{{showAll ? '收起' : '查看全部'}}</span>
                </div>
              </template>
              <template v-if="groupDetail.state == 1 && groupDetail.leaderUserId == 0 &&  percent >= 100">
                <div class="btn-group">
                  <span>已抢光！</span>
                </div>
                <div class="btn-group">
                  <span @click="moreGoodVouchers" style="width:250px" class="btn">去查看更多好券</span>
                </div>
              </template>
              <template v-if="groupDetail.state == 1 &&  percent < 100">
                <div class="btn-group">
                  <span>开团有机会获得神券哦！</span>
                </div>
                <div class="btn-group">
                  <span class="btn" style="width:250px" :disabled="disabled" @click="startGroup">立即开团</span>
                </div>
              </template>
              <template v-if="groupDetail.state == 2 && !countDownTimeout">
                <div class="btn-group" v-if='!hasJoin'>
                  <span class="btn" style="width:250px" @click="help">为TA助力</span>
                </div>
                <div class="btn-group" v-else>
                  <span @click="invitationJoin" class="btn">我也要抢神券</span>
                  <span @click="moreGoodVouchers" class="btn">去查看更多好券</span>
                </div>
              </template>
              <template v-if="groupDetail.state == 10 || countDownTimeout">
                <div class="btn-group">
                  <span @click="invitationJoin" class="btn">我也要抢神券</span>
                  <span @click="moreGoodVouchers" class="btn">去查看更多好券</span>
                </div>
              </template>
              <template v-if="groupDetail.state == 20">
                <div class="btn-group">
                  <span>活动已过期！</span>
                </div>
                <div class="btn-group">
                  <span @click="invitationJoin" class="btn">我也要抢神券</span>
                  <span @click="moreGoodVouchers" class="btn">去查看更多好券</span>
                </div>
              </template>
            </div>
            <div class="help-leader-wrapper">
              <div class="msg">
                <span class="text">帮团长助力立即获得以下好券</span>
              </div>
              <groupDetail :groupCoupon='groupDetail' :isLeader="false" />
            </div>
          </template>
          <!-- 商品 -->
          <recommend :couTypeCode='groupDetail.couTypeCode'/>
        </template>
        <div class="no-list" v-else>
          <div class="img-div">
            <img src="../image/拼券.png" />
          </div>
          <div class="tip theme_font_gray">暂无数据~</div>
        </div>
      </div>
    </nav-content>
    <van-popup v-model="shareView" class="stateBox">
      <img src="static/image/microShop/jiantou@2x.png" alt="">
      <p>请点击右上角进行分享</p>
    </van-popup>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Config from "@/api/config";
import wxfunc from '@/utils/wxfunc'
import groupDetail from "../common/detail.vue";
import background from "../common/background.vue";
import recommend from "../common/recommend/index.vue";
export default {
  data() {
    return {
      shareView: false,
      groupDetail: {},
      showAll: false, // 查看全部
      countDownTimeout: false,
      recommendSkuList: [{name:'', id:''}]
    };
  },
  components: {
    groupDetail,
    recommend,
    background
  },
  mounted() {
    this.orderId = this.$route.query.orderId || ''
    this.mktGroupBuyId = this.$route.query.mktGroupBuyId || ''
    this.pageInit();
  },
  methods: {
    backEvent(){
      this.$router.go(-1);
    },
    rules(){
      this.$router.push({
        path: '/group_ticket/rules'
      })
    },
    linkTo(){
      this.$router.push({
        path: '/group_ticket/my_vouchers'
      })
    },
    moreGoodVouchers(){
      this.$router.push({
        path: '/group_ticket/home'
      })
    },
    timeOut(){
      this.countDownTimeout = true
    },
    invitation(){
      let shareData = {};
      shareData.title = this.groupDetail.groupBuyName
      shareData.sharetext = this.groupDetail.groupBuyDesc
      shareData.imageurl = 'http://tbdwechat.deepermobile.com/download?uploadFile.id=445914'
      shareData.detailurl = this.$store.state.globalConfig.wxBaseUrl + Config.shareUrl + `/group_ticket/group_detail/${this.$util.getDataString()}?orderId=${this.groupDetail.id}&mktGroupBuyId=${this.groupDetail.mktGroupBuyId}`
      if(this.$store.state.webtype == 2){
        this.shareView = true
        wxfunc.getWechatSignature((isSignature) => {
          //签名成功
          if (isSignature) {
            wxfunc.wxSetShareData(shareData);
            this.shareView = false
          } else {
            this.$Toast("签名失败");
          }
        })
      }else{
        this.$bridgefunc.wechatShare(shareData);
      }
    },
    invitationJoin(){
      this.mktGroupBuyId = this.groupDetail.mktGroupBuyId
      this.queryGroupDetail();
    },
    pageInit() {
      this.queryGroupDetail();
    },
    queryGroupDetail() {
      this.$Loading.open();
      this.$http.post("/app/json/app_fight_group_order/detail", {
        orderId: this.orderId,
        mktGroupBuyId: this.mktGroupBuyId
      }).then(res => {
        this.countDownTimeout = false
        if (res.data.status === 0) {
          this.groupDetail = res.data.data;
          
          let currentTime = (new Date()).getTime()
          
          if(currentTime>this.groupDetail.endDate){
            this.groupDetail.state = 20 // TODU 接口没有处理失效状态
          }
          if (
            this.groupDetail &&
            this.groupDetail.orderItemList &&
            this.groupDetail.orderItemList instanceof Array
          ) {
            const num =
              this.groupDetail.groupBuyNumOfPerson -
              this.groupDetail.currentNumOfPerson;
            for (let i = 0; i < num; i++) {
              this.groupDetail.orderItemList.push("");
            }
          } 
          console.log(2,this.groupDetail)
        } else {
          this.$Toast(res.data.info || "抢券失败");
        }
        this.$Loading.close();
      })
    },
    startGroup() {
      this.$Loading.open();
      this.$http.post("/app/json/app_fight_group_order/start", {
        number: 1,
        groupBuyType: 0,
        mktGroupBuyId: this.groupDetail.mktGroupBuyId
      }).then(res => {
        if (res.data.status === 0) {
          this.orderId = res.data.data.orderId;
          this.$Toast('开团成功！');
          this.queryGroupDetail();
        } else {
          this.$Toast(res.data.info || "开团失败");
        }
        this.$Loading.close();
      })
    },
    help() {
      this.$http.post('/app/json/app_fight_group_order/join', {number: 1, orderId: this.orderId}).then(res => {
        if (res.data.status === 0) {
          this.$Toast('助力成功！');
          this.queryGroupDetail()
        } else {
          this.$Toast(res.data.info || "助力失败！");
        }
      })
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    hasJoin() {
      let flag = false
      if (this.groupDetail && this.groupDetail.orderItemList && this.groupDetail.orderItemList instanceof Array) {
        let i = this.groupDetail.orderItemList.findIndex(item => item.userId == this.userInfo.userId)
        if (i > 0) {
          flag = true
        }
      }
      return flag
    },
    residueNum() {
      return (
        this.groupDetail.groupBuyNumOfPerson -
        this.groupDetail.currentNumOfPerson
      );
    },
    // 团券显示规则， 团长或者未开团的情况下显示团长券样式
    isLeader() {
      return this.groupDetail.leaderUserId == 0 || this.isGroupLeader;
    },
    // 是否是团长
    isGroupLeader() {
      if(this.groupDetail.leaderUserId){
        return this.userInfo.userId == this.groupDetail.leaderUserId;
      }
    },
    percent() {
      let percent = 0;
      if (this.groupDetail.leaderUserId == 0) {
        if (this.groupDetail.groupBuyNumTotal) {
          percent = Math.round(
            ((Number(this.groupDetail.currentNumOfPerson) * 10000) /
              (Number(this.groupDetail.groupBuyNumTotal) * 10000)) *
              100
          );
        }
      } else {
        if (this.groupDetail.groupBuyNumOfPerson) {
          percent = Math.round(
            ((Number(this.groupDetail.currentNumOfPerson) * 10000) /
              (Number(this.groupDetail.groupBuyNumOfPerson) * 10000)) *
              100
          );
        }
      }
      return percent;
    },
    disabled() {
      return this.percent >= 100;
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~@/common/stylus/variable.styl';
.box{
  position: relative;
  width: 100%;
  overflow: hidden;
  .cart-top{
    height 26px
    width 100%
    background: url('../image/banner上@2x.png') repeat center center / 100% 100%;
  }
  .all-content{
    width 94%
    height 80%
    margin 0 auto
    margin-top -43px
    border-radius 10px 10px 0 0
    overflow: hidden
    overflow-y: auto
    background-color #fff
    -webkit-overflow-scrolling: touch
    .no-list {
      .img-div {
        margin-top: 20px;
        text-align: center;

        img {
          width: 160px;
        }
      }

      .tip {
        margin-top: 10px;
        padding: 10px;
        font-size: 12px;
        text-align: center;
      }
    }
  }
  .group-detail {
    padding 20px;
    display flex
    flex-direction column
    align-items center

    .msg {
      font-size: 16px;
      padding-top: 6px;
      padding-bottom: 14px;
    }
    .btn {
      width 250px
      display inline-block
      background #f80f16
      border-radius 40px
      color: #fff
      padding 10px 0
      font-size: 16px;
      text-align center
    }
  }
  .group-member-wrapper {
    background-color #fff
    padding 20px 10px;
    .msg {
      text-align: center;
      color: $color-theme;
      &.un-used {
        color: #999;
      }
    }
    .member-list {
      overflow: hidden
      padding-top: 15px
      .member-item {
        width 20%;
        float: left;
        padding 0 10px;
        // margin-bottom 10px
        box-sizing border-box
        .member-avatar-wrapper {
          position: relative
          .tit {
            position absolute
            left: 50%;
            display inline-block
            transform translateX(-50%)
            bottom: 0;
            font-size: 10px;
            // border: 0.5px solid #add97a
            color: #fff
            background: #f80f16
            padding 2px 4px;
            border-radius 15px;
            width 76%;
            text-align: center
          }
        }
        .member-avatar {
          width 100%
          padding-bottom: 100%;
          border-radius 50%;
          overflow: hidden
          background: #f1f1f1
          position: relative

          .img {
            width 50px;
            height 50px
            position absolute
            left: 0;
            top: 0;
            right: 0;
            bottom: 0
          }
          .addImg{
            width 36px;
            height 36px
            left: 6px;
            top: 4px
            opacity: 0.6
          }
        }
        .member-name {
          padding-top 6px;
          text-align: center
          font-size: 12px;
        }
      }
    }
    .show-all-btn {
      text-align: center
      padding-top: 15px
      color #f80f16
      .more {
        width 16px;
        height 20px;
        display inline-block
        margin-left: 8px;
        vertical-align middle
        // background: url('../image/banner下@2x.png') repeat center center / 100% 100%;
      }
    }
    .btn-group {
      padding-top: 15px;
      display flex
      justify-content center
      .btn {
        // flex 1
        width 120px
        border-radius 40px;
        padding 12px 0
        font-size: 14px;
        text-align: center
        background #f80f16
        color #fff
        & + .btn {
          margin-left: 16px;
          background none
          color #f80f16
          border 1px solid #f80f16
        }
      }
      .default {
        border: 0.5px solid $color-theme
        color: $color-theme
      }
      .primary {
        background: $color-theme
        color: #fff;
      }
    }
  }
  .help-leader-wrapper {
    .msg {
      font-size: 12px;
      text-align: center
      padding 11px;
      color: $color-gray
      position: relative
      .text {
        position: relative
        &:after, &:before {
          content: ''
          position: absolute
          border-top: 0.5px solid #f02c37;
          width 80px;
          height 1px
          right: 110%
          top: 50%;
          transform translateY(-50%)
        }
        &:before {
          right auto
          left 110%;
        }
      }
    }
  }
}
  >>> .stateBox {
    z-index: 2001;
    /*height: 180px;*/
    /*line-height: 180px;*/
    width: 80%;
    text-align: center;
    font-size: 16px;
    color white;
    top 200px;

    img {
      width 80px;
      margin 0 0 15px 160px;
    }
  }

  >>> .van-popup {
    background transparent;
    overflow-y hidden
  }

  >>> .van-overlay {
    background-color rgba(0, 0, 0, 0.6)
  }
</style>
