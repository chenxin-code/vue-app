<template>
  <div class="body">
    <nav-top @backEvent="$router.go(-1)" title="我的微店"></nav-top>
    <nav-content>
      <van-cell-group v-if="showView && $store.state.globalConfig.microshop_open != 1">
        <van-field v-model="employeeCode" label="员工号" disabled/>
        <van-field v-model="employeeName" label="员工姓名" disabled/>
        <van-field v-model="phone" type="tel" label="手机号" disabled/>
        <van-field v-model="departmentName" label="所属部门" disabled/>
        <div class="publicInvoiceDiv">
          <div>
            <input placeholder="请输入短信验证码" v-model="msgCode"/>
          </div>
          <div class="mingxi">
            <count-button class="theme_standard_font" @getSmsEvent="getMsgCode" :phone="phone"
                          ref="countBtn"></count-button>
          </div>
        </div>
      </van-cell-group>
      <!-- <div class="emptyDiv" v-if="$store.state.globalConfig.microshop_open == 1">
        <img src="static/image/invoice/p4@2x.png" alt="">
        <span>微店尚未开通！</span>
      </div> -->
      <div class="openDiv" v-if="$store.state.globalConfig.microshop_open == 1">
        <div class="divPic">
          <div>
            <img class="img"
                 :src="$store.state.globalConfig.microshop_backgroundurl?$store.state.globalConfig.microshop_backgroundurl:'static/image/microShop/mishbac.png'"
                 alt="">
          </div>
          <div class="radios">
            <div class="div1">
              <div class="agree">
                <div class="ifselect" :class="(isChecked ? 'is-selected': 'unselect')" @click="allSelect()">
                  <i class="selected-icon"></i>
                </div>
                <p class="text">我同意<span ><router-link to="/micro_sho/agreement">《微店开通条款》</router-link></span></p>
              </div>
            </div>
            <div class="answer theme_bg_red1 theme_bg_red2" @click="submit"
                 v-if="$store.state.globalConfig.microshop_open == 1 && isChecked == false">申请开通
            </div>
            <div class="answer theme_bg_red1" @click="submitBtn"
                 v-if="$store.state.globalConfig.microshop_open == 1 && isChecked == true">申请开通
            </div>
          </div>
        </div>
      </div>
      <div class="noPass" v-if="!showView && $store.state.globalConfig.microshop_open != 1">
        <div><img src="static/image/microShop/icon.png" alt=""></div>
        <p class="p1">很遗憾，微店申请未通过...</p>
        <p class="p2">原因：{{reason}}</p>
      </div>
      <div class="answerBox">
        <div class="answer theme_bg_red" @click="commit"
             v-if="showView && $store.state.globalConfig.microshop_open != 1">立即申请
        </div>
        <div class="answer theme_bg_red" @click="commitAgain"
             v-if="!showView && $store.state.globalConfig.microshop_open != 1">重新提交申请
        </div>
      </div>
    </nav-content>
    <van-popup v-model="successView" class="successBox" @click-overlay="returnUp">
      <img class="img1" src="static/image/microShop/succee-icon.png">
      <p>申请成功！</p>
    </van-popup>
    <van-popup v-model="stateView" class="successBox" @click-overlay="returnUp">
      <img src="static/image/microShop/shen.png">
      <p>正在审核中，敬请期待......</p>
    </van-popup>
    <div v-show="referrer">
      <van-popup v-model="referrer" class="successBox successBox1 " :close-on-click-overlay="false">
        <div class="referrerUser">
          <div class="referrer">
            <span class="span">开店邀请码</span>
            <div class="sacn">
              <mt-field label="邀请码" placeholder="请输入邀请码" @change="changeRfrCodeType" v-model="referrerUserId">
                <img src="static/image/fuelcard//btn_Sweep.png" width="25" height="25" @click="sweep"/>
              </mt-field>
            </div>
            <span class="tip" v-if="info">{{info}}</span>
          </div>
          <div class="grayBtn">
            <span @click="referrer = false">无邀请码</span>
            <span class="theme_bg_red" @click="getReferrer">提交邀请码</span>
          </div>
        </div>
      </van-popup>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import api from "./api";
  import {Toast} from 'vant'
  import store from "../../../vuex/store";
  import {mapGetters, mapMutations} from "vuex";
  import CountButton from '@/components/commonui/count-button';

  export default {
    name: "openIndex",
    mixins: [api],
    data() {
      return {
        employeeCode: '',
        employeeName: '',
        phone: '',
        departmentName: '',
        departmentNo: '',
        radio: false,
        isChecked:false,
        msgCode: '',
        showView: true,
        registerView: false,
        reason: '',
        stateView: false,
        backgroundImgUrl: '',
        successView: false,
        referrerUserId: '',
        closeView: false,
        referrer: false, //推荐人信息
        rfrCodeType: '', // 推荐码获取方式  1手动输入  2扫一扫员工二维码
        info: '', //推荐人错误提示
      }
    },
    watch: {
      msgCode(val) {
        this.msgCode = this.$util.checkVerifyCodeLenght(this.msgCode);
      }
    },
    created() {

    },
    mounted() {
      console.log(222, this.$store.state.globalConfig.microshop_backgroundurl)
      if (this.$store.state.globalConfig.microshop_open == 1) {
        let that = this
        let params = {
          token: that.$store.state.login.token,
        }
        that.stateDatahn(params).then(res => {
          if (res.data.status == 0) {
            let data = res.data.data || {}
            if (data.empFlag == 0) { //1 是员工 0 会员
              this.referrer = true
            }
          } else {
            Toast(res.data.info)
          }
        })
      } else {
        this.loadState()
        this.loadDetail()
      }
    },
    computed: {
      ...mapGetters(["getPutaggregate"]),
    },
    methods: {
      ...mapMutations(['putaggregate']),
      loadState() {
        let that = this
        let params = {
          token: that.$store.state.login.token,
        }
        that.stateData(params).then(res => {
          if (res.data.result === 'success') {
            that.reason = res.data.data.reviewOpinion
            let stateObj = res.data.data
            // store.commit('putaggregate', stateObj)
            this.putaggregate(stateObj)
            if (stateObj.approvalState == 0) { //审核中
              that.stateView = true
            } else if (stateObj.approvalState == 2) { //未通过
              that.showView = false
            } else if (stateObj.approvalState == 1) { //已通过

            }
          } else {
            Toast(res.data.info)
          }
        })
      },
      allSelect() {
        if(!this.isChecked){
          this.isChecked = true;
        }else {
          this.isChecked =false;
        }
      },
      changeRfrCodeType() {
        this.rfrCodeType = 1
      },
      sweep() {
        this.$bridgefunc.scanCode(res => {
          this.rfrCodeType = 2
          this.theScanCode = res.code;
          this.referrerUserId = res.code;
        })
      },
      loadDetail() {
        let that = this
        let params = {
          token: that.$store.state.login.token,
        }
        that.detailData(params).then(res => {
          if (res.data.result === 'success') {
            let data = res.data.data
            that.employeeCode = data.employeeCode,
              that.employeeName = data.employeeName,
              that.phone = data.phone,
              that.departmentName = data.departmentName
            that.departmentNo = data.departmentNo
          } else {
            Toast(res.data.info)
          }
        })
      },
      getReferrer() { //保存推荐人信息
        let params = {
          token: this.$store.state.login.token,
          referrerUserId: this.referrerUserId,
          rfrCodeType: this.rfrCodeType
        }
        this.$request.post('/app/json/micro_store_front_end/saveReferrerUserId', params).then(res => {
          console.log(res);
          if (res.result == 'success') {
            this.$toast('提交成功')
            this.referrer = false
          } else {
            this.info = res.info || ''
            this.$Toast(res.info)
          }
        })
      },
      //获取短信验证码
      getMsgCode: function (imgVerifyCode, uuid) {
        if (this.phone == '') {
          this.$Toast('手机号不能为空!')
          return
        } else if (!this.$util.checkMobile(this.phone)) {
          this.$Toast('请输入正确的手机号码！')
          return
        }
        this.$refs.countBtn.startTime();
        this.$Loading.open();
        let url = '/app/json/login/sendSms';

        let paramsData = {
          smsType: '1020',
          phone: this.phone,
          imgVerifyCode: imgVerifyCode,
          uuid: uuid
        };


        this.$http.post(url, paramsData).then(res => {
            this.$Loading.close();
            console.log(res.data)
            let data = res.data;
            if (data.status == 0) {
              this.$Toast('获取验证码成功');
            } else {
              this.$refs.countBtn.resetClock();
              this.$Toast(data.info ? data.info : '获取短信验证码失败')
            }
          },
          err => {
            this.$Loading.close();
            this.$refs.countBtn.resetClock();
            this.$Toast('系统运行过程中遇到问题，请稍候再试')
          }
        )
      },
      submit() {
        this.$Toast('请先勾选开通条款')
      },
      submitBtn() {
        this.$router.push({
          path: '/micro_sho/authentication'
        })
      },
      commit() {
        let that = this
        if (that.msgCode == '') {
          this.$Toast('验证码不能为空')
          return;
        }
        this.$Loading.open()
        let params = {
          token: that.$store.state.login.token,
          employeeCode: that.employeeCode,
          employeeName: that.employeeName,
          phone: that.phone,
          phoneCode: that.msgCode, //短信
          departmentName: that.departmentName,
          departmentNo: that.departmentNo
        }
        that.applyData(params).then(res => {
          this.$Loading.close()
          if (res.data.result === 'success') {
            that.successView = true
          } else {
            Toast(res.data.info)
          }
        })
      },
      commitAgain() {
        this.showView = true
      },
      returnUp() {
        this.$router.go(-1)
      },
    },
    components: {
      CountButton
    },
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  .nav-content {
    background white;
    overflow-y auto
  }

  .body {
    background #f6f6f6 !important;

    .van-cell-group {
      margin-top 10px;

      /deep/ .van-field__control {
        text-align: right;
      }

      /deep/ .van-field__control:disabled {
        color: #323233;
      }
    }

    .answerBox {
      display flex
      justify-content center
    }

    .answer {
      // position: fixed;
      // bottom: 70px;
      // left: 2%;
      width: 92%;
      height: 40px;
      line-height: 40px;
      text-align: center;
      color: white;
      border-radius 30px;
      font-size: 16px;

      a {
        display: block;
        width: 100%;
        height: 50px;
        line-height: 50px;
        color: white;
        font-size: 18px;
      }
    }

    .theme_bg_red1 {
      background #ff6500
      width auto
      padding: 0px 25px;
      margin: auto 0;
    }

    .theme_bg_red2 {
      opacity 0.5
    }

    .emptyDiv {
      text-align center;
      font-size 16px;
      padding: 40px 0;

      img {
        width 200px;
        display block
        margin 0 auto
      }
    }

    .publicInvoiceDiv {
      display: flex;
      justify-content: space-between;
      padding: 0.266667rem 0.4rem;
      line-height: 0.64rem;
      font-size 13px

      div:nth-child(1) {
        width 70%
      }

      .nei {
        /deep/ .van-field__control {
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }

      .mingxi {
        width 120px;
        display flex
        justify-content space-around
        align-items center
        margin auto;
        border-left: 0.026667rem solid #dedede;
        padding-left: 0.266667rem;

        /deep/ .count-button1 {
          color #ff001d;
        }

        span {
          color #ff001d;
        }
      }
    }

    .noPass {
      width 100%;
      /*height 240px;*/
      margin-top 10px;
      background white;
      text-align center;
      padding 20px 0;
      overflow hidden;

      div {
        text-align center;
        width: 100px;
        display: ma;
        margin: 0 auto 12px auto;

        img {
          width 100%;
        }
      }

      .p1 {
        font-size 16px;
        margin-bottom 12px;
      }

      .p2 {
        font-size 14px
        margin-top 12px;
      }
    }

    .openDiv {
      height: 100%

      .divPic {
        width 100%
        margin-bottom 80px

        .img {
          width: 100%
        }
      }
    }

    .stateBox {
      z-index: 2001;
      height: 180px;
      line-height: 180px;
      width: 80%;
      text-align: center;
      font-size: 16px;
    }
    .successBox {
      width: 80%;
      text-align: center;
      font-size: 0.426667rem;
      display: flex;
      flex-direction: column;
      padding: 40px 0;
      border-radius: 10px;

      img {
        width 120px;
        margin auto
      }

      .img1 {
        width 80px;
      }

      p {
        margin auto
        margin-top 10px;
      }
    }
    .successBox1 {
      padding: 15px 0 40px 0;
    }

  }

  .radios {
    display: flex
    justify-content space-around
    position: fixed;
    bottom: 0;
    width: 100%;
    background: white;
    height: 80px;
    z-index 99

    .radiosbox {
      display flex
      justify-content center

      .van-checkbox__icon {
        font-size: 14px
      }
    }

    .div1 {
      font-size: 14px;
      margin: auto 0;
      .agree{
        padding:25px 0px 15px 0px;
        display: flex;
        justify-content: center;
        align-items center
        .ifselect{
          extend-click()
          width:15px;
          height:15px;
        }
        .unselect{
          .selected-icon{
            width:15px;
            height:15px;
            display:block;
            background:url("../../../../static/image/login2/unselect.png")0px 0px no-repeat;
            background-size:15px 15px;
          }
        }
        .is-selected{
          .selected-icon{
            width:15px;
            height:15px;
            display:block;
            background:url("../../../../static/image/login2/selected.png")0px 0px no-repeat;
            background-size:15px 15px;
          }
        }
        .text{
          padding-left:6px;
          color:#999;
          font-size:$font-size-medium-s;
          span{
            color:#ee2c2d;
          }
        }
      }

      a {
        color #ff6500
      }
    }

    .van-radio__label {
      color: #7b7b7b;
      font-size: 14px;
    }
  }

  .referrerUser {
    .referrer {
      margin-bottom 50px
      .span {
        margin: 10px 0 25px 0;
        display: block;
      }
      .sacn {
        display flex
        justify-content space-between

        img {
          width auto
        }
      }
      .tip {
        width: 94%;
        display: block;
        text-align: right;
        font-size: 14px;
        color: #f80f16;
        margin: 15px auto 0 auto;
      }
    }

    .grayBtn {
      display: flex;
      justify-content: space-between;
      position: fixed;
      bottom: 0;
      width: 100%;
      height: 60px;
      line-height: 60px;
      border-top: 1px solid #f1eded;
      span {
        width 50%
      }
      span:nth-child(1) {
        border-right: 1px solid #f1eded;
      }
      span:nth-child(2) {
       color white
      }
    }
  }

  /deep/ .router_class {
    background-color #f6f6f6 !important;
  }

  /deep/ .mint-field-core {
    border-bottom: 1px solid #c9c1c1;
  }

  /deep/ .mint-field .mint-cell-title {
    width auto
    padding 0 8px
  }
  /deep/ .mint-cell {
    min-height: 0;
  }
</style>
