<template>
  <div>
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="navclass">
      <div class="banner">
        <img :src="donateItem.projectPic" />
      </div>
      <div class="curr-root">
        <van-progress
          class="progress"
          track-color="#DCDDDD"
          color="#F02C2D"
          stroke-width="5px"
          :percentage="donatePercent > 100 ? 100 : donatePercent"
          :show-pivot="false"
        />
        <div class="donate-current">
          <div class="intent">
            <div class="intent-curr">{{donateItem.curDonationUnit}}</div>
            <div class="intent-plan">目标 {{donateItem.projectExpect}}</div>
          </div>
          <div>
            <div
              class="intent-curr"
            >{{donateItem.curDonationCnt ==''?'0':donateItem.curDonationCnt}}</div>
            <div class="intent-plan">爱心 (份)</div>
          </div>
          <div>
            <div class="intent-curr">{{donatePercent}}%</div>
            <div class="intent-plan">捐赠进度</div>
          </div>
        </div>
      </div>
      <div class="item-name">
        <div class="item-title">{{donateItem.projectName}}</div>
        <div class="item-des">{{donateItem.projectIntro}}</div>
      </div>
      <div class="item-read">
        <div class="item-read-title">项目说明</div>
        <div class="item-detail" v-html="donateItem.projectDesc"></div>
        <!-- <img src='./img/banner.png'/> -->
      </div>
      <div class="emtpy"></div>
      <div class="donate-btn" @click="toDonate">我要捐助</div>
        <van-popup class="popup" v-model="showInputPop" position="bottom">
          <div v-if="showInputPop">
        <donate-input
          :integrations_p="integrations"
          :currentIntegrate_p="currentIntegrate"
          :integralList_p="integralList"
          :myintegralList_p="myintegralList"
          :remark_p="remark"
          @agreeToDonateDo="agreeToDonateDo($event)"
        ></donate-input>
        </div>
      </van-popup>
    </nav-content>
  </div>
</template>
<script>
import donateInput from './components/donate-input';
  import DigitalPwd from "@/components/mall2/common/digital-pwd";
  import md5String from "@/utils/md5";

