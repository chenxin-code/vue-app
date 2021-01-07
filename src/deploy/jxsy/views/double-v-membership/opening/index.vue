
<template>
  <div>
    <nav-content>
      <div class="contentImg">
        <div class="contentImgBottom">
          <span></span>
          <span>会员特权</span>
        </div>
      </div>
      <div class="list">
        <scroll :pullUpLoad="true" :listenScroll="true" :data="equityArr.concat(openAccess)" :hasMore="isCanLoadMore"  >
          <div class="equity" v-for="(item,index) in openAccess" :key="index">
            <div class="mark">
              <span class="text">{{`特权${turnNumber[index+1]}`}}</span>
            </div>
            <div class="equity-details">
              <div class="equity-details-left">
                <span>{{item.activityTitle}}</span>
              </div>
            </div>
          </div>
          <div class="equity" v-for="(item,index) in equityArr" :key="`equityArr${index}`">
            <div class="mark">
              <span class="text">{{`特权${turnNumber[index+1+openAccess.length]}`}}</span>
            </div>
            <div class="equity-details">
              <div class="equity-details-left">
                <span>{{item.activityTitle}}</span>
              </div>
            </div>
          </div>
          <div class="explain">
            <p>活动说明</p>
            <div class="content" v-html="cardPrompt"></div>
          </div>
        </scroll>
      </div>
    </nav-content>
    <div class="bottom-btns">
      <span @click="openingBtn">10元/月，确认开通</span>
    </div>
    <van-popup v-model="popupPhoneInfo" class="popupPhoneInfo">该活动仅限江西移动用户参加！</van-popup>
    <van-popup v-model="isOpening" class="popupCard" :close-on-click-overlay="false">
      <div class="popupCardText">
        <span>开通双V会员10元/月，</span>
        <span>可享受更多特权，请确认是否开通！</span>
        <!-- <span>非首次试用，开通后次月生效并收取费用！</span> -->
      </div>
      <div class="popupCardBtn">
        <span @click="isOpening=false">取消</span>
        <span @click="isOpeningTrue">开通</span>
      </div>
    </van-popup>
    <van-popup v-model="popupCard" class="popupCard" :close-on-click-overlay="false">
      <div class="popupCardText">
        <span>您尚未绑定加油卡，</span>
        <span>需要绑定加油卡后方可参与活动！</span>
      </div>
      <div class="popupCardBtn">
        <span @click="popupCard=false">取消</span>
        <span @click="openingCard">立即绑定</span>
      </div>
    </van-popup>
  </div>
</template>

<script>
import mixin from "../mixin";
export default {
  name: "opening",
  mixins: [mixin],
  data() {
    return {
      isOpening: false,
      popupCard: false,
      popupPhoneInfo: false,
      isCanLoadMore: false, // 是否可以上拉加载更多
      cardPrompt: "",
      equityArr: [],
      openAccess: []
    };
  },
  beforeRouteLeave(to, from, next) {
    this.$keepaliveHelper.deleteCache(this)
    next()
  },
  mounted() {
    this.getNewsList();
    this.getVVGetCouMktList();
    this.queryCanAttendActivity();
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
    getVVGetCouMktList() { // 权益
      this.$request.post(this.getVVGetCouMktListUrl, { activityTag: "移动双V会员" }).then(res => {
        let data = res.data;
        if (res.status == 0) {
          this.equityArr = data;
        }  else{
          this.$Toast(res.info)
        }
      });
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
    openingBtn() {
      let obj = { phone: this.userInfo.phone };
      this.$request.post(this.getPhoneInfoUrl, obj).then(res => { // 验证是否是江西移动手机号
        if (res.status == 0) {
          let phoneInfoObj = res.data.data;
          let resultObj = JSON.parse(phoneInfoObj.replace(/\s*/g, ""));
          if (resultObj.code != "1") {
            this.popupPhoneInfo = true;
          } else {
            this.checkBindOilCard(obj);
          }
        }  else{
          this.$Toast(res.info)
        }
      });
    },
    checkBindOilCard(obj) {
      this.$request.post(this.checkBindOilCardUrl, obj).then(res => { // 验证是否绑卡
        if (res.status == 0) {
          this.popupCard = !res.data;
          this.isOpening = res.data;
        }  else{
          this.$Toast(res.info)
        }
      });
    },
    isOpeningTrue() {
      this.$request.post(this.addTwoVMemberUrl, { phone: this.userInfo.phone,}).then(res => { // 确认开通
        if (res.status == 0) {
          this.$Toast("开通成功");
          this.isOpening = false
          this.$emit('checkTwo')
        }  else{
          this.$Toast(res.info)
        }
      });
    },
    openingCard() { // 跳转绑卡
      this.$router.push({
        path: "/addCard"
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
  justify-content: flex-end;
  background: url('../../../../../../static/image/double-v-membership/vip1@2x.png') repeat center center / 100% 100%;

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
  height: calc(100% - 336px);
  padding: 10px 20px;

  .equity {
    width: 100%;
    background-color: #fff;
    box-shadow: 0 1px 8px #efefef;
    border-radius: 8px;
    margin-bottom: 10px;
    position: relative;

    .equity-details {
      height: 85px;
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
          font-size: 18px;
        }
      }
    }
  }

  .explain {
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
}

.bottom-btns {
  position: absolute;
  left: 0px;
  right: 0px;
  bottom: 0px;
  height: 60px;
  z-index: 20;
  display: flex;
  justify-content: center;
  align-items: center;

  span {
    width: 340px;
    height: 40px;
    color: #fff;
    font-size: 16px;
    border-radius: 30px;
    display: inline-block;
    background-color: #e0c083;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

/deep/ .pullup-wrapper {
  display: none;
}

.popupPhoneInfo {
  height: 20%;
}
</style>
