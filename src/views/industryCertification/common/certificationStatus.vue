
<template>
  <div class="box">
    <nav-top :title="enableServiceTerms ? '服务条款' : '行业认证'" @backEvent="backEvent"></nav-top>
    <nav-content v-if="showDetail">
      <authentication :getIndustryDetail='getIndustryDetail' v-if="getIndustryDetail.userClusterModel.industryState == 0 && isAuthentication && !enableServiceTerms"/>
      <group :getIndustryDetail='getIndustryDetail' v-if="!enableServiceTerms && getIndustryDetail.userClusterModel.industryState == 1 || getIndustryDetail.userClusterModel.industryState == 2 || getIndustryDetail.userClusterModel.industryState == 3 || getIndustryDetail.userClusterModel.industryState == 5 || getIndustryDetail.userClusterModel.industryState == 6"/>
      <div v-if="enableServiceTerms && getIndustryDetail.userClusterModel.industryState == 0" class="enableService">
        <div class="rule-content">
          <div v-html="getIndustryDetail.userClusterModel.serviceTerms"></div>
        </div>
        <div class="bottom-btns">
          <p>您需要充分阅读并理解本政策的内容</p>
          <p>若你同意，请点击下方按钮开始接受我们的服务!</p>
          <span class='theme_bg_red' @click="enableServiceTermsBtn">同意并继续</span>
        </div>
      </div>
    </nav-content>
    <div class="popup">
      <van-popup v-model="popupCardKa" class="popupCard" :close-on-click-overlay="false">
        <div class="popupCardText">
          <span>您尚未绑定加油卡，</span>
          <span>需要绑定加油卡后方可参与活动！</span>
        </div>
        <div class="popupCardBtn">
          <span @click="$router.go(-1);">返回</span>
          <span @click="openingCard">立即绑定</span>
        </div>
      </van-popup>
      <van-popup v-model="industry" class="popupCard" :close-on-click-overlay="false">
        <div class="popupCardText">
          <span>当前身份证信息和驾驶证信息不一致</span>
          <span>请重新提交！</span>
        </div>
        <div class="popupCardBtn">
          <span @click="$router.go(-1);">返回</span>
          <span @click="industryBtn">确定</span>
        </div>
      </van-popup>
    </div>
  </div>
</template>
<script>
import mixin from "../mixin";
import eventBus from '@/utils/eventBus.js'
export default {
  name: "authenticationStatus",
  mixins: [mixin],
  data() {
    return {
      industry: false,
      showDetail: false,
      isAuthentication: false,
      enableServiceTerms: false,
      popupCardKa: false, // 绑卡
      getIndustryDetail: {
        userClusterModel: {}
      },
      activeContent: {
        activeObj: {
          index: 0,
          type: ''
        },
        steps: []
      },
      isActiveObj: {}
    };
  },
  mounted() {
    if (this.$route.query.id) {
      this.$request.post('/app/json/user/getIndustryDetailById', {id: this.$route.query.id}).then(res => {
        let data = res.data;
        if (res.status == 0) {
          this.getIndustryDetail = data || {}
          if (this.$route.query.replacePage) {
            this.getIndustryDetail.userClusterModel.industryState  = 0
          }
          if (this.getIndustryDetail.userClusterModel.enableServiceTerms && this.getIndustryDetail.userClusterModel.industryState == 0) {
            this.enableServiceTerms = true
          } else {
            if (this.getIndustryDetail.userClusterModel.industryState == 0) {
              this.bindOil(this.getIndustryDetail)
            }
          }
          this.showDetail = true
        } else {
          this.$Toast(res.info)
        }
      })
    } else {
      this.$Toast('未获取到群组id')
    }
  },
  methods: {
    backEvent() {
      this.$router.go(-1);
    },
    enableServiceTermsBtn() {
      this.enableServiceTerms = false
      if (this.getIndustryDetail.userClusterModel.industryState == 0) {
        this.bindOil(this.getIndustryDetail)
      }
    },
    bindOil(data) {
      let expression = JSON.parse(data.userClusterModel.expression)
      let cardList = expression.cardList || []
      if (cardList.includes('IDcard') && cardList.includes('DriverCard')) {
        if (data.isCertificate && data.isDrinving) {
          if (data.usercertificate.idcardNum != data.driverInfoModel.driveCode) {
            this.industry = true
          } else {
            this.getIsoilCard(expression.isoilCard)
          }
        } else {
          this.getIsoilCard(expression.isoilCard)
        }
      } else {
        this.getIsoilCard(expression.isoilCard)
      }
    },
    industryBtn() {
      this.$request.post('/app/json/user/industryRecertification', {}).then(res => {
        if (res.status == 0) {
          this.industry = false
          this.$router.go(-1)
        } else {
          this.$Toast(res.info)
        }
      })
    },
    getIsoilCard(isoilCard) {
      if (isoilCard == '1') {
        this.checkBindOilCard().then(res=>{
          if (res) {
            this.isAuthentication = true
          } else {
            this.popupCardKa = true
          }
        })
      } else {
        this.isAuthentication = true
      }
    },
    checkBindOilCard() {
      return new Promise((resolve, reject) => {
        let obj = { phone: this.userInfo.phone };
        this.$request.post(this.checkBindOilCardUrl, obj).then(res => { // 验证是否绑卡
          if (res.status == 0) {
            let status = res.data;
            resolve(status)
          } else{
            reject()
            this.$Toast(res.info)
          }
        });
      })
    },
    openingCard() { // 跳转绑卡
      this.$router.push({
        path: "/addCard"
      });
    },
    activeBtn(activeObj) {
      this.$refs.stepsContent.getIdentityObj(this.isActiveObj,activeObj)
    }
  },
  components: {
    group: () => import("./group.vue"),
    authentication: () => import("./authentication.vue")
  }
};
</script>

<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';

.box {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;

  /deep/ .nav-content {
    padding-top 10px
    background-color #f6f6f6
  }
  /deep/ .popup {
     /deep/ .van-popup {
      width: 76%;
      font-size: 14px;
      color: #8c8c8c;
      border-radius: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
 

  .popupCard {
    height: 160px;
    flex-direction: column;
    line-height: 26px;

    .popupCardText {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .popupCardBtn {
      width: 100%;
      color: #000;
      height: 50px;
      display: flex;
      justify-content: center;
      font-size 16px

      span {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      >:last-child {
        color #fff;
        background-color #f02e2c
      }
    }
  }
  .enableService {
    height 100%
    padding 10px 14px
    background-color #fff
    .rule-content {
      padding 10px
      height calc(100% - 110px)
      box-shadow: 1px 3px 6px #eaeaea;
      overflow-y auto
    }
    .bottom-btns {
      position: absolute;
      left: 0px;
      right: 0px;
      bottom: 0px;
      height: 110px;
      display: flex;
      flex-direction column
      justify-content: center;
      align-items: center;
      p {
        color #9e9e9e
        margin-bottom 10px
      }

      span {
        width: 340px;
        height: 40px;
        color: #fff;
        font-size: 16px;
        border-radius: 30px;
        display: inline-block;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
}
</style>