export default {
  components: {donateInput},
  data() {
    return {
      showInputPop:false,
      donateItem:'',
      donatePercent:0,
      integrations: [
        { type: 0, value: 10,selected:false},
        { type: 1, value: 50, selected:false},
        { type: 2, value: 100, selected:false},
        { type: 3, value: 1000, selected:false},
      ],
      currentIntegrate:'0',
      integralList:'',
      myintegralList:'',
      payDigitals:[],//虚拟支付信息
      isNeedPayPwd:false,
      digitalPWD:'',
      currObjData:'',
      remark:''
    }
  },
  methods: {
    toDonate(){
        this.myintegralList = '';
        this.integrations.forEach(e=>{
            e.selected = false;
        });
        this.showInputPop = true;
    },
    getAccountBaseInfo() {
        // 获取积分接口
        let paramsData = {
          acctType: 3
        }
        this.$http.post('/app/json/acct/getAccountBaseInfo', paramsData).then(res => {
          let data = res.data
          if (data.status == 0) {
            this.integralList = data.data.balanceUnit;
          } else {
            this.$Toast('获取当前积分失败');
          }
        }).catch(err=>{
            this.$Toast(err);
        });
     },
     agreeToDonateDo(args){
        this.currentIntegrate = args.currentIntegrate;
        this.integralList = args.currentIntegrate;
        this.myintegralList = args.myintegralList;
        this.remark = args.remark;
        if(this.myintegralList == '' && this.currentIntegrate == ''){
          // debugger
          this.$Toast('捐赠积分不能为空');
          return;
        }else{
          if(this.myintegralList!=''){
            if(parseInt(this.myintegralList)>= parseInt(this.integralList)){
                 this.$Toast('捐赠的积分不能超过当前剩余积分');
                 return;
            }
          }else{
              if(parseInt(this.currentIntegrate.value)>= parseInt(this.integralList)){
                 this.$Toast('捐赠的积分不能超过当前剩余积分');
                 return;
              }
          }
        }
        this.settleAccounts();
     },
     settleAccounts(){//去结算
        let url = '/app/json/shopping_donate/settle';
        let params = {
           projectId:this.donateItem.id,
           payDigital:[]
        }
        if(this.currentIntegrate == ''||this.currentIntegrate == 0){
           params.donateValue = this.myintegralList;
        }else{
           params.donateValue =  this.currentIntegrate.value;
        }
        this.$Loading.open();
        this.$http.post(url,params).then(res=>{
          this.$Loading.close();
          if(res.data.status == 0){
            let digitalList = res.data.data.digitalList;
            this.currObjData = res.data.data;
            if(digitalList && digitalList.length>0){
                digitalList.forEach(e=>{
                  if(e.acctTypeCode == 3){
                    let payObj = e;
                    this.payDigital = [];
                    if(payObj.payDigital > payObj.fixedDigital){
                        this.payDigitals.push({acctType:payObj.acctType,
                            userBalanceDigital:payObj.userBalanceDigital,
                            payDigital:payObj.userCanUseDigital + payObj.fixedDigital
                         })
                    }else{
                      this.payDigitals.push({acctType:payObj.acctType,
                        userBalanceDigital:payObj.userBalanceDigital,
                        payDigital:payObj.userCanUseDigital + payObj.fixedDigital
                      })
                    }
                  }
                });
                this.isNeedPayPwd = res.data.data.needPayPwd;
                this.toXiaDan(this.isNeedPayPwd);
            }
          }else{
            this.$Toast(res.data.info);
          }
        }).catch(err=>{
          this.$Loading.close();
        });
     },
     toXiaDan(isNeedPayPwd){//去下单
        if(isNeedPayPwd){
            this.checkNeedPwd(isNeedPayPwd);
        }else{
            this.submitOrder();
        }
     },
     submitOrder(){
        let url = '/app/json/shopping_donate/submit';
        let params = {
           projectId:this.donateItem.id,
           payDigital:this.payDigitals,
           remark:this.remark
        }
        if(this.currentIntegrate == ''||this.currentIntegrate == 0){
           params.donateValue = this.myintegralList;
        }else{
           params.donateValue =  this.currentIntegrate.value;
        }
        this.$Loading.open();
        if(this.digitalPWD && this.digitalPWD.length>0){
            params.payPwd = md5String(this.digitalPWD);
        }
        this.$http.post(url,params).then(res=>{
            this.$Loading.close();
            let {status,info,data} = res.data;
            if(status == 0){
              this.$router.replace({path:'/donate-result',query:{donateItem:this.donateItem}});
              this.$keepaliveHelper.deleteCache(this);
            }else{
              this.$Toast(info);
            }
            this.showInputPop = false;
        }).catch(err=>{
            this.$Loading.close();
            this.showInputPop = false;
        });
     },
     checkNeedPwd(isNeedPayPwd) {
        // needPayPwd: false, // 是否需要支付密码
        // payPwdState: 0, // 支付密码状态 0 未设置支付密码 1 支付密码已锁定 2 已设置支付密码
        this.digitalPWD = "";
        if (isNeedPayPwd) {
          // 是否需要支付密码
          let hasDigitail = true;
          if (hasDigitail) {
            // 是否需要虚拟支付
            if (this.currObjData.payPwdState == "1") {
              this.$Toast("支付密码已锁定，请稍后再试！");
              return;
            }
            DigitalPwd.open({
              initData: {
                payPwdState: this.currObjData.payPwdState
              },
              toSettingPwd: () => {
                this.$router.push({
                  path: "/usercenter/nosetpwd",
                  query: {
                    isSet: 0
                  }
                });
                DigitalPwd.close();
              },
              inputFinished: value => {
                this.digitalPWD = value;
                this.submitOrder();
                DigitalPwd.close();
              }
            });
          } else {
            this.submitOrder();
          }
        } else {
          this.submitOrder();
        }
      },
    // agreement(){
      // let url = '/app/json/news/getNewsList';
      // let data = {values:52};
      // this.$http.get(url,{params:data}).then(res=>{
      //   // bannerContent
      //   let {status,info,data} = res.data;
      //     if(status == 0){
      //       debugger
      //       //  this.bannerContent = this.$util.replaceH5Img(data[0].content);
      //     }else{
      //         this.$Toast(info);
      //     }
      // }).catch(err=>{
      //     this.$Toast(err);
      // });
    // }
  },
    created() {
      this.getAccountBaseInfo();
      this.donateItem = this.$route.query.donateItem;
      this.donateItem.curDonationUnit = this.donateItem.curDonationUnit==''?'0':this.donateItem.curDonationUnit;
      this.donateItem.projectDesc = this.$util.replaceH5Img(this.donateItem.projectDesc);
      this.donatePercent = parseFloat(this.donateItem.curDonationUnit)/parseFloat(this.donateItem.projectExpect) * 100;
      this.donatePercent = this.donatePercent.toFixed(2)
    },
    beforeRouteLeave(to,from,next) {
     if(to.path == '/donate-home'){
        this.$keepaliveHelper.deleteCache(this)
     }
     next();
  },
};
</script>
<style lang="stylus" scoped type="text/stylus">
img {
  width: 100%;
}

.navclass {
  display: flex;
  flex-direction: column;
  background-color: #F6F6F6;
  width: 100%;
  overflow-x: hidden;
  overflow-y: scroll;

  .banner {
    width: 100%;

    img {
      width: 100%;
      height: 120px;
    }
  }

  .curr-root {
    padding: 10px 10px;
    background-color: #FFFFFF;

    .progress {
      height: 5px;
    }

    .donate-current {
      margin-top: 10px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      text-align: center;

      .intent-curr {
        color: #F02C2D;
        font-size: 14px;
      }

      .intent-plan {
        color: #999999;
        font-size: 12px;
        margin-top: 6.5px;
      }
    }
  }

  .item-name {
    margin: 10px 10px 0px 10px;
    padding: 10px 10px;
    background-color: #FFFFFF;
    border-radius: 5px;

    .item-title {
      font-size: 15px;
      color: #333333;
      font-weight: 500;
    }

    .item-des {
      margin-top: 10px;
      color: #666666;
      font-size: 12px;
      text-align: left;
      min-height: 14px;
      line-height: 14px;
    }
  }

  .item-read {
    margin: 10px 10px 0px 10px;
    padding: 10px 10px;
    background-color: #FFFFFF;
    border-radius: 5px;

    .item-read-title {
      font-size: 13px;
      color: #333333;
      font-weight: 500;
    }

    .item-detail {
      margin-top: 10px;
      color: #666666;
      font-size: 12px;
      text-align: left;
      min-height: 14px;
      line-height: 14px;
    }

    img {
      margin-top: 10px;
      width: 100%;
      height: 100px;
      border-radius: 5px;
    }
  }

  .emtpy {
    flex: 1;
  }

  .donate-btn {
    margin-bottom: 0px;
    background-color: #F02C2D;
    line-height: 49px;
    font-size: 18px;
    text-align: center;
    color: #FFFFFF;
    font-weight: 500;
  }
}
</style>
